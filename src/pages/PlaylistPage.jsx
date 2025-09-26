import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPlaylists, getSyllabusTree } from '../services/api'; // Add this import
import VirtualCalculator from '../components/VirtualCalculator';

const PlaylistPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showCalculator, setShowCalculator] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    // Fetch playlists
    const fetchPlaylists = async () => {
      try {
        const response = await getPlaylists();
        setPlaylists(response.data);

        // console.log('Fetched playlists:', response.data);
        
        // Extract unique subjects from playlists
        const uniqueSubjects = new Map();
        response.data.forEach(playlist => {
          if (playlist.subjectId && !uniqueSubjects.has(playlist.subjectId)) {
            // Try to get subject name - in a real app, you might fetch this from an API
            const subjectName = getSubjectName(playlist.subjectId) || 'Unknown Subject';
            uniqueSubjects.set(playlist.subjectId, subjectName);
          }
        });
        
        const subjectsList = Array.from(uniqueSubjects).map(([id, name]) => ({
          id,
          name
        }));
        // console.log('Extracted subjects:', subjectsList);
        
        setSubjects(subjectsList);
      } catch (err) {
        setError('Failed to load playlists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch subjects
    const fetchSubjects = async () => {
      try {
        const res = await getSyllabusTree();
        setAllSubjects(res.data.map(s => ({ id: s.id, name: s.name })));
      } catch (err) {
        // Optionally handle error
        console.error('Failed to load subjects:', err);
      }
    };

    fetchPlaylists();
    fetchSubjects();
  }, []);

  // Updated getSubjectName function
  const getSubjectName = (subjectId) => {
    const subject = allSubjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  useEffect(() => {
    // Extract unique subjects from playlists using the updated getSubjectName
    if (playlists.length && allSubjects.length) {
      const uniqueSubjects = new Map();
      playlists.forEach(playlist => {
        if (playlist.subjectId && !uniqueSubjects.has(playlist.subjectId)) {
          const subjectName = getSubjectName(playlist.subjectId);
          uniqueSubjects.set(playlist.subjectId, subjectName);
        }
      });
      const subjectsList = Array.from(uniqueSubjects).map(([id, name]) => ({
        id,
        name
      }));
      setSubjects(subjectsList);
    }
  }, [playlists, allSubjects]);

  // Filter playlists based on search term and selected subject
  const filteredPlaylists = useMemo(() => {
    return playlists.filter(playlist => {
      const matchesSearch = 
        searchTerm === '' || 
        playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        playlist.channelName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = 
        selectedSubject === 'all' || 
        playlist.subjectId === selectedSubject;
      
      return matchesSearch && matchesSubject;
    });
  }, [playlists, searchTerm, selectedSubject]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">YouTube Library</h1>
              <p className="text-red-100 text-sm">Watch curated video lectures</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center bg-white text-red-800 px-4 py-2 rounded-md hover:bg-red-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </button>
              
              <button 
                onClick={() => setShowCalculator(true)} 
                className="flex items-center bg-white text-red-800 px-4 py-2 rounded-md hover:bg-red-50 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
                Calculator
              </button>
              
              <button 
                onClick={logout} 
                className="flex items-center bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-950 transition shadow"
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

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search playlists by title or channel..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
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
            </div>
            
            {/* Subject Filter */}
            <div className="md:w-64">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
            <p className="text-gray-500">Loading playlists...</p>
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
        
        {/* Search Results Info */}
        {!loading && !error && searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredPlaylists.length === 0 
                ? 'No results found' 
                : `Found ${filteredPlaylists.length} ${filteredPlaylists.length === 1 ? 'playlist' : 'playlists'} matching "${searchTerm}"`}
            </p>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredPlaylists.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">No playlists available</h3>
            <p className="text-gray-500 mt-2">Check back later for new content</p>
          </div>
        )}
        
        {/* Playlist Grid */}
        {!loading && filteredPlaylists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlaylists.map(playlist => (
              <Link 
                to={`/library/playlist/${playlist.playlistId}`} 
                key={playlist.id} 
                state={{ playlistTitle: playlist.title, channelName: playlist.channelName }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
              >
                <div className="relative">
                  <img 
                    src={playlist.thumbnailUrl} 
                    alt={playlist.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/640x360?text=No+Thumbnail";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <span className="text-white font-medium">Click to view videos</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                    {playlist._count?.videos || 0} videos
                  </div>
                  {getSubjectName(playlist.subjectId) && (
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {getSubjectName(playlist.subjectId)}
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                    {playlist.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center mt-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {playlist.channelName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
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

export default PlaylistPage;