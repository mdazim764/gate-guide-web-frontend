import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllAttempts } from '../services/api';
import VirtualCalculator from '../components/VirtualCalculator';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCalculator, setShowCalculator] = useState(false);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [stats, setStats] = useState({ totalAttempts: 0, avgScore: 0, bestScore: 0, totalQuestions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAllAttempts();
        const attempts = response.data || [];
        
        setRecentAttempts(attempts.slice(0, 3));
        
        // Calculate stats
        if (attempts.length > 0) {
          const totalAttempts = attempts.length;
          const avgScore = Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / totalAttempts);
          const bestScore = Math.max(...attempts.map(att => att.score));
          const totalQuestions = attempts.reduce((sum, att) => sum + (att.quiz?.questions?.length || 0), 0);
          
          setStats({ totalAttempts, avgScore, bestScore, totalQuestions });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const features = [
    { 
      name: 'Start New Test', 
      path: '/new-test', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ), 
      description: 'Configure and start a new AI-generated or custom mock test.',
      color: 'bg-blue-50 border-blue-200',
      buttonText: 'Create Test'
    },
    { 
      name: 'Attempt History', 
      path: '/history', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      description: 'Review past attempts, analyze performance, and re-take quizzes.',
      color: 'bg-indigo-50 border-indigo-200',
      buttonText: 'View History'
    },
    { 
      name: 'YouTube Library', 
      path: '/library', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ), 
      description: 'Access curated playlists and video lectures for all subjects.',
      color: 'bg-red-50 border-red-200',
      buttonText: 'Explore Videos'
    },
    { 
      name: 'Quiz Library', 
      path: '/quiz-library', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ), 
      description: 'Browse all your quizzes, resume incomplete tests, or retry for better scores.',
      color: 'bg-indigo-50 border-indigo-200',
      buttonText: 'View Library'
    },
  ];

  const quickActions = [
    { 
      name: 'Full Syllabus Test', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: () => navigate('/new-test?mode=full'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      name: 'Scientific Calculator', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => setShowCalculator(true),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    { 
      name: 'Results & Analysis', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: () => navigate('/history'),
      color: 'bg-green-600 hover:bg-green-700'
    },
  ];

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Function to get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg> */}
              <img src="/iitb.png" alt="GATE Guide Logo" className="h-10 w-10 rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">GATE Guide</h1>
              <p className="text-blue-100 text-sm">AI-Powered Quiz Engine</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-blue-700 rounded-full px-4 py-2 flex items-center justify-center md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{user?.name || 'Guest'}</span>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/new-test')} 
                className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Test
              </button>
              
              <button 
                onClick={() => setShowCalculator(true)} 
                className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
                Calculator
              </button>
              
              <button 
                onClick={logout} 
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name || 'Student'}!</h1>
                <p className="text-gray-600">Ready to continue your GATE exam preparation?</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex items-center ${action.color} text-white px-4 py-2 rounded-md transition duration-200 shadow-md`}
                  >
                    {action.icon}
                    <span className="ml-2">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 flex flex-col">
                <span className="text-gray-500 text-sm uppercase font-medium">Total Tests</span>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">{stats.totalAttempts}</span>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 flex flex-col">
                <span className="text-gray-500 text-sm uppercase font-medium">Average Score</span>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <span className="text-3xl font-bold text-green-600">{stats.avgScore}%</span>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 flex flex-col">
                <span className="text-gray-500 text-sm uppercase font-medium">Best Score</span>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <span className="text-3xl font-bold text-purple-600">{stats.bestScore}%</span>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 flex flex-col">
                <span className="text-gray-500 text-sm uppercase font-medium">Questions Attempted</span>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                ) : (
                  <span className="text-3xl font-bold text-yellow-600">{stats.totalQuestions}</span>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity and Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features Section - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                  <div 
                    key={feature.name} 
                    className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border ${feature.color}`}
                  >
                    <div className="p-6">
                      <div className="mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                      <button 
                        onClick={() => navigate(feature.path)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                      >
                        {feature.buttonText}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Section - 1 column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              {loading ? (
                // Loading state
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : recentAttempts.length > 0 ? (
                // Recent attempts list
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {recentAttempts.map((attempt) => (
                      <li key={attempt.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{attempt.quiz?.topicName || 'Untitled Quiz'}</h4>
                            <p className="text-sm text-gray-500">{formatDate(attempt.createdAt)}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${getScoreColor(attempt.score)}`}>
                              {attempt.score}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-3">
                          <button 
                            onClick={() => navigate(`/results/${attempt.id}`)} 
                            className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded transition"
                          >
                            View Results
                          </button>
                          <button 
                            onClick={() => navigate(`/dummylogin/${attempt.quizId}`)} 
                            className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-2 py-1 rounded transition"
                          >
                            Retake
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 px-4 py-3">
                    <button 
                      onClick={() => navigate('/history')} 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      View All Activity
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                // No attempts state
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-700">No recent activity</h3>
                  <p className="mt-2 text-gray-500 text-sm">Take your first test to see your activity here.</p>
                  <button 
                    onClick={() => navigate('/new-test')} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition"
                  >
                    Start a Test
                  </button>
                </div>
              )}
              
              {/* Study Recommendations */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">Study Tip</h3>
                <p className="text-purple-100 mb-4">Focus on consistent practice rather than cramming. Regular testing helps retain knowledge better.</p>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => navigate('/library')} 
                    className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-md shadow transition flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Watch Tutorials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} GATE Guide. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Calculator */}
      {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default DashboardPage;