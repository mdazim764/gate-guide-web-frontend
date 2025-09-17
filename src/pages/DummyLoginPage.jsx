import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DummyLoginPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { user } = useAuth();

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate(`/instructions/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      <div className="bg-[#2E7DAA] h-8"></div>
      <div className="bg-[#6B6B6B] text-white p-4 flex justify-between items-center">
        <div className="w-1/3">
          <p className="text-sm">System Name:</p>
          <p className="text-2xl font-bold">C001</p>
        </div>
        <div className="w-1/3 text-sm">
          <p>
            Kindly contact the invigilator if there are any discrepancies...
          </p>
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
          <div className="text-right">
            <p className="text-sm">Candidate Name:</p>
            <p className="text-2xl font-bold text-yellow-300">
              {user?.name || "Azim"}
            </p>
            <p className="text-sm mt-1">
              Subject: <span className="font-bold">Mock Exam</span>
            </p>
          </div>
          <div className="w-24 h-24 bg-white p-1 border-2 border-gray-400">
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-start mt-16">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleSignIn}
            className="bg-[#EDEDED] border border-gray-300 rounded-md shadow-lg"
          >
            <h2 className="bg-[#DADADA] text-left text-sm font-semibold p-2 border-b border-gray-300">
              Login
            </h2>
            <div className="p-6 space-y-4">
              <div className="flex items-center bg-white border border-gray-400 rounded-sm">
                <span className="p-2 border-r border-gray-300 bg-gray-100">
                  👤
                </span>
                <input
                  type="text"
                  defaultValue={user?.email || "azim@example.com"}
                  readOnly
                  className="w-full p-2 outline-none"
                />
                <span className="p-2 border-l border-gray-300 bg-gray-100">
                  ⌨️
                </span>
              </div>
              <div className="flex items-center bg-white border border-gray-400 rounded-sm">
                <span className="p-2 border-r border-gray-300 bg-gray-100">
                  🔒
                </span>
                <input
                  type="password"
                  defaultValue="••••••"
                  readOnly
                  className="w-full p-2 outline-none"
                />
                <span className="p-2 border-l border-gray-300 bg-gray-100">
                  ⌨️
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#1E90FF] text-white font-semibold py-2 rounded-sm border-2 border-[#00008B] hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full bg-[#3B729F] text-white text-xs text-center p-1">
        Version 17.05.21
      </footer>
    </div>
  );
};

export default DummyLoginPage;
