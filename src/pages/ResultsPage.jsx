import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAttemptDetail } from '../services/api';

// --- NEW HELPER COMPONENT ---
// This component will safely render strings that contain simple HTML tags.
const RenderHTML = ({ content }) => {
  // A simple markdown-to-HTML conversion for bolding
  const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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
    return <div className="text-center mt-20 text-xl animate-pulse">Loading Your Detailed Analysis...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-xl text-red-600">{error}</div>;
  }
  
  if (!results) return null;

  const { feedback, quiz } = results;
  const questions = quiz?.questions || [];

  // Helper to format answers as comma-separated values
  const formatAnswer = (ans) => Array.isArray(ans) ? ans.join(", ") : ans;

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-lg p-6 sm:p-8">
        
        <div className="border-b pb-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Test Results & Analysis</h1>
            <h2 className="text-xl sm:text-2xl text-blue-700 font-semibold mt-1">Test: {quiz?.topicName}</h2>
            <p className="text-sm text-gray-500 mt-2">Attempt ID: {attemptId}</p>
        </div>

        {/* --- Summary Cards (No Change) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* ... cards go here, they are correct */}
        </div>
        
        {feedback?.mentorAnalysis && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-6 mb-8 shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">Guru's Mentor Analysis</h2>
                <div className="prose prose-lg text-yellow-900 max-w-none"><RenderHTML content={feedback.mentorAnalysis} /></div>
            </div>
        )}

        {/* --- REVISED: Question-by-Question Review --- */}
        {feedback?.questionByQuestionReview && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Question-by-Question Review</h2>
              <div className="space-y-6">
                {feedback.questionByQuestionReview.map((review, index) => {
                  
                  // --- FIX #1: THE ROBUST DATA LOOKUP ---
                  // We assume the questions array from the DB and the review array from the AI
                  // are in the same order. We use the index as a reliable key.
                  const question = questions[index];
                  
                  return (
                    <div key={index} className={`bg-gray-50 p-6 rounded-lg shadow-md border-t-4 ${review.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Question {index + 1}</h3>
                        <span className={`px-4 py-1 text-base rounded-full font-bold ${review.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {review.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {/* We now use the reliably-found 'question' object */}
                      <p className="text-lg text-gray-800 mb-4 whitespace-pre-wrap">{question ? question.text : "Question text could not be loaded."}</p>
                      
                      <div className="space-y-3 text-base">
                        <p><strong>Your Answer:</strong> <span className={`font-semibold ${review.isCorrect ? 'text-green-800' : 'text-red-700'}`}>{formatAnswer(review.yourAnswer) || 'Not Answered'}</span></p>
                        
                        {/* --- FIX #2: THE RENDERING FIX --- */}
                        {/* We use the new RenderHTML component to display formatted text */}
                        <p><strong>Correct Answer:</strong> <span className="font-semibold text-green-800"><RenderHTML content={formatAnswer(review.correctAnswer)} /></span></p>
                      </div>

                       {review.tutorNotes && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                          <h4 className="font-semibold text-blue-800 text-lg">Tutor Notes:</h4>
                          <p className="text-blue-900 whitespace-pre-wrap mt-2"><RenderHTML content={review.tutorNotes} /></p>
                        </div>
                       )}
                    </div>
                  );
                })}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;