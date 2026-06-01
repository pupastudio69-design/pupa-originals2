import React from 'react';
import { ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function ContentRow({ title, movies, onMovieSelect, badge = null, size = 'md' }) {
  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-body font-semibold text-white text-base">{title}</h2>
          {badge && (
            <span
              className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full"
              style={{
                background: badge === 'gold'
                  ? 'rgba(250,204,21,0.15)'
                  : 'rgba(22,163,74,0.15)',
                color: badge === 'gold' ? '#facc15' : '#22c55e',
                border: `1px solid ${badge === 'gold' ? 'rgba(250,204,21,0.3)' : 'rgba(22,163,74,0.3)'}`,
              }}
            >
              {badge === 'gold' ? 'EXCLUSIVE' : 'NEW'}
            </span>
          )}
        </div>
        <button className="flex items-center gap-0.5 text-emerald-500 text-xs hover:text-yellow-400 transition-colors">
          See all <ChevronRight size={14} />
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="scroll-row px-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieSelect}
            size={size}
          />
        ))}
      </div>
    </section>
  );
}
