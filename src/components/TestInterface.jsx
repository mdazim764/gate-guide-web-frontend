// src/components/TestInterface.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionDisplay from "./QuestionDisplay";
import QuestionPalette from "./QuestionPalette";
import VirtualCalculator from "./VirtualCalculator";
import SectionTabs from "./SectionTabs";
import { useTest } from "../context/TestContext";
import { useAuth } from "../context/AuthContext";
import { submitQuiz } from "../services/api";

const TestInterface = () => {
  const {
    quizId,
    questions,
    answers,
    timeRemaining,
    setTimeRemaining,
    sections,
    currentSection,
    setCurrentSection,
  } = useTest();
  const { user } = useAuth();
  const [isCalculatorVisible, setCalculatorVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleSubmit = async () => {
    if (!quizId || !questions) return;

    const submissionData = {
      answers: Object.entries(answers).map(([qIndex, ans]) => {
        const question = questions[parseInt(qIndex)];
        let selectedAnswer = ans.answer;
        if (
          question.type === "MSQ" &&
          typeof selectedAnswer === "object" &&
          selectedAnswer !== null
        ) {
          selectedAnswer = Object.keys(selectedAnswer).filter(
            (key) => selectedAnswer[key]
          );
        }
        return { questionId: question.id, selectedAnswer };
      }),
      timeTaken: 180 * 60 - timeRemaining,
    };

    try {
      const response = await submitQuiz(quizId, submissionData);
      navigate(`/results/${response.data.attemptId}`);
    } catch (error) {
      alert("Error submitting quiz.");
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-[#F0F8FF]">
      <header className="flex justify-between items-center px-4 h-[60px] bg-white border-b-2 border-gray-300">
        <div className="w-1/3">
          {sections && (
            <SectionTabs
              sections={sections}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            />
          )}
        </div>
        <div className="w-1/3 text-center">
          <div className="font-bold text-lg text-gray-700">
            Time Left:{" "}
            <span className="font-mono text-xl text-black">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
          <img
            src="https://via.placeholder.com/32"
            alt="User"
            className="rounded-full"
          />
          <span className="font-semibold">{user?.name || "Azim"}</span>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-2 flex gap-2">
        <div className="flex-1 bg-white p-4 rounded-md border border-gray-300 shadow-sm">
          <QuestionDisplay />
        </div>

        <div className="w-[300px] flex flex-col gap-2">
          <div className="h-40 bg-black flex items-center justify-center text-white font-bold rounded">
            CAMERA
          </div>
          <button
            onClick={() => setCalculatorVisible((v) => !v)}
            className="bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            Scientific Calculator
          </button>
          <div className="flex-1 bg-white p-2 rounded-md border border-gray-300 shadow-sm">
            <QuestionPalette />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </main>
      {isCalculatorVisible && (
        <VirtualCalculator onClose={() => setCalculatorVisible(false)} />
      )}
    </div>
  );
};
export default TestInterface;
