import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTION, DRAMA, COMEDY, CLASSIC, DOCUMENTARY, ROMANCE, THRILLER, TRENDING, TOP_10, CATEGORIES } from '../data/movies.js';
import { ChevronRight, Play, Zap, Theater, Laugh, Film, Video, Heart, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  { id: 'trending', title: '🔥 Trending Now', movies: TRENDING },
  { id: 'top10', title: '🏆 Top 10', movies: TOP_10 },
  { id: 'action', title: '⚡ Action', movies: ACTION },
  { id: 'drama', title: '🎭 Drama', movies: DRAMA },
  { id: 'comedy', title: '😂 Comedy', movies: COMEDY },
  { id: 'classic', title: '🎬 Classic', movies: CLASSIC },
  { id: 'documentary', title: '📹 Documentary', movies: DOCUMENTARY },
  { id: 'romance', title: '❤️ Romance', movies: ROMANCE },
  { id: 'thriller', title: '🔪 Thriller', movies: THRILLER }
];

const CATEGORY_ICONS = {
  'action': Zap,
  'drama': Theater,
  'comedy': Laugh,
  'classic': Film,
  'documentary': Video,
  'romance': Heart,
  'thriller': AlertTriangle
};

export default function CategoriesGrid() {
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Category Tiles - Small Image-Based */}
      <div className="px-4">
        <h2 className="text-white font-bold text-lg mb-3 tracking-wide">Categories</h2>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Zap;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="relative overflow-hidden rounded-xl aspect-[3/2] group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-400 mb-1 group-hover:text-yellow-400 transition-colors" />
                  <span className="text-white text-xs font-bold tracking-wider uppercase">
                    {cat.name}
                  </span>
                </div>
                <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-emerald-500/50 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Movie Sections */}
      {SECTIONS.map((section) => (
        <div key={section.id} className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base tracking-wide">{section.title}</h2>
            <button 
              onClick={() => handleCategoryClick(section.id.replace(/\d+/g, ''))}
              className="text-emerald-400 text-xs flex items-center gap-1 hover:text-yellow-400 transition-colors font-medium"
            >
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {section.movies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="flex-shrink-0 text-left group"
                style={{ width: '120px' }}
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-gray-900 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all shadow-lg shadow-black/50">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/0a0a0a/10b981?text=No+Poster';
                    }}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {movie.isPupaOriginal && (
                    <div className="absolute top-1 left-1 px-1 py-0.5 bg-emerald-600 rounded text-[9px] text-white font-bold">
                      PUPA
                    </div>
                  )}

                  <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[9px] text-emerald-300 font-medium">
                    {movie.duration}
                  </div>
                </div>

                <p className="text-white text-xs font-semibold truncate group-hover:text-emerald-400 transition-colors">
                  {movie.title}
                </p>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-gray-500 text-[10px]">{movie.year}</span>
                  <span className="text-gray-700 text-[10px]">•</span>
                  <span className="text-gray-500 text-[10px]">{movie.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}