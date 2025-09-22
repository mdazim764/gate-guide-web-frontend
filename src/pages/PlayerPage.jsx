import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { useAuth } from '../context/AuthContext';
import VirtualCalculator from '../components/VirtualCalculator';

const PlayerPage = () => {
    const { videoId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [showCalculator, setShowCalculator] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    
    // state contains { video, playlistVideos }
    const currentVideo = state?.video;
    const playlistVideos = state?.playlistVideos || [];
    
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
        },
    };
    
    const currentIndex = playlistVideos.findIndex(v => v.videoId === videoId);
    const upNextVideos = playlistVideos.slice(currentIndex + 1, currentIndex + 11); // Only show next 10
    const prevVideo = currentIndex > 0 ? playlistVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < playlistVideos.length - 1 ? playlistVideos[currentIndex + 1] : null;

    // Format video duration (convert "10:30" to "10:30")
    const formatDuration = (duration) => {
        if (!duration) return "";
        const parts = duration.split(':');
        if (parts.length === 3) {
            return `${parts[0]}:${parts[1]}:${parts[2]}`;
        }
        return `${parts[0]}:${parts[1]}`;
    };

    if (!currentVideo) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading video information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Header */}
            <header className="bg-gray-900 text-white py-4 px-4 lg:px-8 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mr-4 hover:bg-gray-700 rounded-full p-2 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-medium truncate max-w-sm md:max-w-md lg:max-w-lg">
                        {currentVideo.title}
                    </h1>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => navigate('/library')} 
                        className="hidden md:flex items-center text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        Library
                    </button>
                    
                    <button 
                        onClick={() => setShowCalculator(true)} 
                        className="flex items-center text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    <button 
                        onClick={logout} 
                        className="text-gray-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-red-800 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row">
                {/* Player Section */}
                <div className="lg:w-3/4 xl:w-4/5 flex flex-col">
                    {/* YouTube Player */}
                    <div className="w-full bg-black aspect-video">
                        <YouTube videoId={videoId} opts={opts} className="h-full w-full"/>
                    </div>
                    
                    {/* Video Info */}
                    <div className="bg-gray-900 text-white p-4 lg:p-6 border-b border-gray-800 lg:border-b-0">
                        <h2 className="text-xl font-bold mb-2">{currentVideo.title}</h2>
                        
                        {/* Navigation Controls */}
                        <div className="flex items-center justify-between flex-wrap gap-3 my-4">
                            <div className="flex items-center text-sm text-gray-300">
                                <span>Video {currentIndex + 1} of {playlistVideos.length}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => prevVideo && navigate(`/video/${prevVideo.videoId}`, { state: { video: prevVideo, playlistVideos } })}
                                    disabled={!prevVideo}
                                    className={`flex items-center px-3 py-1.5 rounded ${prevVideo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                    Previous
                                </button>
                                <button 
                                    onClick={() => nextVideo && navigate(`/video/${nextVideo.videoId}`, { state: { video: nextVideo, playlistVideos } })}
                                    disabled={!nextVideo}
                                    className={`flex items-center px-3 py-1.5 rounded ${nextVideo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
                                >
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Description Toggle */}
                        <button 
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center mt-2"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? 'Hide description' : 'Show description'}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showDescription ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        {/* Description Panel */}
                        {showDescription && (
                            <div className="mt-4 bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
                                <p>
                                    This lecture is part of the {state?.playlistVideos[0]?.channelTitle || 'course'} series. 
                                    The video covers important concepts related to {currentVideo.title.split('|').pop()?.trim() || 'the topic'}.
                                </p>
                                <p className="mt-2">
                                    Duration: {currentVideo.duration}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Sidebar - Up Next */}
                <div className="lg:w-1/4 xl:w-1/5 bg-gray-900 border-l border-gray-800">
                    <div className="p-4 bg-gray-800">
                        <h3 className="text-white font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Up Next
                        </h3>
                    </div>
                    
                    <div className="overflow-y-auto h-[calc(100vh-13.5rem)]">
                        {upNextVideos.length > 0 ? (
                            upNextVideos.map((video, index) => (
                                <button 
                                    onClick={() => navigate(`/video/${video.videoId}`, { state: { video, playlistVideos }})}
                                    key={video.id}
                                    className={`w-full text-left p-3 border-b border-gray-800 flex hover:bg-gray-800/50 transition ${video.videoId === videoId ? 'bg-gray-800' : ''}`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img 
                                            src={video.thumbnailUrl} 
                                            alt={video.title} 
                                            className="w-28 h-16 object-cover rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/480x360?text=No+Thumbnail";
                                            }}
                                        />
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm text-gray-100 line-clamp-2">{video.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Lecture {currentIndex + index + 2}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <p>This is the last video in the playlist</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Calculator */}
            {showCalculator && <VirtualCalculator onClose={() => setShowCalculator(false)} />}
        </div>
    );
};

export default PlayerPage;