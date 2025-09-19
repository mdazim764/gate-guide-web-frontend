import React from 'react';
import { useTest } from '../context/TestContext';

const QuestionDisplay = () => {
    const { questions, answers, currentQuestionIndex, updateAnswer } = useTest();
    const question = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    if (!question) return <div className="flex items-center justify-center h-full">Select a question to begin.</div>;

    const renderInputs = () => {
        const questionType = question.type || 'MCQ';

        switch (questionType) {
            case 'MSQ':
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <label key={index} className="flex items-center p-3 rounded-md border-2 border-gray-200 bg-white has-[:checked]:bg-blue-100 has-[:checked]:border-blue-500 cursor-pointer transition-all">
                                <input
                                    type="checkbox"
                                    checked={!!currentAnswer?.answer[option]}
                                    onChange={(e) => updateAnswer(currentQuestionIndex, { option, checked: e.target.checked })}
                                    className="h-5 w-5 accent-blue-600"
                                />
                                <span className="ml-4 text-gray-800">{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'NAT':
                return (
                    <div className="flex items-center mt-4">
                        <input
                            type="text"
                            value={currentAnswer?.answer || ''}
                            onChange={(e) => updateAnswer(currentQuestionIndex, e.target.value)}
                            className="p-3 border rounded-md w-full max-w-sm text-lg"
                            placeholder="Enter your numerical answer..."
                        />
                    </div>
                );
            default: // MCQ
                return (
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                           <label key={index} className="flex items-center p-3 rounded-md border-2 border-gray-200 bg-white has-[:checked]:bg-blue-100 has-[:checked]:border-blue-500 cursor-pointer transition-all">
                                <input
                                    type="radio"
                                    name={`q_${currentQuestionIndex}`}
                                    checked={currentAnswer?.answer === option}
                                    onChange={() => updateAnswer(currentQuestionIndex, option)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-4 text-gray-800">{option}</span>
                           </label>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0">
                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                    <span>Question Type: <strong>{question.type || 'MCQ'}</strong></span>
                    <span>Marks for correct answer: <strong>{question.marks || 1}</strong> | Negative Marks: <strong>{question.negativeMarks || '1/3'}</strong></span>
                </div>
                <hr className="border-gray-300"/>
            </div>
            <div className="flex-1 overflow-y-auto py-4 pr-2">
                <h2 className="text-xl font-bold my-4">Question No. {currentQuestionIndex + 1}</h2>
                <div className="mb-6 text-lg whitespace-pre-wrap prose max-w-none prose-img:max-h-96 prose-img:mx-auto">
                    {/* The `prose-img:*` classes above are crucial for controlling image size */}
                    {question.text}
                </div>
                {renderInputs()}
            </div>
        </div>
    );
};
export default QuestionDisplay;