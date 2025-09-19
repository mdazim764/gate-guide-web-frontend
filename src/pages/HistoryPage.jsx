import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { getAllAttempts, getQuizForRetake, getSyllabusTree } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { startTest } = useTest();
  const { logout, user } = useAuth();

  const [attempts, setAttempts] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and searching state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'score-high', 'score-low'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attemptsRes, subjectsRes] = await Promise.all([
          getAllAttempts(),
          getSyllabusTree()
        ]);
        setAttempts(attemptsRes.data);
        setSubjects(subjectsRes.data);
      } catch (err) {
        setError("Failed to fetch your attempt history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleRetake = async (quizId) => {
      try {
          const response = await getQuizForRetake(quizId);
          startTest(response.data.id, response.data.questions);
          navigate(`/dummylogin/${response.data.id}`);
      } catch (err) {
          setError("Could not start the re-take. The quiz may no longer be available.");
      }
  };

  const filteredAttempts = useMemo(() => {
    return attempts
      .filter(attempt => {
        // Subject filter
        if (selectedSubject === 'all') return true;
        return attempt.quiz.subjectId === selectedSubject;
      })
      .filter(attempt => {
        // Search term filter
        return attempt.quiz.topicName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === 'recent') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'score-high') {
          return b.score - a.score;
        } else if (sortBy === 'score-low') {
          return a.score - b.score;
        }
        return 0;
      });
  }, [attempts, searchTerm, selectedSubject, sortBy]);

  // Get stats for summary cards
  const stats = useMemo(() => {
    if (attempts.length === 0) return { total: 0, avgScore: 0, best: 0 };
    
    const total = attempts.length;
    const avgScore = Math.round(attempts.reduce((sum, att) => sum + att.score, 0) / total);
    const best = Math.max(...attempts.map(att => att.score));
    
    return { total, avgScore, best };
  }, [attempts]);
  
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
          <div>
            <h1 className="text-3xl font-bold">Test History</h1>
            <p className="text-blue-100 mt-1">Review and track your progress</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/new-test')} 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Test
            </button>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
                <path d="M4 8a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Total Attempts</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Average Score</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.avgScore}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-gray-500 text-sm font-medium uppercase">Highest Score</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.best}%</p>
            </div>
          </div>
          
          {/* Enhanced Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Your Attempts</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text"
                    placeholder="Search by quiz name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score-high">Highest Score</option>
                  <option value="score-low">Lowest Score</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Attempts List */}
          <div className="space-y-6">
            {!loading && filteredAttempts.length > 0 ? (
                filteredAttempts.map(attempt => (
                    <div key={attempt.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                        <div className="md:flex">
                            {/* Score Indicator - Enhanced based on image */}
                            <div className={`w-full md:w-36 flex flex-row md:flex-col items-center justify-center p-6 ${
                              attempt.score >= 70 ? 'bg-green-50' : 
                              attempt.score >= 40 ? 'bg-blue-50' : 'bg-red-50'
                            }`}>
                                <div className="relative h-24 w-24">
                                    {/* Outer circle background */}
                                    <div className={`absolute inset-0 rounded-full border-4 ${
                                        attempt.score >= 80 ? 'border-green-500' : 
                                        attempt.score >= 60 ? 'border-blue-500' : 
                                        attempt.score >= 40 ? 'border-yellow-500' : 'border-red-500'
                                    }`}></div>
                                    
                                    {/* Score percentage */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                                            {attempt.score}%
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-4 md:ml-0 md:mt-3 text-center">
                                    <span className="text-sm font-bold uppercase text-gray-600">SCORE</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                                            {attempt.quiz.topicName}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            {subjects.find(s => s.id === attempt.quiz.subjectId) && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                                    </svg>
                                                    {subjects.find(s => s.id === attempt.quiz.subjectId)?.name}
                                                </div>
                                            )}
                                            {attempt.timeSpent && (
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    {Math.floor(attempt.timeSpent / 60)} min {attempt.timeSpent % 60} sec
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                                    <button 
                                        onClick={() => navigate(`/results/${attempt.id}`)}
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                        View Results
                                    </button>
                                    <button 
                                        onClick={() => handleRetake(attempt.quizId)}
                                        className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        Re-Attempt Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                !loading && (
                    <div className="bg-white p-12 rounded-lg shadow-md text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-800">No attempts found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filters, or take a new test.</p>
                        <button 
                            onClick={() => navigate('/new-test')} 
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                        >
                            Start a New Test
                        </button>
                    </div>
                )
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm">© {new Date().getFullYear()} GATE Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;