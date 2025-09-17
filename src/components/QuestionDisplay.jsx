// import React from 'react';
// import { useTest } from '../context/TestContext';

// const QuestionDisplay = () => {
//   const { 
//     questions, 
//     answers, 
//     currentQuestionIndex, 
//     updateAnswer, 
//     goToQuestion 
//   } = useTest();

//   const question = questions[currentQuestionIndex];
//   const currentAnswer = answers[currentQuestionIndex];

//   if (!question) return <div>Loading question...</div>;

//   const handleOptionChange = (option) => {
//     updateAnswer(currentQuestionIndex, option);
//   };

//   const handleClearResponse = () => {
//     updateAnswer(currentQuestionIndex, null, 'not-answered');
//   };
  
//   const handleSaveAndNext = () => {
//       goToQuestion(currentQuestionIndex + 1);
//   };

//   const handleMarkForReview = () => {
//     const currentStatus = answers[currentQuestionIndex]?.status;
//     const newStatus = (currentStatus === 'answered' || currentStatus === 'answered-and-marked') 
//                       ? 'answered-and-marked'
//                       : 'marked-for-review';
//     updateAnswer(currentQuestionIndex, null, newStatus);
//     goToQuestion(currentQuestionIndex + 1);
//   };

//   return (
//     // Re-styling to match the GATE official theme
//     <div className="bg-[#F0F8FF] p-6 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.1)] h-full flex flex-col border border-gray-300">
//       <div className="mb-6 border-b-2 border-gray-300 pb-4">
//         <h2 className="text-xl font-bold text-gray-800">Question No. {currentQuestionIndex + 1}</h2>
//       </div>
      
//       {/* --- CRITICAL TEXT FIX --- */}
//       <p className="text-gray-800 text-lg mb-6 whitespace-pre-wrap">{question.text}</p>
      
//       {/* Options Styling */}
//       <div className="space-y-4 flex-1 overflow-y-auto pr-2">
//         {question.options.map((option, index) => (
//           <label key={index} className="flex items-center p-4 rounded-lg border-2 bg-white has-[:checked]:bg-blue-100 has-[:checked]:border-blue-500 cursor-pointer shadow-sm transition-all">
//             <input
//               type="radio"
//               name={`question-${currentQuestionIndex}`}
//               value={option}
//               checked={currentAnswer?.answer === option}
//               onChange={() => handleOptionChange(option)}
//               className="form-radio h-5 w-5 text-blue-600"
//             />
//             <span className="ml-4 text-gray-800 text-base">{option}</span>
//           </label>
//         ))}
//       </div>
      
//       {/* Button panel at the bottom */}
//       <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-300">
//           <button
//             onClick={handleMarkForReview}
//             className="bg-[#683AB7] text-white px-6 py-2 rounded-md hover:bg-[#5a329a] transition-colors font-semibold"
//           >
//             Mark for Review & Next
//           </button>
//           <button
//             onClick={handleClearResponse}
//             className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors font-semibold"
//           >
//             Clear Response
//           </button>
//         <button
//             onClick={handleSaveAndNext}
//             className="bg-green-600 text-white font-bold px-10 py-2 rounded-md hover:bg-green-700 transition-colors"
//             disabled={currentQuestionIndex === questions.length - 1}
//         >
//           Save & Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuestionDisplay;

import React from 'react';
import { useTest } from '../context/TestContext';

const QuestionDisplay = () => {
    const { questions, answers, currentQuestionIndex, updateAnswer, goToQuestion } = useTest();
    const question = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    if (!question) return <div className="flex items-center justify-center h-full">Select a question to begin.</div>;

    const handleClearResponse = () => {
        const emptyAnswer = question.type === 'MSQ' ? {} : null;
        updateAnswer(currentQuestionIndex, emptyAnswer, 'not-answered');
    };

    const handleSaveAndNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        }
    };

    const handleMarkForReview = () => {
        const isAnswered = question.type === 'MSQ' ? Object.values(currentAnswer.answer).some(v => v) : !!currentAnswer.answer;
        const newStatus = isAnswered ? 'answered-and-marked' : 'marked-for-review';
        updateAnswer(currentQuestionIndex, currentAnswer.answer, newStatus);
        handleSaveAndNext();
    };

    const renderInputs = () => {
        switch (question.type) {
            case 'MSQ':
                return (
                    <div className="space-y-4">
                        {question.options.map((option, index) => (
                            <label key={index} className="flex items-center p-3 rounded-lg border bg-gray-50 has-[:checked]:bg-blue-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!currentAnswer?.answer[option]}
                                    onChange={(e) => updateAnswer(currentQuestionIndex, { option, checked: e.target.checked })}
                                    className="h-5 w-5"
                                />
                                <span className="ml-4 text-gray-800">{option}</span>
                            </label>
                        ))}
                    </div>
                );
            case 'NAT':
                return (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={currentAnswer?.answer || ''}
                            onChange={(e) => updateAnswer(currentQuestionIndex, e.target.value)}
                            className="p-3 border rounded-md w-full max-w-xs text-lg"
                            placeholder="Enter numerical answer"
                        />
                    </div>
                );
            default: // MCQ
                return (
                    <div className="space-y-4">
                        {question.options.map((option, index) => (
                           <label key={index} className="flex items-center p-3 rounded-lg border bg-gray-50 has-[:checked]:bg-blue-100 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`q_${currentQuestionIndex}`}
                                    checked={currentAnswer?.answer === option}
                                    onChange={() => updateAnswer(currentQuestionIndex, option)}
                                    className="h-5 w-5"
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
            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                <span>Question Type: <strong>{question.type || 'MCQ'}</strong></span>
            </div>
            <hr/>
            <div className="flex-1 overflow-y-auto py-4">
                <h2 className="text-xl font-semibold my-4">Question No. {currentQuestionIndex + 1}</h2>
                <p className="mb-6 text-lg whitespace-pre-wrap">{question.text}</p>
                {renderInputs()}
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
                <div>
                    <button onClick={handleMarkForReview} className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-600">Mark for Review &amp; Next</button>
                    <button onClick={handleClearResponse} className="ml-4 bg-gray-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-600">Clear Response</button>
                </div>
                <button onClick={handleSaveAndNext} disabled={currentQuestionIndex >= questions.length - 1} className="bg-blue-600 text-white font-bold px-8 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">Save &amp; Next</button>
            </div>
        </div>
    );
};
export default QuestionDisplay;