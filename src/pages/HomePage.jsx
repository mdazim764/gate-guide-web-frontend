// src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { generateQuiz, generateQuizFromJson, getSyllabusTree, getAvailableTopics } from '../services/api';
import MultiSelectSearch from '../components/MultiSelectSearch'; // Assuming MultiSelectSearch.jsx is created
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();
  const { user, logout } = useAuth();
  
  // --- UI & DATA STATE ---
  const [mode, setMode] = useState('ai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null); // Controls which dropdown is open
  const [allSubjects, setAllSubjects] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  // --- AI MODE STATE ---
  const [selectedAiSubjects, setSelectedAiSubjects] = useState({});
  const [selectedAiTopics, setSelectedAiTopics] = useState({});
  const [customTopic, setCustomTopic] = useState('');
  const [isFullSyllabus, setIsFullSyllabus] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [quizType, setQuizType] = useState('AI');
  const [questionCount, setQuestionCount] = useState(10);
  
  // --- JSON MODE STATE ---
  const [selectedJsonSubjects, setSelectedJsonSubjects] = useState({});
  const [isJsonFullSyllabus, setIsJsonFullSyllabus] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  
  // --- DATA FETCHING ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const syllabusRes = await getSyllabusTree();
        const subjects = syllabusRes.data.map(s => ({ id: s.id, name: s.name }));
        setAllSubjects(subjects);

        const topicsRes = await getAvailableTopics();
        const topics = topicsRes.data.map(t => ({ id: t.topicId, name: t.topicName, subjectId: t.subjectId }));
        setAllTopics(topics);
      } catch (err) { setError('Could not fetch initial test data. Please check the network and refresh.'); }
    };
    loadInitialData();
  }, []);

  // --- DERIVED STATE ---
  const topicsForSelectedSubjects = useMemo(() => {
    const subjectIds = Object.keys(selectedAiSubjects);
    if (subjectIds.length === 0) return allTopics;
    return allTopics.filter(topic => subjectIds.includes(topic.subjectId));
  }, [selectedAiSubjects, allTopics]);

  // --- EVENT HANDLERS ---
  const handleDropdownToggle = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const handleStartAITest = async () => {
    setLoading(true); setError('');
    const subjectIds = Object.keys(selectedAiSubjects);
    const topicIds = Object.keys(selectedAiTopics);
    
    if (!isFullSyllabus && subjectIds.length === 0 && topicIds.length === 0 && !customTopic) {
        setError("For an AI Test, please select 'Full Syllabus' OR one or more subjects/topics, OR enter a custom topic.");
        setLoading(false);
        return;
    }
    
    const quizOptions = {
        ...(subjectIds.length > 0 && { subjectIds }),
        ...(topicIds.length > 0 && { topicIds }),
        ...(customTopic && { topicName: customTopic }),
        isFullSyllabusTest: isFullSyllabus,
        difficulty,
        quizType,
        questionCount: parseInt(questionCount, 10),
    };
    
    try {
        const response = await generateQuiz(quizOptions);
        startTest(response.data.id, response.data.questions);
        navigate(`/dummylogin/${response.data.id}`);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate the AI test.');
        setLoading(false);
    }
  };
  
  const handleStartJsonTest = async () => {
    setLoading(true); setError('');
    const jsonSubjectIds = Object.keys(selectedJsonSubjects);

    if (!isJsonFullSyllabus && jsonSubjectIds.length === 0) {
        setError('For a JSON test, please categorize it by selecting "Full Syllabus" or one or more subjects.');
        setLoading(false);
        return;
    }
     if (!quizTitle || !jsonInput) {
      setError('Please provide a title and paste the questions JSON.');
      setLoading(false);
      return;
    }

    try {
      const questionsData = JSON.parse(jsonInput);
      const firstSubjectId = isJsonFullSyllabus ? (allSubjects[0]?.id || null) : (jsonSubjectIds[0] || null);

      if (!firstSubjectId) {
          setError("Cannot create test without subjects for categorization. Data might still be loading.");
          setLoading(false);
          return;
      }
      
      const payload = { subjectId: firstSubjectId, topicName: isJsonFullSyllabus ? `Full Syllabus: ${quizTitle}` : quizTitle, questionsData };
      const response = await generateQuizFromJson(payload);
      startTest(response.data.id, response.data.questions);
      navigate(`/dummylogin/${response.data.id}`);
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON format. Please check for syntax errors.' : (err.response?.data?.message || 'Failed to create test.'));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex-shrink-0 bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dost AI - GATE Quiz Engine</h1>
          <div>
            <span className="mr-4 text-gray-700">Welcome, <strong>{user?.name || 'Azim'}</strong>!</span>
            <button onClick={() => navigate('/')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-300">View History</button>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow">Logout</button>
          </div>
      </header>
      
      <main className="flex justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex justify-center mb-8 p-1 bg-gray-200 rounded-lg">
            <button onClick={() => { setMode('ai'); setError(''); }} className={`flex-1 px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'ai' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>AI Generation</button>
            <button onClick={() => { setMode('json'); setError(''); }} className={`flex-1 px-4 py-2 text-lg font-semibold rounded-md transition-colors ${mode === 'json' ? 'bg-blue-600 text-white shadow' : 'text-gray-600'}`}>Manual JSON Test</button>
          </div>

          {mode === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <input type="checkbox" id="fullSyllabus" className="h-5 w-5 accent-blue-600" checked={isFullSyllabus} onChange={(e) => { setIsFullSyllabus(e.target.checked); if (e.target.checked) { setSelectedAiSubjects({}); setSelectedAiTopics({}); setCustomTopic(''); } }} />
                  <label htmlFor="fullSyllabus" className="ml-3 font-medium text-lg text-gray-800">Full Syllabus Test</label>
                </div>
              </div>
              {!isFullSyllabus && (
                <>
                  <MultiSelectSearch options={allSubjects} selectedItems={selectedAiSubjects} onSelectionChange={(sel) => { setSelectedAiSubjects(sel); setSelectedAiTopics({}); }} placeholder="Select one or more Subjects" name="ai-subjects" isOpen={openDropdown === 'ai-subjects'} onToggle={handleDropdownToggle}/>
                  <MultiSelectSearch options={topicsForSelectedSubjects} selectedItems={selectedAiTopics} onSelectionChange={setSelectedAiTopics} placeholder="Filter by Topic (from PYQs, optional)" name="ai-topics" isOpen={openDropdown === 'ai-topics'} onToggle={handleDropdownToggle} />
                  <div>
                    <label className="block text-gray-700 font-medium">Or enter a custom topic for AI generation:</label>
                    <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="e.g., Advanced Compiler Design" className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm" />
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div><label className="font-medium text-gray-700">Difficulty</label><select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
                <div><label className="font-medium text-gray-700">Type</label><select value={quizType} onChange={e => setQuizType(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md"><option value="AI">AI Creative</option><option value="PYQ">PYQ Style</option></select></div>
              </div>
              <div><label className="font-medium text-gray-700">Number of Questions</label><input type="number" value={questionCount} onChange={e => setQuestionCount(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md" /></div>
              <button onClick={handleStartAITest} disabled={loading} className="w-full mt-4 py-3 text-lg bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-lg">
                {loading ? 'Generating...' : 'Start AI Test'}
              </button>
            </div>
          )}
          
          {mode === 'json' && (
            <div className="space-y-6">
               <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center">
                      <input type="checkbox" id="jsonFullSyllabus" className="h-5 w-5 accent-blue-600" checked={isJsonFullSyllabus} onChange={e => { setIsJsonFullSyllabus(e.target.checked); if(e.target.checked) setSelectedJsonSubjects({}); }}/>
                      <label htmlFor="jsonFullSyllabus" className="ml-3 font-medium text-lg text-gray-800">Full Syllabus Test (Categorize under first subject)</label>
                  </div>
              </div>
              {!isJsonFullSyllabus && (
                <MultiSelectSearch options={allSubjects} selectedItems={selectedJsonSubjects} onSelectionChange={setSelectedJsonSubjects} placeholder="Select Subject(s) for Categorization" name="json-subjects" isOpen={openDropdown === 'json-subjects'} onToggle={handleDropdownToggle} />
              )}
              <div><label className="font-medium text-gray-700">Quiz Title</label><input type="text" placeholder="e.g., Final Mock Test #3" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm" /></div>
              <div><label className="font-medium text-gray-700">Questions JSON Array</label><textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-md h-64 font-mono text-sm" placeholder='[ { "text": "...", "type": "MCQ", "options": [], "correctAnswer": "..." } ]'></textarea></div>
              <button onClick={handleStartJsonTest} disabled={loading} className="w-full mt-4 py-3 text-lg bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg">
                {loading ? 'Creating...' : 'Start Test from JSON'}
              </button>
            </div>
          )}
          
          {error && <p className="text-red-600 mt-6 text-center font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
        </div>
      </main>
    </div>
  );
};
export default HomePage;