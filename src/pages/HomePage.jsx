// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTest } from '../context/TestContext';
// import { generateQuiz, getSyllabusTree } from '../services/api';

// const HomePage = () => {
//   const navigate = useNavigate();
//   const { startTest } = useTest();

//   // State for UI
//   const [syllabus, setSyllabus] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedTopic, setSelectedTopic] = useState(''); // New state for topics!

//   // Form options state
//   const [difficulty, setDifficulty] = useState('medium');
//   const [quizType, setQuizType] = useState('AI');
//   const [questionCount, setQuestionCount] = useState(10);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // 1. Fetch the entire syllabus tree once on load
//   useEffect(() => {
//     const loadSyllabus = async () => {
//       try {
//         const response = await getSyllabusTree();
//         setSyllabus(response.data);
//         if (response.data.length > 0) {
//           setSelectedSubject(response.data[0].id);
//         }
//       } catch (err) {
//         setError('Could not fetch syllabus from the server.');
//         console.error(err);
//       }
//     };
//     loadSyllabus();
//   }, []);

//   // 2. Derive the list of topics whenever the selected subject changes
//   const topicsForSelectedSubject = useMemo(() => {
//     if (!selectedSubject) return [];
//     const subject = syllabus.find(s => s.id === selectedSubject);
//     if (!subject) return [];

//     // Flatten the Units -> Topics structure into a single list
//     return subject.units.flatMap(unit => unit.topics);
//   }, [selectedSubject, syllabus]);

//   const handleStartTest = async () => {
//     if (!selectedSubject) {
//       setError('Please select a subject.');
//       return;
//     }
//     setLoading(true);
//     setError('');

//     // This object is now even SMARTER, matching your backend's full power
//     const quizOptions = {
//       subjectIds: [selectedSubject],
//       // Conditionally add topicIds if one is selected!
//       ...(selectedTopic && { topicIds: [selectedTopic] }),
//       difficulty,
//       quizType,
//       questionCount: parseInt(questionCount, 10),
//     };

//    try {
//       const response = await generateQuiz(quizOptions);
//       const newQuiz = response.data;
//       startTest(newQuiz.id, newQuiz.questions);
//       navigate(`/test/${newQuiz.id}`);
//     } catch (err) {
//       // THIS CATCH BLOCK IS NOW MORE POWERFUL.
//       // If token refresh fails, this will catch the final error.
//       console.error('Quiz Generation API Error:', err.response?.data || err.message);

//       // We check for a specific message from the server for a better user experience.
//       const errorMessage = err.response?.data?.message || 'Failed to generate quiz. Your session may have expired.';
//       setError(errorMessage);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Dost AI</h1>
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">AI Quiz Generation Engine</h2>

//         <div className="space-y-6">
//           {/* Subject Selector */}
//           <div>
//             <label className="block text-lg font-medium text-gray-700">1. Select Subject</label>
//             <select
//               value={selectedSubject}
//               onChange={(e) => {
//                 setSelectedSubject(e.target.value);
//                 setSelectedTopic(''); // Reset topic when subject changes
//               }}
//               className="mt-1 block w-full py-3 px-4 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
//             >
//               {syllabus.map((subject) => (
//                 <option key={subject.id} value={subject.id}>{subject.name}</option>
//               ))}
//             </select>
//           </div>

//           {/* NEW: Topic Selector - only shows if there are topics */}
//           {topicsForSelectedSubject.length > 0 && (
//             <div>
//                 <label className="block text-lg font-medium text-gray-700">2. Select Topic (Optional)</label>
//                 <select
//                     value={selectedTopic}
//                     onChange={(e) => setSelectedTopic(e.target.value)}
//                     className="mt-1 block w-full py-3 px-4 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
//                 >
//                     <option value="">General (All Topics)</option>
//                     {topicsForSelectedSubject.map((topic) => (
//                         <option key={topic.id} value={topic.id}>{topic.name}</option>
//                     ))}
//                 </select>
//             </div>
//           )}

//           <hr/>

//           {/* Quiz Options */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-lg font-medium text-gray-700">Difficulty</label>
//                 <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md">
//                     <option value="easy">Easy</option>
//                     <option value="medium">Medium</option>
//                     <option value="hard">Hard</option>
//                     <option value="auto">Auto-Adjust</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-lg font-medium text-gray-700">Quiz Type</label>
//                 <select value={quizType} onChange={(e) => setQuizType(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md">
//                     <option value="AI">AI Generated</option>
//                     <option value="PYQ">PYQ Style</option>
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                   <label className="block text-lg font-medium text-gray-700">Number of Questions</label>
//                   <input type="number" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} min="1" max="50" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"/>
//               </div>
//           </div>
//         </div>

//         {error && <p className="text-red-500 mt-6 text-center font-semibold">{error}</p>}

//         <div className="flex justify-center mt-8">
//           <button
//             className="px-10 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-lg shadow-lg"
//             onClick={handleStartTest}
//             disabled={loading || !selectedSubject}
//           >
//             {loading ? 'Forging Quiz with AI...' : 'Start Test'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../context/TestContext";
import {
  generateQuiz,
  generateQuizFromJson,
  getSyllabusTree,
} from "../services/api";

const HomePage = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();

  // State for UI mode
  const [mode, setMode] = useState("ai"); // 'ai' or 'json'

  // Common state
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // AI Mode State
  const [difficulty, setDifficulty] = useState("medium");
  const [quizType, setQuizType] = useState("AI");
  const [questionCount, setQuestionCount] = useState(10);

  // JSON Mode State
  const [jsonInput, setJsonInput] = useState("");
  const [quizTitle, setQuizTitle] = useState("");

  // Fetch subjects for dropdowns on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getSyllabusTree();
        setSubjects(response.data);
        if (response.data.length > 0) {
          setSelectedSubject(response.data[0].id);
        }
      } catch {
        setError("Could not fetch subjects from the server.");
      }
    };
    loadData();
  }, []);

  // Handler for AI-Generated Quizzes
  const handleStartAIGeneratedTest = async () => {
    if (!selectedSubject) {
      setError("Please select a subject first.");
      return;
    }
    const quizOptions = {
      subjectIds: [selectedSubject],
      difficulty,
      quizType,
      questionCount: parseInt(questionCount, 10),
    };

    setLoading(true);
    setError("");

    try {
      const response = await generateQuiz(quizOptions);
      startTest(response.data.id, response.data.questions);
      // navigate(`/test/${response.data.id}`);
      navigate(`/dummylogin/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate AI quiz.");
      setLoading(false);
    }
  };

  // Handler for Manual JSON Quizzes
  const handleStartJsonTest = async () => {
    if (!selectedSubject || !quizTitle || !jsonInput) {
      setError(
        "Please select a subject, provide a title, and paste the questions JSON."
      );
      return;
    }
    setLoading(true);
    setError("");

    try {
      const questionsData = JSON.parse(jsonInput);
      if (!Array.isArray(questionsData) || questionsData.length === 0) {
        setError("JSON must be a non-empty array of questions.");
        setLoading(false);
        return;
      }

      // Important: Ensure the provided JSON questions have the required fields.
      // Your backend expects: text, options, correctAnswer
      const payload = {
        subjectId: selectedSubject,
        topicName: quizTitle,
        questionsData,
      };

      const response = await generateQuizFromJson(payload);

      startTest(response.data.id, response.data.questions);
      navigate(`/test/${response.data.id}`);
    } catch (err) {
      // Differentiate between JSON parsing errors and API errors
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format. Please check for syntax errors.");
      } else {
        setError(
          err.response?.data?.message || "Failed to create quiz from JSON."
        );
      }
      setLoading(false);
    }
  };

  const commonSubjectSelector = (
    <div>
      <label className="block text-lg font-medium text-gray-700">Subject</label>
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
      >
        <option value="" disabled>
          Select a subject
        </option>
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Dost AI
        </h1>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
          GATE Quiz Engine
        </h2>

        {/* --- MODE TOGGLE --- */}
        <div className="flex justify-center mb-8 p-1 bg-gray-200 rounded-lg">
          <button
            onClick={() => setMode("ai")}
            className={`flex-1 px-4 py-2 text-lg font-semibold rounded-md transition-colors ${
              mode === "ai" ? "bg-blue-600 text-white shadow" : "text-gray-600"
            }`}
          >
            AI Generation
          </button>
          <button
            onClick={() => setMode("json")}
            className={`flex-1 px-4 py-2 text-lg font-semibold rounded-md transition-colors ${
              mode === "json"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            Manual JSON Test
          </button>
        </div>

        {/* --- CONDITIONAL UI RENDERING --- */}
        {mode === "ai" ? (
          <div className="space-y-6">
            {commonSubjectSelector}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Quiz Type
              </label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="AI">AI Creative</option>
                <option value="PYQ">PYQ Style</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleStartAIGeneratedTest}
              disabled={loading}
              className="w-full mt-4 py-3 text-lg bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-lg"
            >
              {loading ? "Generating with AI..." : "Start AI Test"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {commonSubjectSelector}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="e.g., Full Syllabus Mock Test #1"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Questions JSON Array
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm h-64 font-mono text-sm"
                placeholder='IMPORTANT: Each question object MUST use these keys: "text", "options", "correctAnswer", "explanation", "difficulty". e.g., [ { "text": "What is 2+2?", "options": ["3", "4"], "correctAnswer": "4", ... } ]'
              ></textarea>
            </div>
            <button
              onClick={handleStartJsonTest}
              disabled={loading}
              className="w-full mt-4 py-3 text-lg bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg"
            >
              {loading ? "Creating Your Test..." : "Start Test from JSON"}
            </button>
          </div>
        )}

        {error && (
          <p className="text-red-600 mt-6 text-center font-semibold bg-red-100 p-3 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
