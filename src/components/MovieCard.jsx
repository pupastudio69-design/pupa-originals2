import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

export default function MovieCard({ movie, size = 'md' }) {
  const navigate = useNavigate();
  const widths = { sm: 110, md: 140, lg: 180 };
  const w = widths[size];

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Handle genre as array or string
  const genreDisplay = Array.isArray(movie.genre) 
    ? movie.genre.slice(0, 2).join(', ') 
    : movie.genre;

  return (
    <div
      className="movie-card flex-shrink-0 cursor-pointer relative group rounded-xl overflow-hidden"
      style={{ width: w, aspectRatio: '2/3' }}
      onClick={handleClick}
    >
      {/* Poster */}
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450/0a0a0a/10b981?text=No+Poster';
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Pupa badge */}
      {movie.isPupaOriginal && (
        <div className="absolute top-2 left-2">
          <span className="text-[8px] font-mono tracking-wider text-yellow-400 bg-black/60 px-1.5 py-0.5 rounded">
            PUPA
          </span>
        </div>
      )}

      {/* Rating */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
        <Star size={9} className="text-yellow-400 fill-yellow-400" />
        <span className="text-yellow-400 text-[9px] font-mono">{movie.rating}</span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-[11px] font-body font-medium leading-tight line-clamp-2 mb-1">
          {movie.title}
        </p>
        <p className="text-gray-400 text-[9px] font-body">{genreDisplay} • {movie.year}</p>
      </div>

      {/* Hover play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-12 h-12 rounded-full bg-yellow-400/90 flex items-center justify-center shadow-lg">
          <Play size={18} className="fill-black text-black ml-0.5" />
        </div>
      </div>
    </div>
  );
}