// src/pages/HomePage.jsx
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
