import React, { useMemo } from 'react';
import { useTest } from '../context/TestContext';

// Helper component for the exact GATE-style palette buttons
const PaletteButton = ({ status, number, isCurrent, onClick }) => {
    let shapePath, bgColorClass, textColorClass = 'text-white', extraClasses = '', questionMark = false;

    switch (status) {
        case 'answered':
            // Green house-shaped button (matches image #3)
            shapePath = "M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V18L16 32L0 18V4Z";
            bgColorClass = 'fill-green-500';
            break;
        case 'not-answered':
            // Red house-shaped button (matches image #4)
            shapePath = "M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V18L16 32L0 18V4Z";
            bgColorClass = 'fill-red-500';
            break;
        case 'marked-for-review':
            // Purple circle with question mark (matches image #1)
            shapePath = "M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0Z";
            bgColorClass = 'fill-purple-600';
            questionMark = true;
            break;
        case 'answered-and-marked':
            // Purple circle with green checkmark (matches image #2)
            shapePath = "M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0Z";
            bgColorClass = 'fill-purple-600';
            break;
        default: // not-visited
            // Light gray square with rounded corners (matches image #5)
            shapePath = "M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V28C32 30.2091 30.2091 32 28 32H4C1.79086 32 0 30.2091 0 28V4Z";
            bgColorClass = 'fill-gray-200';
            textColorClass = 'text-gray-800';
            break;
    }

    return (
        <div 
            onClick={onClick} 
            className={`relative cursor-pointer ${isCurrent ? 'ring-2 ring-orange-400 ring-offset-2 z-10' : ''}`}
            style={{ width: '48px', height: '48px' }}
        >
            <svg viewBox="0 0 32 32" className={`w-full h-full ${bgColorClass} ${extraClasses}`}>
                <path d={shapePath} />
            </svg>
            
            {questionMark ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`${textColorClass} font-bold text-lg`}>{number}</span>
                    <span className="absolute text-white font-bold text-sm right-2.5 top-1">?</span>
                </div>
            ) : status === 'answered-and-marked' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`${textColorClass} font-bold text-lg`}>{number}</span>
                    <div className="absolute bottom-1 right-1.5 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                </div>
            ) : (
                <div className={`absolute inset-0 flex items-center justify-center font-bold text-lg ${textColorClass}`}>
                    {number}
                </div>
            )}
        </div>
    );
};

const QuestionPalette = ({ isCollapsed, onToggle }) => {
  const { answers, goToQuestion, currentQuestionIndex, sections, currentSection } = useTest();

  // Memoize counts to prevent recalculation on every render
  const counts = useMemo(() => {
    const section = sections.find(s => s.name === currentSection);
    if (!section) return { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, answeredAndMarked: 0 };
    
    let answered = 0, notAnswered = 0, notVisited = 0, marked = 0, answeredAndMarked = 0;
    section.questions.forEach(q => {
      const status = answers[q.originalIndex]?.status;
      switch (status) {
        case 'answered': answered++; break;
        case 'not-answered': notAnswered++; break;
        case 'marked-for-review': marked++; break;
        case 'answered-and-marked': answeredAndMarked++; break;
        default: notVisited++; break;
      }
    });
    return { answered, notAnswered, notVisited, marked, answeredAndMarked };
  }, [answers, sections, currentSection]);

  if (isCollapsed) {
      return (
          <div onClick={onToggle} className="h-full bg-[#eaf3fa] border border-gray-300 rounded-md flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-200">
              <span className="transform -rotate-90 whitespace-nowrap font-semibold text-gray-600 tracking-wider">Question Palette</span>
          </div>
      );
  }

  const section = sections.find(s => s.name === currentSection);
  const sectionQuestions = section ? section.questions : [];

  return (
    <div className="h-full flex flex-col bg-[#eaf3fa] border border-gray-300 rounded-md shadow-lg">
        <div className="bg-[#31708f] text-white font-bold p-2 flex items-center justify-between">
            <span className="flex-1 text-center">{currentSection || 'Questions'}</span>
            <button onClick={onToggle} className="text-white hover:bg-blue-800 rounded-full p-1 focus:outline-none" aria-label="Collapse Palette">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
        </div>

        <div className="p-3 border-t border-b bg-[#f5fafd] text-sm">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mr-2"></div>
                    <span>{counts.answered} Answered</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
                    <span>{counts.notAnswered} Not Answered</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-white border border-gray-300 rounded-full mr-2"></div>
                    <span>{counts.notVisited} Not Visited</span>
                </div>
                <div className="flex items-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-full mr-2 relative">
                        <span className="absolute text-white text-xs font-bold top-0.5 right-1">?</span>
                    </div>
                    <span>{counts.marked + counts.answeredAndMarked} Marked</span>
                </div>
            </div>
            <p className="pt-2 text-center text-xs font-medium">Answered & Marked will be considered for evaluation.</p>
        </div>

        <div className="p-3 flex-1 overflow-y-auto bg-[#f5fafd]">
            <p className="text-sm font-semibold mb-3">Choose a Question</p>
            <div className="grid grid-cols-4 gap-3">
                {sectionQuestions.map(q => (
                    <PaletteButton
                        key={q.originalIndex}
                        number={q.originalIndex + 1}
                        status={answers[q.originalIndex]?.status || 'not-visited'}
                        isCurrent={q.originalIndex === currentQuestionIndex}
                        onClick={() => goToQuestion(q.originalIndex)}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default QuestionPalette;