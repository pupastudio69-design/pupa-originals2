import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOP_10 } from '../data/movies.js';
import { Play, TrendingUp } from 'lucide-react';

export default function Top10Row() {
  const navigate = useNavigate();

  return (
    <section className="mb-8 px-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={14} className="text-emerald-400" />
        <h2 className="font-body font-semibold text-white text-base">Top 10</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {TOP_10.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex-shrink-0 flex items-end gap-2 group"
            style={{ width: 200 }}
          >
            {/* Number */}
            <span 
              className="text-5xl font-bold leading-none"
              style={{ 
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
                fontFamily: 'system-ui'
              }}
            >
              {index + 1}
            </span>

            {/* Poster */}
            <div className="relative flex-1 rounded-lg overflow-hidden aspect-[2/3] bg-gray-900 group-hover:ring-2 group-hover:ring-emerald-500/50 transition-all">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/0a0a0a/10b981?text=No+Poster';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Hover play */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-emerald-500/90 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}