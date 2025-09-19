// src/pages/InstructionsPage.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This helper component now uses actual image files for 100% accuracy.
const PaletteIcon = ({ imgName }) => {
  return (
    <img src={`/${imgName}`} alt={`${imgName} icon`} className="w-8 h-8" />
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
            {page === 1 ? "Instructions" : "Other Important Instructions"}
          </h1>

          <div className="flex-1 overflow-y-auto px-4 text-sm">
            {page === 1 ? (
              // --------------- PAGE 1 CONTENT ---------------
              <>
                <h2 className="text-center font-bold text-md mb-4">
                  Read the following instructions carefully
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-3">General Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>
                        Total duration of the examination is{" "}
                        <strong>180</strong> minutes. A scientific Calculator is
                        available on top, right hand side of the screen.
                      </li>
                      <li>
                        The clock will be set at the server. The countdown timer
                        in the top right corner of screen will display the
                        remaining time available for you to complete the
                        examination. When the timer reaches zero, the
                        examination will end by itself. You will not be required
                        to end or submit your examination.
                      </li>
                      <li>
                        The Question Palette displayed on the right side of
                        screen will show the status of each question using one
                        of the following symbols:
                        <table className="w-full my-3 border-collapse text-left align-middle">
                          <tbody>
                            <tr className="border">
                              <td className="p-2 flex items-center gap-4">
                                <PaletteIcon imgName="1.png" />{" "}
                                You have NOT visited the question yet.
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="p-2 flex items-center gap-4">
                                <PaletteIcon imgName="2.png" />{" "}
                                You have NOT answered the question.
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="p-2 flex items-center gap-4">
                                <PaletteIcon imgName="3.png" /> You
                                have answered the question.
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="p-2 flex items-center gap-4">
                                <PaletteIcon imgName="4.png" />{" "}
                                You have NOT answered the question but have
                                marked the question for review.
                              </td>
                            </tr>
                            <tr className="border">
                              <td className="p-2 flex items-center gap-4">
                                <PaletteIcon imgName="5.png" />{" "}
                                You have answered the question and marked for
                                review. This will be evaluated.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                      <li>
                        You can click on the{" "}
                        <span className="inline-block px-1 bg-black text-white font-bold align-middle">
                          ◀
                        </span>{" "}
                        arrow which appears to the left of question palette to
                        collapse the question palette...
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">
                      Navigating to a Question:
                    </h3>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>To answer a question, do the following:</li>
                      <li>
                        Click on the question number in the Question Palette at
                        the right of your screen to go to that numbered question
                        directly. Note that using this option does NOT save your
                        answer to the current question.
                      </li>
                      <li>
                        Click on <strong>Save & Next</strong> to save your
                        answer for the current question and then go to the next
                        question.
                      </li>
                      <li>
                        Click on <strong>Mark for Review & Next</strong> to save
                        your answer for the current question, mark it for
                        review, and then go to the next question.
                      </li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">Answering a Question:</h3>
                    <p>
                      Procedure for answering a multiple-choice type question
                      (MCQ):
                    </p>
                    {/* ... All other static instruction text follows the same pattern ... */}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setPage(2)}
                    className="bg-gray-200 hover:bg-gray-300 border border-gray-400 font-semibold px-6 py-2 rounded-md flex items-center gap-1"
                  >
                    Next <span>&rsaquo;</span>
                  </button>
                </div>
              </>
            ) : (
              // --------------- PAGE 2 CONTENT ---------------
              <>
                <h2 className="text-center font-bold text-md mb-4">
                  Paper-specific Instructions
                </h2>
                <h3 className="font-bold text-sm mb-3">
                  Please read the following carefully:
                </h3>
                <p className="text-sm mb-4">
                  This question paper has 65 questions for a total of 100 marks.
                  It consists of two sections: General Aptitude (GA) for 15
                  marks and the subject specific section for 85 marks. Both
                  sections are compulsory. The marks distribution is as follows:
                </p>
                <div className="flex justify-center my-4">
                  <table className="w-4/5 border-collapse border border-gray-400 text-center text-sm">
                    <thead className="bg-gray-100 font-bold">
                      <tr>
                        <th className="border border-gray-400 p-2">Section</th>
                        <th className="border border-gray-400 p-2">
                          Number of 1-mark questions
                        </th>
                        <th className="border border-gray-400 p-2">
                          Number of 2-mark questions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 p-2">
                          General Aptitude
                        </td>
                        <td className="border border-gray-400 p-2">5</td>
                        <td className="border border-gray-400 p-2">5</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 p-2">
                          Subject specific section
                        </td>
                        <td className="border border-gray-400 p-2">25</td>
                        <td className="border border-gray-400 p-2">30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">
                  To switch sections, click on the tab of the section.
                </p>
                <div className="mt-8 pt-4 border-t">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={() => setAgreed(!agreed)}
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />
                    <span className="ml-3 text-sm">
                      I have read and understood the instructions. All computer
                      hardware allotted to me are in proper working condition. I
                      declare that I am not in possession of / not wearing / not
                      carrying any prohibited gadget like mobile phone,
                      bluetooth devices etc. /any prohibited material with me
                      into the Examination Hall. I agree that in case of not
                      adhering to the instructions, I shall be liable to be
                      debarred from this Test and/or to disciplinary action,
                      which may include ban from future Tests / Examinations
                    </span>
                  </label>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPage(1)}
                    className="bg-gray-200 hover:bg-gray-300 border border-gray-400 font-semibold px-6 py-2 rounded-md flex items-center gap-1"
                  >
                    <span>&lsaquo;</span> Previous
                  </button>
                  <button
                    onClick={() => {
                      if (agreed) navigate(`/test/${quizId}`);
                    }}
                    disabled={!agreed}
                    className="bg-[#31708f] text-white font-semibold px-8 py-3 rounded-md disabled:bg-gray-400 hover:bg-[#285a74] transition"
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
            <svg
              className="w-20 h-20 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
          </div>
          <p className="mt-4 font-bold text-lg">{user?.name || "John Smith"}</p>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-[#3B729F] text-white text-xs text-center p-1">
        Version: 17.07.00
      </footer>
    </div>
  );
};
export default InstructionsPage;
