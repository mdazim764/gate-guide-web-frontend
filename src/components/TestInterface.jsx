import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionDisplay from './QuestionDisplay';
import QuestionPalette from './QuestionPalette';
import VirtualCalculator from './VirtualCalculator';
import SectionTabs from './SectionTabs';
import TestFooter from './TestFooter';
import { useTest } from '../context/TestContext';
import { useAuth } from '../context/AuthContext';
import { submitQuiz } from '../services/api';

const TestInterface = () => {
    const { 
        quizId, questions, answers, timeRemaining, setTimeRemaining, 
        sections, currentSection, setCurrentSection, currentQuestionIndex,
        goToQuestion, updateAnswer 
    } = useTest();
    const { user } = useAuth();

    const [isCalculatorVisible, setCalculatorVisible] = useState(false);
    const [isInstructionsVisible, setInstructionsVisible] = useState(false);
    const [isQuestionPaperVisible, setQuestionPaperVisible] = useState(false);
    const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = useCallback(async () => {
        setIsSubmitting(true);
        if (!quizId || !questions) {
            setIsSubmitting(false);
            return;
        }

        const submissionData = {
            answers: Object.entries(answers).map(([qIndex, ans]) => {
                const question = questions[parseInt(qIndex)];
                let selectedAnswer = ans.answer;
                if (question.type === 'MSQ' && typeof selectedAnswer === 'object' && selectedAnswer !== null) {
                    selectedAnswer = Object.keys(selectedAnswer).filter(key => selectedAnswer[key]);
                }
                return { questionId: question.id, selectedAnswer };
            }),
            timeTaken: (180 * 60) - timeRemaining,
        };

        try {
            const response = await submitQuiz(quizId, submissionData);
            navigate(`/results/${response.data.attemptId}`);
        } catch (error) {
            console.error("Submission Error:", error.response?.data || error.message);
            alert("Error submitting quiz. Please check the console.");
            setIsSubmitting(false);
        }
    }, [quizId, questions, answers, timeRemaining, navigate]);

    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmit();
            return; 
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [timeRemaining, setTimeRemaining, handleSubmit]);

    // Format time in HH:MM:SS format as shown in the GATE portal
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    const handleClearResponse = () => {
        const question = questions[currentQuestionIndex];
        const emptyAnswer = (question.type === 'MSQ') ? {} : null;
        updateAnswer(currentQuestionIndex, emptyAnswer, 'not-answered');
    };
    
    const handleSaveAndNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        }
    };
    
    const handleMarkForReview = () => {
        const currentAnswer = answers[currentQuestionIndex];
        const question = questions[currentQuestionIndex];
        const isAnswered = question.type === 'MSQ' ? Object.values(currentAnswer?.answer || {}).some(v => v) : !!currentAnswer?.answer;
        const newStatus = isAnswered ? 'answered-and-marked' : 'marked-for-review';
        updateAnswer(currentQuestionIndex, currentAnswer?.answer, newStatus);
        handleSaveAndNext();
    };

    const toggleCalculator = () => {
        setCalculatorVisible(!isCalculatorVisible);
        setInstructionsVisible(false);
        setQuestionPaperVisible(false);
    };

    const toggleInstructions = () => {
        setInstructionsVisible(!isInstructionsVisible);
        setCalculatorVisible(false);
        setQuestionPaperVisible(false);
    };

    const toggleQuestionPaper = () => {
        setQuestionPaperVisible(!isQuestionPaperVisible);
        setCalculatorVisible(false);
        setInstructionsVisible(false);
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-[#dfe6ea]">
            {/* Main chrome-like header */}
            <header className="bg-[#1e2937] text-white py-1.5 px-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <span className="text-sm">Assessment Examination Center - Google Chrome</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-white hover:bg-gray-700 p-1.5 rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                    </button>
                    <button className="text-white hover:bg-gray-700 p-1.5 rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                    </button>
                </div>
            </header>

            {/* URL Bar (fake)
            <div className="bg-[#1e2937] text-gray-300 px-4 py-1.5 flex items-center text-sm border-b border-gray-700">
                <span>digitalm.com//OnlineAssessment/quiz.html?585@dM449@d0@d0@d0@d0@d0</span>
            </div> */}

            {/* Course title bar */}
            <div className="bg-[#e9be2a] text-[#333] px-4 py-1 flex items-center justify-between text-sm font-medium">
                <div>CS1 Computer Science and Information Technology</div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={toggleInstructions}
                        className="flex items-center bg-blue-50 text-blue-800 rounded px-2 py-0.5 text-xs font-bold"
                    >
                        <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        Instructions
                    </button>
                    <button 
                        onClick={toggleQuestionPaper}
                        className="flex items-center bg-green-50 text-green-800 rounded px-2 py-0.5 text-xs font-bold"
                    >
                        <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                        </svg>
                        Question Paper
                    </button>
                </div>
            </div>

            {/* Main tab bar */}
            <div className="bg-[#f8f8f8] border-b flex items-center">
                <div className="flex flex-1 overflow-hidden">
                    <div className="px-4 py-2 bg-[#2d90e3] text-white text-sm font-semibold flex items-center relative whitespace-nowrap">
                        CS1 Computer Science
                        <div className="w-5 h-5 bg-[#5dabef] text-white rounded-full flex items-center justify-center ml-1 text-xs font-bold">i</div>
                    </div>
                </div>
                {/* Profile and time display */}
                <div className="flex items-center">
                    <div className="flex items-center mr-3">
                        <div className="text-right mr-2">
                            <div className="font-bold">John Smith</div>
                        </div>
                        <img 
                            src="/public/azim.png" 
                            alt="User profile"
                            className="w-16 h-16 rounded bg-white border border-gray-300 p-0.5"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40?text=User";
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Time display in header */}
            <div className="bg-white border-b flex justify-end items-center py-1 px-4">
                <div className="flex items-center">
                    <div className="mr-2 text-sm font-medium text-gray-600">Time Left :</div>
                    <div className="text-base font-bold">{formatTime(timeRemaining)}</div>
                </div>
            </div>

            {/* Section tabs (General Aptitude, etc.) */}
            <div className="bg-gray-100 border-b flex items-center">
                <button className="bg-gray-300 text-gray-700 p-1 mx-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                </button>
                <div className="flex overflow-x-auto">
                    <div className={`px-4 py-2 font-medium text-sm flex items-center border-r whitespace-nowrap ${currentSection === 'General Aptitude' ? 'bg-white text-blue-800 border-b-2 border-b-blue-500' : 'bg-blue-50 text-gray-700'}`}>
                        General Aptitude
                        <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center ml-1 text-xs font-bold text-blue-800">i</div>
                    </div>
                    <div className={`px-4 py-2 font-medium text-sm flex items-center border-r whitespace-nowrap ${currentSection === 'CS1 Computer Science' ? 'bg-white text-blue-800 border-b-2 border-b-blue-500' : 'bg-blue-50 text-gray-700'}`}>
                        CS1 Computer Science...
                        <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center ml-1 text-xs font-bold text-blue-800">i</div>
                    </div>
                </div>
                <button className="bg-gray-300 text-gray-700 p-1 mx-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                </button>
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-y-hidden p-2 flex gap-2">
                <div className={`flex-1 bg-white p-4 rounded-md border border-gray-300 shadow-sm flex flex-col transition-all duration-300 ${isPaletteCollapsed ? 'mr-[-320px]' : ''}`}>
                    <QuestionDisplay />
                </div>
                <div className={`transition-all duration-300 flex-shrink-0 ${isPaletteCollapsed ? 'w-10' : 'w-[320px]'}`}>
                    <QuestionPalette isCollapsed={isPaletteCollapsed} onToggle={() => setIsPaletteCollapsed(!isPaletteCollapsed)} />
                </div>
            </main>

            {/* Footer */}
            <TestFooter
                onMarkForReview={handleMarkForReview}
                onClearResponse={handleClearResponse}
                onSaveAndNext={handleSaveAndNext}
                onPrevious={() => { goToQuestion(currentQuestionIndex - 1); }}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={currentQuestionIndex === questions.length - 1}
            />

            {/* Calculator Quick Access Button */}
            <div className="absolute top-[75px] right-[300px]">
                <button 
                    onClick={toggleCalculator}
                    className="flex items-center justify-center bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md hover:bg-blue-600"
                >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v2H6V4zm0 3h8v1H6V7zm0 2h8v1H6V9zm0 2h4v4H6v-4zm5 0h3v1h-3v-1zm0 2h3v1h-3v-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs font-medium">Scientific Calculator</span>
                </button>
            </div>

            {/* Use the existing VirtualCalculator component */}
            {isCalculatorVisible && (
                <VirtualCalculator onClose={() => setCalculatorVisible(false)} />
            )}

            {/* Version info at the bottom */}
            <div className="absolute bottom-0 right-0 bg-gray-700 text-white text-xs p-0.5 px-2">
                Version : 17.07.00
            </div>
        </div>
    );
};

export default TestInterface;