// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAttemptDetail } from '../services/api';

// --- NEW HELPER COMPONENT ---
// This component will safely render strings that contain simple HTML tags.
const RenderHTML = ({ content }) => {
  // A simple markdown-to-HTML conversion for bolding
  const formattedContent = content?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '';
  return <span dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};

const ResultsPage = () => {
  const { attemptId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAttemptDetail(attemptId);
        console.log('Fetched attempt details:', response.data);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch results. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#e9eef2]">
        <div className="text-center text-xl font-semibold text-blue-800 animate-pulse">
          Loading Your Detailed Analysis...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#e9eef2]">
        <div className="text-center text-xl text-red-600 font-semibold">
          {error}
          <div className="mt-4">
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!results) return null;

  const { feedback, quiz } = results;
  const questions = quiz?.questions || [];
  const score = results?.score || '0';
  const maxScore = feedback?.maxScore || '100';
  const scorePercentage = (score / maxScore) * 100;
const correctCount = Math.floor((score / 100) * questions.length) || 0;
const incorrectCount = feedback?.incorrectCount || (questions.length - correctCount);
  // Helper to format answers as comma-separated values
  const formatAnswer = (ans) => Array.isArray(ans) ? ans.join(", ") : ans;

  return (
    <div className="bg-[#e9eef2] min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header bar similar to GATE portal */}
        <div className="bg-[#2c5282] text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Assessment Examination Center - Results</h1>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Candidate:</span>
              <span>{results?.user?.name || "Test User"}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="border-b pb-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Test Results & Analysis</h2>
            <h3 className="text-xl sm:text-2xl text-blue-700 font-semibold mt-1">{quiz?.topicName}</h3>
            <p className="text-sm text-gray-500 mt-2">Attempt ID: {attemptId}</p>
          </div>

          {/* Score Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <h4 className="text-lg font-semibold text-blue-800">Score</h4>
              <div className="text-3xl font-bold mt-2">{score} / {maxScore}</div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 rounded-full bg-blue-600" 
                  style={{ width: `${scorePercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="text-lg font-semibold text-green-800">Correct Answers</h4>
              <div className="text-3xl font-bold mt-2">
                {correctCount || 0} / {questions.length}
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <h4 className="text-lg font-semibold text-red-800">Incorrect Answers</h4>
              <div className="text-3xl font-bold mt-2">
                {incorrectCount || 0} / {questions.length}
              </div>
            </div>
          </div>
          
          {feedback?.mentorAnalysis && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-6 mb-8 shadow-md">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4">Analysis Summary</h2>
              <div className="prose prose-lg text-yellow-900 max-w-none">
                <RenderHTML content={feedback.mentorAnalysis} />
              </div>
            </div>
          )}

          {/* Question-by-Question Review */}
          {feedback?.questionByQuestionReview && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Question-by-Question Review</h2>
              <div className="space-y-6">
                {feedback.questionByQuestionReview.map((review, index) => {
                  const question = questions[index];
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-6 rounded-lg shadow-md border ${
                        review.isCorrect ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Question {index + 1}</h3>
                        <span className={`px-4 py-1 text-sm rounded-full font-bold ${
                          review.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {review.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-lg text-gray-800 mb-2 whitespace-pre-wrap">
                          {question ? question.text : "Question text could not be loaded."}
                        </p>
                        
                        {question?.options && (
                          <div className="mt-3 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`p-2 rounded ${
                                  review.correctAnswer === option ? 
                                  'bg-green-100 border-l-4 border-green-500' : 
                                  review.yourAnswer === option ? 
                                  'bg-red-100 border-l-4 border-red-500' : 
                                  'bg-gray-50'
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 text-base border-t pt-3">
                        <p>
                          <span className="font-semibold text-gray-600">Your Answer:</span> 
                          <span className={`ml-2 font-semibold ${review.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {formatAnswer(review.yourAnswer) || 'Not Answered'}
                          </span>
                        </p>
                        
                        <p>
                          <span className="font-semibold text-gray-600">Correct Answer:</span> 
                          <span className="ml-2 font-semibold text-green-700">
                            <RenderHTML content={formatAnswer(review.correctAnswer)} />
                          </span>
                        </p>
                      </div>

                      {review.tutorNotes && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4">
                          <h4 className="font-semibold text-blue-800 text-lg">Explanation:</h4>
                          <p className="text-blue-900 mt-2">
                            <RenderHTML content={review.tutorNotes} />
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Link 
              to="/" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded"
            >
              Return Home
            </Link>
            <Link 
              to="/new-test" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
            >
              Try Another Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;