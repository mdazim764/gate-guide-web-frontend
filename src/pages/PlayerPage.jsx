import React from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { useAuth } from '../context/AuthContext';

const PlayerPage = () => {
    const { videoId } = useParams();
    const { state } = useLocation(); // Access data passed from the Link component
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // state contains { video, playlistVideos }
    const currentVideo = state?.video;
    const playlistVideos = state?.playlistVideos || [];
    
    const opts = {
        height: '480',
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
    };
    
    const currentIndex = playlistVideos.findIndex(v => v.videoId === videoId);
    const upNextVideos = playlistVideos.slice(currentIndex + 1);

    if (!currentVideo) {
        return <div className="p-8">Loading video information...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
             <header className="bg-white shadow-md p-4 flex justify-between items-center">
                 <div>
                    <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">{'< Back to Video List'}</button>
                    <h1 className="text-2xl font-bold text-gray-800 mt-2 truncate">{currentVideo.title}</h1>
                 </div>
                 <div>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </div>
            </header>
            <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black rounded-lg overflow-hidden">
                    <YouTube videoId={videoId} opts={opts} className="w-full h-full aspect-video"/>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Up Next</h2>
                    {upNextVideos.map(video => (
                        <Link 
                            to={`/video/${video.videoId}`} 
                            key={video.id} 
                            state={{ video, playlistVideos }}
                            className="bg-white p-2 rounded-lg shadow flex items-start gap-3 hover:bg-blue-50"
                        >
                            <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-16 object-cover rounded"/>
                            <div>
                                <h3 className="text-sm font-semibold leading-tight">{video.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};
export default PlayerPage;