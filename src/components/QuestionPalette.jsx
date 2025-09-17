import React from 'react';
import { useTest } from '../context/TestContext';

const QuestionPalette = () => {
  const { answers, goToQuestion, currentQuestionIndex, sections, currentSection } = useTest();

  const section = sections.find(s => s.name === currentSection);
  const sectionQuestions = section ? section.questions : [];

  const getStatusColor = (status, isCurrent) => {
    const baseClasses = 'w-10 h-10 flex items-center justify-center rounded font-bold text-white cursor-pointer transition-all duration-200';
    const border = isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-2 border-transparent';

    let colorClass = 'bg-gray-400'; // Not Visited
    if (status === 'answered') colorClass = 'bg-green-500';
    if (status === 'not-answered') colorClass = 'bg-red-500';
    if (status === 'marked-for-review') colorClass = 'bg-purple-500';
    if (status === 'answered-and-marked') colorClass = 'bg-purple-500 relative';

    return `${baseClasses} ${colorClass} ${border}`;
  };

  return (
    <div className="h-full flex flex-col">
        <div className="bg-blue-600 text-white font-bold p-3 rounded-t-md text-center">{currentSection || 'Questions'}</div>
        <div className="p-2 flex-1 overflow-y-auto">
            <p className="text-sm font-semibold mb-2">Choose a Question</p>
            <div className="grid grid-cols-4 gap-2">
                {sectionQuestions.map(question => (
                    <div
                        key={question.originalIndex}
                        onClick={() => goToQuestion(question.originalIndex)}
                        className={getStatusColor(answers[question.originalIndex]?.status, currentQuestionIndex === question.originalIndex)}
                    >
                        {answers[question.originalIndex]?.status === 'answered-and-marked' && (
                            <div className="absolute top-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                        {question.originalIndex + 1}
                    </div>
                ))}
            </div>
        </div>
        <div className="p-2 border-t text-xs space-y-1">
            <div className="flex items-center"><div className="w-4 h-4 bg-green-500 rounded mr-2"></div> Answered</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-500 rounded mr-2"></div> Not Answered</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-400 rounded mr-2"></div> Not Visited</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-purple-500 rounded mr-2"></div> Marked for Review</div>
        </div>
    </div>
  );
};
export default QuestionPalette;