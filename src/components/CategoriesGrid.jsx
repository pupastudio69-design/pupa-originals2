import React from 'react';
import { Play, Star } from 'lucide-react';

// Try multiple possible paths for movies.js
let getMoviesByCategory;
try {
  // Try src/movies.js (most common)
  const movies = require('../movies.js');
  getMoviesByCategory = movies.getMoviesByCategory;
} catch (e1) {
  try {
    // Try src/data/movies.js
    const movies = require('../data/movies.js');
    getMoviesByCategory = movies.getMoviesByCategory;
  } catch (e2) {
    try {
      // Try src/lib/movies.js
      const movies = require('../lib/movies.js');
      getMoviesByCategory = movies.getMoviesByCategory;
    } catch (e3) {
      // Fallback: return empty array
      getMoviesByCategory = () => [];
      console.warn('movies.js not found. Please ensure it exists in src/ folder');
    }
  }
}

export default function CategoriesGrid({ onMovieSelect, onCategorySelect }) {
  const categories = [
    { name: 'Romance', icon: '💕', color: 'from-pink-600 to-rose-600' },
    { name: 'Drama', icon: '🎭', color: 'from-purple-600 to-indigo-600' },
    { name: 'Comedy', icon: '😂', color: 'from-yellow-600 to-orange-600' },
    { name: 'Action', icon: '💥', color: 'from-red-600 to-orange-600' },
    { name: 'Thriller', icon: '🔪', color: 'from-gray-600 to-slate-600' },
    { name: 'Epic', icon: '👑', color: 'from-amber-600 to-yellow-600' },
    { name: 'Horror', icon: '👻', color: 'from-green-600 to-emerald-600' },
    { name: 'Historical', icon: '🏛️', color: 'from-blue-600 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Categories</h1>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => onCategorySelect(cat.name)}
            className={`relative p-4 rounded-xl bg-gradient-to-br ${cat.color} text-white text-left overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
            <span className="text-2xl mb-2 block">{cat.icon}</span>
            <span className="font-semibold text-sm">{cat.name}</span>
            <span className="text-white/60 text-xs block">20+ movies</span>
          </button>
        ))}
      </div>

      {/* Category Movies Preview */}
      {categories.map(cat => {
        const movies = getMoviesByCategory(cat.name).slice(0, 4);
        return (
          <div key={cat.name} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">{cat.name}</h2>
              <button 
                onClick={() => onCategorySelect(cat.name)}
                className="text-purple-400 text-xs"
              >
                See All
              </button>
            </div>
            {movies.length === 0 ? (
              <p className="text-gray-500 text-sm">No movies found. Check movies.js location.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {movies.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => onMovieSelect(movie)}
                    className="relative aspect-[2/3] rounded-xl overflow-hidden group"
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-semibold truncate">{movie.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs">{movie.rating}</span>
                        <span className="text-gray-400 text-xs ml-1">{movie.year}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}