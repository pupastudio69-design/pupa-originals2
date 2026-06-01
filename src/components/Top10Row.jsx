import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { TOP_10 } from '../data/movies';

export default function Top10Row({ onMovieSelect }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-body font-semibold text-white text-base">Top 10 This Week</h2>
          <span className="text-[9px] font-mono text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            🔥 HOT
          </span>
        </div>
        <button className="flex items-center gap-0.5 text-emerald-500 text-xs hover:text-yellow-400 transition-colors">
          See all <ChevronRight size={14} />
        </button>
      </div>

      <div className="scroll-row px-4">
        {TOP_10.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 relative cursor-pointer group"
            style={{ width: 120 }}
            onClick={() => onMovieSelect(movie)}
          >
            {/* Giant rank number */}
            <div
              className="absolute -left-2 bottom-8 z-10 font-display font-bold leading-none select-none"
              style={{
                fontSize: 72,
                color: 'transparent',
                WebkitTextStroke: '2px rgba(250,204,21,0.5)',
                lineHeight: 1,
              }}
            >
              {movie.rank}
            </div>

            {/* Poster */}
            <div className="relative ml-6 rounded-xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-[10px] font-body font-medium line-clamp-2 leading-tight">
                  {movie.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={8} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-[9px] font-mono">{movie.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
