import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPlaylistVideos } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VideoListPage = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [playlistInfo, setPlaylistInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await getPlaylistVideos(playlistId);
                setVideos(response.data.videos);
                setPlaylistInfo({ title: response.data.title, channelName: response.data.channelName });
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [playlistId]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <div>
                    <button onClick={() => navigate('/library')} className="text-blue-600 hover:underline">{'< Back to Playlists'}</button>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">{playlistInfo.title}</h1>
                    <p className="text-gray-500">{playlistInfo.channelName}</p>
                </div>
                 <div>
                    <button onClick={() => navigate('/')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-300">Dashboard</button>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>
            </header>
            <main className="p-8">
                {loading ? <p>Loading videos...</p> : (
                    <div className="space-y-4">
                        {videos.map(video => (
                             <Link 
                                to={`/video/${video.videoId}`} 
                                key={video.id} 
                                state={{ video, playlistVideos: videos }} // Pass data via route state
                                className="bg-white p-4 rounded-lg shadow-md flex items-start gap-4 hover:bg-blue-50 transition"
                            >
                                <img src={video.thumbnailUrl} alt={video.title} className="w-40 h-24 object-cover rounded-md"/>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{video.title}</h3>
                                    <p className="text-sm text-gray-500">{video.channelTitle}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default VideoListPage;