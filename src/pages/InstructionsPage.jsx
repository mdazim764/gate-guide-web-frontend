// src/pages/InstructionsPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Helper component for the pixel-perfect palette status icons
const PaletteIcon = ({ number, type }) => {
  let baseClasses = 'relative w-8 h-8 flex items-center justify-center font-bold text-white rounded text-lg border-b-2 shadow-sm';
  let colorClasses = '';
  let checkmark = false;

  switch (type) {
    case 'not-answered':
      colorClasses = 'bg-red-500 border-red-700';
      break;
    case 'answered':
      colorClasses = 'bg-green-500 border-green-700';
      break;
    case 'not-answered-marked':
      colorClasses = 'bg-purple-600 border-purple-800';
      break;
    case 'answered-marked':
      colorClasses = 'bg-purple-600 border-purple-800';
      checkmark = true;
      break;
    case 'not-visited':
    default:
      // The official "Not Visited" is a specific silver-grey button style
      colorClasses = 'bg-gray-200 border-gray-400 text-gray-800';
      break;
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {number}
      {checkmark && (
        <div className="absolute top-[-2px] right-[-2px] h-3 w-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-1.5 w-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
      )}
    </div>
  );
};

const InstructionsPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center p-4 font-['Arial',_sans-serif] text-gray-800">
      <div className="w-full max-w-7xl bg-white flex shadow-lg border border-gray-300 h-[90vh]">
        
        {/* Main Instructions Panel */}
        <div className="flex-[3] p-6 flex flex-col h-full">
          <h1 className="flex-shrink-0 text-xl font-bold bg-[#D3E0EA] p-3 -m-6 mb-6 border-b border-gray-300">
            {page === 1 ? 'Instructions' : 'Other Important Instructions'}
          </h1>
          
          <div className="flex-1 overflow-y-auto px-4">
            {page === 1 ? (
              <>
                <h2 className="text-center font-bold text-md mb-4">Read the following instructions carefully</h2>
                <h3 className="font-bold text-sm mb-3">General Instructions:</h3>
                <ol className="list-decimal list-inside space-y-4 text-sm">
                  <li>Total duration of the examination is <strong>180</strong> minutes. A scientific Calculator is available on top, right hand side of the screen.</li>
                  <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
                  <li>
                    The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                    <table className="w-full my-4 border-collapse text-left align-middle">
                      <tbody>
                        <tr className="border"><td className="p-3 flex items-center gap-4"><PaletteIcon number={1} type="not-visited" /> You have NOT visited the question yet.</td></tr>
                        <tr className="border"><td className="p-3 flex items-center gap-4"><PaletteIcon number={2} type="not-answered" /> You have NOT answered the question.</td></tr>
                        <tr className="border"><td className="p-3 flex items-center gap-4"><PaletteIcon number={3} type="answered" /> You have answered the question.</td></tr>
                        <tr className="border"><td className="p-3 flex items-center gap-4"><PaletteIcon number={4} type="not-answered-marked" /> You have NOT answered the question but have marked the question for review.</td></tr>
                        <tr className="border"><td className="p-3 flex items-center gap-4"><PaletteIcon number={5} type="answered-marked" /> You have answered the question and marked for review. This will be evaluated.</td></tr>
                      </tbody>
                    </table>
                  </li>
                  <li>You can click on the <span className="inline-block px-1 bg-black text-white font-bold align-middle">◀</span> arrow which appears to the left of question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on <span className="inline-block px-1 bg-black text-white font-bold align-middle">▶</span> which appears on the right side of question window.</li>
                </ol>
                <div className="flex justify-end mt-6">
                    <button onClick={() => setPage(2)} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 font-semibold px-6 py-2 rounded-md">
                        Next &gt;
                    </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center font-bold text-md mb-4">Paper-specific Instructions</h2>
                <h3 className="font-bold text-sm mb-3">Please read the following carefully:</h3>
                <p className="text-sm mb-4">
                  This question paper has 65 questions for a total of 100 marks. It consists of two sections: General Aptitude (GA) for 15 marks and the subject specific section for 85 marks. Both sections are compulsory. The marks distribution is as follows:
                </p>
                <div className="flex justify-center">
                    <table className="w-3/4 border-collapse border border-gray-400 mb-4 text-center text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-400 p-2">Section</th>
                                <th className="border border-gray-400 p-2">Number of 1-mark questions</th>
                                <th className="border border-gray-400 p-2">Number of 2-mark questions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="border border-gray-400 p-2">General Aptitude</td><td className="border border-gray-400 p-2">5</td><td className="border border-gray-400 p-2">5</td></tr>
                            <tr><td className="border border-gray-400 p-2">Subject specific section</td><td className="border border-gray-400 p-2">25</td><td className="border border-gray-400 p-2">30</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm">To switch sections, click on the tab of the section.</p>
                <div className="mt-8 pt-4 border-t">
                  <label className="flex items-start">
                    <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-1 h-5 w-5 accent-blue-600" />
                    <span className="ml-3 text-sm">I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations</span>
                  </label>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button onClick={() => setPage(1)} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 font-semibold px-6 py-2 rounded-md">
                        &lt; Previous
                    </button>
                    <button
                        onClick={() => { if (agreed) navigate(`/test/${quizId}`); }}
                        disabled={!agreed}
                        className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-md disabled:bg-gray-400 hover:bg-blue-700 transition"
                    >
                        I am ready to begin
                    </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right User Panel */}
        <div className="flex-1 bg-[#D3E0EA] p-6 border-l border-gray-300 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md p-1">
            <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path></svg>
          </div>
          <p className="mt-4 font-bold text-lg">{user?.name || 'Azim'}</p>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-[#3B729F] text-white text-xs text-center p-1">Version: 17.07.00</footer>
    </div>
  );
};

export default InstructionsPage;