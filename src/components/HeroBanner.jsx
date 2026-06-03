import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_MOVIES } from '../data/movies';

export default function HeroBanner({ onMovieSelect }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const goTo = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goTo((current + 1) % HERO_MOVIES.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const movie = HERO_MOVIES[current];

  // Helper: handle genre as string or array
  const getGenres = (genre) => {
    if (Array.isArray(genre)) return genre;
    if (typeof genre === 'string') return [genre];
    return [];
  };

  const genres = getGenres(movie.genre);

  return (
    <div className="relative w-full" style={{ height: '85vh', minHeight: 520 }}>
      {/* Backdrop images */}
      {HERO_MOVIES.map((m, i) => (
        <div
          key={m.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={m.backdrop}
            alt={m.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041b11] via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#041b11]" />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end px-5 pb-16"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateX(-10px)' : 'translateX(0)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Pupa Badge */}
        {movie.isPupa && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <span className="text-yellow-400 text-[10px] font-mono font-medium tracking-widest uppercase">
                Pupa Original
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-semibold leading-none mb-2"
          style={{ fontSize: 'clamp(32px, 8vw, 56px)' }}
        >
          {movie.title}
        </h1>

        {/* Tagline */}
        <p className="font-body text-sm text-emerald-300/80 italic mb-3 font-light">
          {movie.tagline}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-xs font-mono font-medium">{movie.rating}</span>
          </div>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-400 text-xs">{movie.year}</span>
          <span className="text-gray-500 text-xs">•</span>
          <span className="text-gray-400 text-xs">{movie.duration}</span>
          {genres.slice(0, 2).map(g => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-800 text-emerald-400"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="font-body text-gray-300 text-sm leading-relaxed mb-6 max-w-md line-clamp-2">
          {movie.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onMovieSelect(movie)}
            className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          >
            <Play size={16} className="fill-black" />
            Watch Now
          </button>
          <button
            onClick={() => onMovieSelect(movie)}
            className="btn-emerald flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white"
          >
            <Info size={15} />
            Details
          </button>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-5 flex items-center gap-2">
        {HERO_MOVIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 4,
              background: i === current
                ? 'linear-gradient(90deg, #facc15, #16a34a)'
                : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Nav arrows (desktop) */}
      <button
        onClick={() => goTo((current - 1 + HERO_MOVIES.length) % HERO_MOVIES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hidden md:flex items-center justify-center hover:bg-emerald-900/40"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo((current + 1) % HERO_MOVIES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass hidden md:flex items-center justify-center hover:bg-emerald-900/40"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}