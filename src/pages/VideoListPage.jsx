import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPlaylistVideos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import VirtualCalculator from '../components/VirtualCalculator';

const VideoListPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [showCalculator, setShowCalculator] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await getPlaylistVideos(playlistId);
                setVideos(response.data.videos);
                setPlaylistInfo({ 
                    title: response.data.title, 
                    channelName: response.data.channelName,
                    thumbnailUrl: response.data.thumbnailUrl 
                });
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [playlistId]);

    // Filter videos based on search term
    const filteredVideos = useMemo(() => {
        if (!searchTerm) return videos;
        return videos.filter(video => 
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [videos, searchTerm]);

    // Calculate total duration of playlist
    const totalDuration = useMemo(() => {
        if (!videos.length) return "0:00";
        
        const totalSeconds = videos.reduce((total, video) => {
            const parts = video.duration.split(':');
            const seconds = parts.length === 3 
                ? parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2])
                : parseInt(parts[0])*60 + parseInt(parts[1]);
            return total + seconds;
        }, 0);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        return hours > 0 
            ? `${hours} hr ${minutes} min` 
            : `${minutes} min`;
    }, [videos]);

    // Format video duration (convert "10:30" to "10m 30s")
    const formatDuration = (duration) => {
        if (!duration) return "";
        const parts = duration.split(':');
        if (parts.length === 3) {
            return `${parts[0]}:${parts[1]}:${parts[2]}`;
        }
        return `${parts[0]}:${parts[1]}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header with gradient background */}
            <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <button 
                            onClick={() => navigate('/library')} 
                            className="mr-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold truncate max-w-md">{playlistInfo.title || "Loading..."}</h1>
                            <p className="text-red-100 text-sm">{playlistInfo.channelName || ""}</p>
                        </div>
                    </div>
                    
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
            </header>
            
            {/* Search bar and playlist info */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                        {playlistInfo.thumbnailUrl && (
                            <img 
                                src={playlistInfo.thumbnailUrl} 
                                alt={playlistInfo.title} 
                                className="h-16 w-28 object-cover rounded-lg shadow mr-4 hidden md:block"
                            />
                        )}
                        <div>
                            <div className="flex items-center">
                                <span className="text-gray-600 mr-4">{videos.length} videos</span>
                                <span className="text-gray-600">{totalDuration}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Browse all videos in this playlist or search for specific topics
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search videos in this playlist..."
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
            </div>
            
            <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
                {/* Loading State */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-md flex animate-pulse">
                                <div className="bg-gray-200 w-48 h-28 rounded-md"></div>
                                <div className="ml-4 flex-1">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Search Results Info */}
                        {searchTerm && (
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    {filteredVideos.length === 0 
                                        ? 'No videos found matching your search' 
                                        : `Found ${filteredVideos.length} ${filteredVideos.length === 1 ? 'video' : 'videos'} matching "${searchTerm}"`}
                                </p>
                            </div>
                        )}
                        
                        {/* Videos List */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {filteredVideos.map((video, index) => (
                                    <Link 
                                        to={`/video/${video.videoId}`} 
                                        key={video.id} 
                                        state={{ video, playlistVideos: videos }}
                                        className="block hover:bg-gray-50 transition"
                                    >
                                        <li className="p-4 flex">
                                            <div className="relative w-48 h-28 flex-shrink-0">
                                                <img 
                                                    src={video.thumbnailUrl} 
                                                    alt={video.title} 
                                                    className="w-full h-full object-cover rounded-md"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/480x360?text=No+Thumbnail";
                                                    }}
                                                />
                                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                                                    {formatDuration(video.duration)}
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex flex-col">
                                                <h3 className="text-gray-900 font-medium line-clamp-2">{video.title}</h3>
                                                <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        {video.duration}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                                        </svg>
                                                        Lecture {index + 1}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                                    Part of: {playlistInfo.title}
                                                </p>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Empty State */}
                        {filteredVideos.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-800">No videos found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search term</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 text-red-600 hover:text-red-700 font-medium flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </>
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

export default VideoListPage;