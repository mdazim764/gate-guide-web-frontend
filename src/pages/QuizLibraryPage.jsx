import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTest } from '../context/TestContext';
import { getMyQuizzes,getQuizForRetake } from '../services/api';
import VirtualCalculator from '../components/VirtualCalculator';

const QuizLibraryPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { startTest } = useTest();
  const limit = 9;
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();

    const handleRetake = async (quizId) => {
      try {
          const response = await getQuizForRetake(quizId);
          startTest(response.data.id, response.data.questions);
          navigate(`/dummylogin/${response.data.id}`);
      } catch (err) {
          setError("Could not start the quiz. The quiz may no longer be available.");
      }
  };

  // Fetch quizzes when component mounts or filter changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        
        // Build filters object based on currentFilter
        const filters = {};
        if (currentFilter === 'not_attempted') {
          filters.status = 'not_started';
        } else if (currentFilter === 'in_progress') {
          filters.status = 'in_progress';
        } else if (currentFilter === 'low_score') {
          // We'll handle low score filtering on the client side
        }
        
        if (selectedSubject !== 'all') {
          filters.subject = selectedSubject;
        }
        
        const response = await getMyQuizzes(page, limit, filters);
        
        if (page === 1) {
          setQuizzes(response.data.quizzes);
        } else {
          setQuizzes(prev => [...prev, ...response.data.quizzes]);
        }
        
        // If we received fewer quizzes than the limit, there are no more to load
        setHasMore(response.data.quizzes.length === limit);
        
        // Extract unique subjects for filtering
        const uniqueSubjects = [...new Set(response.data.quizzes.map(quiz => quiz.subject))];
        if (page === 1) {
          setSubjects(uniqueSubjects);
        }
      } catch (err) {
        setError('Failed to load quizzes. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [page, currentFilter, selectedSubject]);

  // Filter and search quizzes
  const filteredQuizzes = useMemo(() => {
    let result = [...quizzes];
    
    // Apply low score filter if selected (consider scores below 50% as low)
    if (currentFilter === 'low_score') {
      result = result.filter(quiz => 
        quiz.bestScore !== null && quiz.bestScore < 50 && quiz.status !== 'not_started'
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [quizzes, currentFilter, searchTerm]);

  const loadMoreQuizzes = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Get appropriate badge color based on quiz status
  const getStatusBadgeColor = (quiz) => {
    switch(quiz.status) {
      case 'mastered':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get quiz type badge color
  const getTypeBadgeColor = (type) => {
    switch(type) {
      case 'AI':
        return 'bg-purple-100 text-purple-800';
      case 'PYQ':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Quiz Library</h1>
              <p className="text-blue-100 text-sm">Browse and manage your quizzes</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </button>
            
            <button 
              onClick={() => navigate('/new-test')} 
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Quiz
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
      </header>

      {/* Filter and Search Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap ${
                  currentFilter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentFilter('all');
                  setPage(1);
                }}
              >
                All Quizzes
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap ${
                  currentFilter === 'not_attempted' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentFilter('not_attempted');
                  setPage(1);
                }}
              >
                Not Attempted
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap ${
                  currentFilter === 'in_progress' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentFilter('in_progress');
                  setPage(1);
                }}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  currentFilter === 'low_score' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setCurrentFilter('low_score');
                  setPage(1);
                }}
              >
                Low Score
              </button>
            </div>
            
            {/* Search and Subject Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <select
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && page === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
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
        
        {/* Empty State */}
        {!loading && filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No quizzes found</h3>
            <p className="text-gray-500">
              {currentFilter === 'all' 
                ? "You haven't created any quizzes yet." 
                : `No ${currentFilter.replace('_', ' ')} quizzes found.`}
            </p>
            <button
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/new-test')}
            >
              Create New Quiz
            </button>
          </div>
        )}
        
        {/* Quiz Grid */}
        {!loading && filteredQuizzes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeBadgeColor(quiz.type)}`}>
                        {quiz.type}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(quiz)}`}>
                        {quiz.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{quiz.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                        {quiz.subject}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                        {quiz.questionCount} Questions
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-1">
                        {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                    
                    {quiz.attemptCount > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Best Score</span>
                          <span className={
                            quiz.bestScore >= 70 ? "text-green-600 font-semibold" :
                            quiz.bestScore >= 40 ? "text-yellow-600 font-semibold" :
                            "text-red-600 font-semibold"
                          }>{quiz.bestScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={
                              quiz.bestScore >= 70 ? "bg-green-500 h-2 rounded-full" :
                              quiz.bestScore >= 40 ? "bg-yellow-500 h-2 rounded-full" :
                              "bg-red-500 h-2 rounded-full"
                            }
                            style={{ width: `${quiz.bestScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-4">
                      {quiz.status === 'not_started' ? (
                        <button
                          onClick={() => handleRetake(quiz.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Start Quiz
                        </button>
                      ) : quiz.status === 'in_progress' ? (
                        <button
                          onClick={() => handleRetake(quiz.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                          </svg>
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRetake(quiz.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Retake
                        </button>
                      )}
                      
                      {quiz.latestAttemptId && (
                        <button
                          onClick={() => navigate(`/results/${quiz.latestAttemptId}`)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v1a1 1 0 102 0v-1zm2-3a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm4-1a1 1 0 10-2 0v5a1 1 0 102 0V8z" clipRule="evenodd" />
                          </svg>
                          Results
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button 
                  onClick={loadMoreQuizzes}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading && page > 1 ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} GATE Guide. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Calculator */}
      {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
    </div>
  );
};

export default QuizLibraryPage;
