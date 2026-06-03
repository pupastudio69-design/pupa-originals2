import React from 'react';
import { Play, Star } from 'lucide-react';

// Safe import with fallback
let getMoviesByCategory = null;
try {
  const movies = require('../movies.js');
  getMoviesByCategory = movies.getMoviesByCategory;
} catch (e) {
  console.warn('Could not load movies.js, using fallback data');
}

// Fallback movie data if movies.js fails to load
const FALLBACK_MOVIES = {
  'Romance': [
    { id: 1, title: "Love and Destiny", poster: "https://img.youtube.com/vi/MEHS0OQSugg/maxresdefault.jpg", rating: "8.8", year: 2026 },
    { id: 2, title: "The Cancelled Marriage", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-faL4ZzKTuLY&mediatype=movies", rating: "8.5", year: 2016 },
    { id: 3, title: "Mercy Johnson The Innocent Girl", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-UWoXG0z9o04&mediatype=movies", rating: "8.9", year: 2016 },
    { id: 4, title: "Two Hearts in Love", poster: "https://archive.org/services/get-item-image.php?identifier=youtube--KAEloOBCVI&mediatype=movies", rating: "8.3", year: 2016 },
  ],
  'Drama': [
    { id: 5, title: "Who Will Be The Next King?", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-EOQyGU5VguY&mediatype=movies", rating: "9.0", year: 2016 },
    { id: 6, title: "Betrayer in the Palace", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-bq7zA0y-Bh4&mediatype=movies", rating: "9.0", year: 2016 },
    { id: 7, title: "Blood of an Innocent Girl", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-Y6wYyq96nKY&mediatype=movies", rating: "8.7", year: 2016 },
    { id: 8, title: "My Sister's Man", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-NKrHwHSCajo&mediatype=movies", rating: "8.7", year: 2016 },
  ],
  'Comedy': [
    { id: 9, title: "Ewa Aganyin", poster: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80", rating: "8.5", year: 2024 },
    { id: 10, title: "All That Glitters", poster: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80", rating: "8.3", year: 2024 },
    { id: 11, title: "Love in Ghetto", poster: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80", rating: "8.7", year: 2026 },
    { id: 12, title: "Where is My Husband", poster: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80", rating: "8.7", year: 2026 },
  ],
  'Action': [
    { id: 13, title: "Lagos Nights", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", rating: "8.5", year: 2025 },
    { id: 14, title: "Blood of the Sahara", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", rating: "8.4", year: 2025 },
    { id: 15, title: "The Last King", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", rating: "8.3", year: 2025 },
    { id: 16, title: "Queen of Benin", poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", rating: "8.2", year: 2025 },
  ],
  'Thriller': [
    { id: 17, title: "The Snake Baby", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-UpEx4z4Fej4&mediatype=movies", rating: "8.2", year: 2016 },
    { id: 18, title: "Envy of the Village", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-LH8ESNL3LDk&mediatype=movies", rating: "8.3", year: 2016 },
    { id: 19, title: "My Loving Husband", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-1blG-Rt6M-s&mediatype=movies", rating: "8.4", year: 2016 },
    { id: 20, title: "Passion and True Love", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-aIAwmFeQU5s&mediatype=movies", rating: "8.6", year: 2016 },
  ],
  'Epic': [
    { id: 21, title: "Beauty of the Gods", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-De_EcD7MHjQ&mediatype=movies", rating: "8.8", year: 2016 },
    { id: 22, title: "Powerful Kingdom", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-pEjN8aqv7Sk&mediatype=movies", rating: "8.9", year: 2016 },
    { id: 23, title: "Queen Cleopatra", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-TCXxSdkIoy4&mediatype=movies", rating: "8.5", year: 2016 },
    { id: 24, title: "Who Will Be The Next King? 2", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-3-dGLEtutHc&mediatype=movies", rating: "8.9", year: 2016 },
  ],
  'Horror': [
    { id: 25, title: "The Snake Baby", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-UpEx4z4Fej4&mediatype=movies", rating: "8.2", year: 2016 },
    { id: 26, title: "Blood of an Innocent Girl", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-Y6wYyq96nKY&mediatype=movies", rating: "8.7", year: 2016 },
    { id: 27, title: "The Cancelled Marriage", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-faL4ZzKTuLY&mediatype=movies", rating: "8.5", year: 2016 },
    { id: 28, title: "My Sister's Man", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-NKrHwHSCajo&mediatype=movies", rating: "8.7", year: 2016 },
  ],
  'Historical': [
    { id: 29, title: "Queen Cleopatra", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-TCXxSdkIoy4&mediatype=movies", rating: "8.5", year: 2016 },
    { id: 30, title: "Beauty of the Gods", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-De_EcD7MHjQ&mediatype=movies", rating: "8.8", year: 2016 },
    { id: 31, title: "Who Will Be The Next King?", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-EOQyGU5VguY&mediatype=movies", rating: "9.0", year: 2016 },
    { id: 32, title: "Betrayer in the Palace", poster: "https://archive.org/services/get-item-image.php?identifier=youtube-bq7zA0y-Bh4&mediatype=movies", rating: "9.0", year: 2016 },
  ],
};

function getMovies(catName) {
  if (getMoviesByCategory) {
    try {
      const movies = getMoviesByCategory(catName);
      if (movies && movies.length > 0) return movies;
    } catch (e) {
      console.warn('getMoviesByCategory failed, using fallback');
    }
  }
  return FALLBACK_MOVIES[catName] || [];
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
        const movies = getMovies(cat.name).slice(0, 4);
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
              <p className="text-gray-500 text-sm">Loading movies...</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {movies.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => onMovieSelect && onMovieSelect(movie)}
                    className="relative aspect-[2/3] rounded-xl overflow-hidden group"
                  >
                    <img 
                      src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Image'} 
                      alt={movie.title || 'Movie'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-semibold truncate">{movie.title || 'Untitled'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-xs">{movie.rating || 'N/A'}</span>
                        <span className="text-gray-400 text-xs ml-1">{movie.year || '2024'}</span>
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