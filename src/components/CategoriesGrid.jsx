import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TRENDING, PUPA_ORIGINALS, NEW_RELEASES, AFRICAN_HITS, HERO_MOVIES, TOP_10 } from '../movies.js';
import { ChevronRight, Play } from 'lucide-react';

const SECTIONS = [
  { id: 'trending', title: '🔥 Trending Now', movies: TRENDING },
  { id: 'pupa-originals', title: '⭐ Pupa Originals', movies: PUPA_ORIGINALS },
  { id: 'new-releases', title: '🆕 New Releases', movies: NEW_RELEASES },
  { id: 'african-hits', title: '🌍 African Hits', movies: AFRICAN_HITS },
  { id: 'hero-movies', title: '🎬 Hero Movies', movies: HERO_MOVIES },
  { id: 'top-10', title: '🏆 Top 10', movies: TOP_10 }
];

export default function CategoriesGrid() {
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="space-y-8 pb-24">
      {SECTIONS.map((section) => (
        <div key={section.id} className="px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-lg">{section.title}</h2>
            <button className="text-purple-400 text-sm flex items-center gap-1 hover:text-purple-300 transition-colors">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Movies Row - Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {section.movies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
                className="flex-shrink-0 text-left group"
                style={{ width: '140px' }}
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800 group-hover:ring-2 group-hover:ring-purple-500/50 transition-all">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster';
                    }}
                  />

                  {/* Play Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Pupa Original Badge */}
                  {movie.isPupaOriginal && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-600 rounded text-[10px] text-white font-medium">
                      PUPA
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] text-white">
                    {movie.duration}
                  </div>
                </div>

                {/* Title */}
                <p className="text-white text-sm font-medium truncate group-hover:text-purple-400 transition-colors">
                  {movie.title}
                </p>

                {/* Year & Rating */}
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-gray-500 text-xs">{movie.year}</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-gray-500 text-xs">{movie.rating}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}