// src/pages/HomePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { generateQuiz, generateQuizFromJson, getSyllabusTree, getAvailableTopics } from '../services/api';
import MultiSelectSearch from '../components/MultiSelectSearch';
import { useAuth } from '../context/AuthContext';
import VirtualCalculator from '../components/VirtualCalculator';

const HomePage = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();
  const { user, logout } = useAuth();
  
  // --- UI & DATA STATE ---
  const [mode, setMode] = useState('ai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allSubjects, setAllSubjects] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);

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
      } catch (err) { 
        setError('Could not fetch initial test data. Please check the network and refresh.'); 
      }
    };
    loadInitialData();
  }, []);

  // --- DERIVED STATE ---
  const topicsForSelectedSubjects = useMemo(() => {
    const subjectIds = Object.keys(selectedAiSubjects);
    if (subjectIds.length === 0) return allTopics;
    return allTopics.filter(topic => subjectIds.includes(topic.subjectId));
  }, [selectedAiSubjects, allTopics]);

  // Selected counts for badges
  const selectedSubjectsCount = Object.keys(selectedAiSubjects).length;
  const selectedTopicsCount = Object.keys(selectedAiTopics).length;
  const selectedJsonSubjectsCount = Object.keys(selectedJsonSubjects).length;

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
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                <img src="/public/iitb.png" alt="GATE Guide Logo" className="h-10 w-10 rounded-full" />
              </svg> */}
              <img src="/iitb.png" alt="GATE Guide Logo" className="h-10 w-10 rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">GATE Guide</h1>
              <p className="text-blue-100 text-sm">AI-Powered Quiz Engine</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-blue-700 rounded-full px-4 py-2 flex items-center justify-center md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{user?.name || 'Guest'}</span>
            </div>
            
            <div className="flex space-x-3">
               <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </button>
              <button 
                onClick={() => navigate('/history')} 
                className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                History
              </button>
              
              <button 
                onClick={() => setShowCalculator(true)} 
                className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
                Calculator
              </button>
              
              <button 
                onClick={logout} 
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => { setMode('ai'); setIsFullSyllabus(true); }}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${isFullSyllabus && mode === 'ai' ? 'border-blue-600' : 'border-gray-200'} hover:shadow-lg transition cursor-pointer`}
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Full Syllabus</h2>
                <p className="text-gray-600 text-sm">Comprehensive AI-generated quiz</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => { setMode('ai'); setIsFullSyllabus(false); }}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${!isFullSyllabus && mode === 'ai' ? 'border-blue-600' : 'border-gray-200'} hover:shadow-lg transition cursor-pointer`}
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Topic Specific</h2>
                <p className="text-gray-600 text-sm">Focused AI quiz on selected topics</p>
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => { setMode('json'); }}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${mode === 'json' ? 'border-green-600' : 'border-gray-200'} hover:shadow-lg transition cursor-pointer`}
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Import JSON</h2>
                <p className="text-gray-600 text-sm">Upload custom questions</p>
              </div>
            </div>
          </div>
        </div>
      
        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Mode Tabs */}
          <div className="flex bg-gray-50 border-b">
            <button 
              onClick={() => { setMode('ai'); setError(''); }} 
              className={`flex items-center px-6 py-4 focus:outline-none ${mode === 'ai' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              AI Generation
            </button>
            <button 
              onClick={() => { setMode('json'); setError(''); }} 
              className={`flex items-center px-6 py-4 focus:outline-none ${mode === 'json' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
              </svg>
              Manual JSON Test
            </button>
          </div>
          
          <div className="p-6">
            {mode === 'ai' && (
              <div className="space-y-6">
                {/* Full Syllabus Option */}
                <div className={`p-4 rounded-lg transition-all duration-200 ${isFullSyllabus ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="fullSyllabus" 
                      className="h-5 w-5 accent-blue-600" 
                      checked={isFullSyllabus} 
                      onChange={(e) => { 
                        setIsFullSyllabus(e.target.checked); 
                        if (e.target.checked) { 
                          setSelectedAiSubjects({}); 
                          setSelectedAiTopics({}); 
                          setCustomTopic(''); 
                        } 
                      }} 
                    />
                    <label htmlFor="fullSyllabus" className="ml-3 font-medium text-lg text-gray-800">
                      Full Syllabus Test
                    </label>
                  </div>
                  {isFullSyllabus && (
                    <p className="mt-2 text-blue-600 text-sm ml-8">
                      A comprehensive test covering the entire GATE syllabus
                    </p>
                  )}
                </div>
                
                {/* Topic Selection */}
                {!isFullSyllabus && (
                  <div className="space-y-4 border-t border-b border-gray-100 py-6">
                    <div className="relative">
                      <div className="flex justify-between items-center">
                        <label className="block text-gray-700 font-medium mb-2">Subjects</label>
                        {selectedSubjectsCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {selectedSubjectsCount} selected
                          </span>
                        )}
                      </div>
                      <MultiSelectSearch 
                        options={allSubjects} 
                        selectedItems={selectedAiSubjects} 
                        onSelectionChange={(sel) => { 
                          setSelectedAiSubjects(sel); 
                          setSelectedAiTopics({}); 
                        }} 
                        placeholder="Select one or more Subjects" 
                        name="ai-subjects" 
                        isOpen={openDropdown === 'ai-subjects'} 
                        onToggle={handleDropdownToggle}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(selectedAiSubjects).map(([id, name]) => (
                          <span key={id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                            {name}
                            <button 
                              onClick={() => {
                                const newSelection = {...selectedAiSubjects};
                                delete newSelection[id];
                                setSelectedAiSubjects(newSelection);
                              }}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-center">
                        <label className="block text-gray-700 font-medium mb-2">Topics (Optional)</label>
                        {selectedTopicsCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {selectedTopicsCount} selected
                          </span>
                        )}
                      </div>
                      <MultiSelectSearch 
                        options={topicsForSelectedSubjects} 
                        selectedItems={selectedAiTopics} 
                        onSelectionChange={setSelectedAiTopics} 
                        placeholder="Filter by Topic (from PYQs, optional)" 
                        name="ai-topics" 
                        isOpen={openDropdown === 'ai-topics'} 
                        onToggle={handleDropdownToggle} 
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(selectedAiTopics).map(([id, name]) => (
                          <span key={id} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                            {name}
                            <button 
                              onClick={() => {
                                const newSelection = {...selectedAiTopics};
                                delete newSelection[id];
                                setSelectedAiTopics(newSelection);
                              }}
                              className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Or enter a custom topic:</label>
                      <input 
                        type="text" 
                        value={customTopic} 
                        onChange={e => setCustomTopic(e.target.value)} 
                        placeholder="e.g., Advanced Compiler Design" 
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                )}
                
                {/* Test Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Difficulty Level</label>
                    <div className="flex">
                      <button
                        onClick={() => setDifficulty('easy')}
                        className={`flex-1 py-3 px-4 ${difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-l-lg font-medium transition`}
                      >
                        Easy
                      </button>
                      <button
                        onClick={() => setDifficulty('medium')}
                        className={`flex-1 py-3 px-4 ${difficulty === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} font-medium transition`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => setDifficulty('hard')}
                        className={`flex-1 py-3 px-4 ${difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-r-lg font-medium transition`}
                      >
                        Hard
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Test Type</label>
                    <div className="flex">
                      <button
                        onClick={() => setQuizType('AI')}
                        className={`flex-1 py-3 px-4 ${quizType === 'AI' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-l-lg font-medium transition flex items-center justify-center`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        AI Creative
                      </button>
                      <button
                        onClick={() => setQuizType('PYQ')}
                        className={`flex-1 py-3 px-4 ${quizType === 'PYQ' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-r-lg font-medium transition flex items-center justify-center`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        PYQ Style
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Question Count</label>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuestionCount(Math.max(1, parseInt(questionCount) - 5))}
                        className="bg-gray-200 py-3 px-4 rounded-l-lg text-gray-700 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={questionCount}
                        onChange={e => setQuestionCount(e.target.value)}
                        min="1"
                        max="50"
                        className="flex-1 py-3 text-center border-y border-gray-300"
                      />
                      <button
                        onClick={() => setQuestionCount(parseInt(questionCount) + 5)}
                        className="bg-gray-200 py-3 px-4 rounded-r-lg text-gray-700 hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleStartAITest} 
                  disabled={loading} 
                  className="w-full mt-6 py-4 text-lg bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating AI Test...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start AI Test
                    </>
                  )}
                </button>
              </div>
            )}
            
            {mode === 'json' && (
              <div className="space-y-6">
                {/* Full Syllabus Option */}
                <div className={`p-4 rounded-lg transition-all duration-200 ${isJsonFullSyllabus ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="jsonFullSyllabus" 
                      className="h-5 w-5 accent-green-600" 
                      checked={isJsonFullSyllabus} 
                      onChange={e => { 
                        setIsJsonFullSyllabus(e.target.checked); 
                        if(e.target.checked) setSelectedJsonSubjects({}); 
                      }}
                    />
                    <label htmlFor="jsonFullSyllabus" className="ml-3 font-medium text-lg text-gray-800">
                      Full Syllabus Test (Categorize under first subject)
                    </label>
                  </div>
                </div>
                
                {/* Subject Selection */}
                {!isJsonFullSyllabus && (
                  <div className="relative">
                    <div className="flex justify-between items-center">
                      <label className="block text-gray-700 font-medium mb-2">Categorize Under</label>
                      {selectedJsonSubjectsCount > 0 && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          {selectedJsonSubjectsCount} selected
                        </span>
                      )}
                    </div>
                    <MultiSelectSearch 
                      options={allSubjects} 
                      selectedItems={selectedJsonSubjects} 
                      onSelectionChange={setSelectedJsonSubjects} 
                      placeholder="Select Subject(s) for Categorization" 
                      name="json-subjects" 
                      isOpen={openDropdown === 'json-subjects'} 
                      onToggle={handleDropdownToggle} 
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(selectedJsonSubjects).map(([id, name]) => (
                        <span key={id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          {name}
                          <button 
                            onClick={() => {
                              const newSelection = {...selectedJsonSubjects};
                              delete newSelection[id];
                              setSelectedJsonSubjects(newSelection);
                            }}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quiz Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quiz Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Final Mock Test #3" 
                    value={quizTitle} 
                    onChange={e => setQuizTitle(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                  />
                </div>
                
                {/* JSON Input */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Questions JSON Array</label>
                  <div className="bg-gray-50 p-2 rounded-t-lg border border-gray-300 border-b-0 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Paste your JSON here</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setJsonInput('')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={() => {
                          try {
                            const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
                            setJsonInput(formatted);
                          } catch (e) {
                            // If not valid JSON, don't format
                          }
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Format
                      </button>
                    </div>
                  </div>
                  <textarea 
                    value={jsonInput} 
                    onChange={e => setJsonInput(e.target.value)} 
                    className="w-full p-3 border border-gray-300 rounded-b-lg h-64 font-mono text-sm" 
                    placeholder='[ { "text": "What is the time complexity of quicksort in the average case?", "type": "MCQ", "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], "correctAnswer": "O(n log n)" } ]'
                  ></textarea>
                </div>
                
                <button 
                  onClick={handleStartJsonTest} 
                  disabled={loading} 
                  className="w-full mt-6 py-4 text-lg bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Test...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Start Test from JSON
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} GATE Guide. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Calculator */}
      {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default HomePage;