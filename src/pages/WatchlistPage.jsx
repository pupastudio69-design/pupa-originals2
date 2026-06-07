import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, Play } from 'lucide-react';

const FALLBACK_POSTER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" fill="white" font-size="16" text-anchor="middle" dy=".3em">Pupa</text></svg>';

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
  });

  const removeFromWatchlist = (movieId) => {
    const updated = watchlist.filter(item => item.id !== movieId);
    setWatchlist(updated);
    localStorage.setItem('pupa_watchlist', JSON.stringify(updated));
  };

  const clearWatchlist = () => {
    if (window.confirm('Clear your entire watchlist?')) {
      setWatchlist([]);
      localStorage.removeItem('pupa_watchlist');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/me')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">My Watchlist</h1>
          <button 
            onClick={clearWatchlist}
            disabled={watchlist.length === 0}
            className="text-red-400 text-xs disabled:text-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-sm font-medium mb-1">Your Watchlist is Empty</h3>
            <p className="text-gray-500 text-xs mb-4">Save movies you want to watch later</p>
            <button
              onClick={() => navigate('/tv-shows')}
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <button
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="text-left w-full"
                >
                  <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3]">
                    <img
                      src={movie.poster || FALLBACK_POSTER}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Play button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play size={20} className="text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white text-xs font-medium truncate">{movie.title}</h3>
                  <p className="text-gray-500 text-[10px]">{movie.year} · {movie.genre}</p>
                </button>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(movie.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
