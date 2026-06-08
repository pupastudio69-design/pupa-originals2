import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Tv } from 'lucide-react';
import { TV_SHOWS } from '../data/movies';

export default function TVShowsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 pt-16 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">TV Shows</h1>
        <p className="text-gray-500 text-sm">Binge-worthy series</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {TV_SHOWS.map((show) => (
          <button
            key={show.id}
            onClick={() => navigate(`/movie/${show.id}`)}
            className="group text-left"
          >
            <div 
              className="relative rounded-xl overflow-hidden mb-2"
              style={{ aspectRatio: '16/9' }}
            >
              <img
                src={show.backdrop || show.poster}
                alt={show.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-500/80 text-white text-[9px] font-bold rounded backdrop-blur-sm">
                TV
              </span>

              {show.isNew && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-red-500/80 text-white text-[9px] font-bold rounded backdrop-blur-sm">
                  NEW
                </span>
              )}

              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                <Tv size={10} className="text-gray-300" />
                <span className="text-gray-300 text-[9px]">{show.episodeList?.length || show.episodes} EP</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="w-8 h-8 rounded-full bg-yellow-400/90 flex items-center justify-center">
                  <Play size={14} fill="black" className="text-black ml-0.5" />
                </div>
              </div>
            </div>

            <p className="text-white text-[11px] font-medium truncate">{show.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={9} className="text-yellow-400 fill-yellow-400" />
              <span className="text-gray-500 text-[10px]">{show.rating?.toFixed(1)}</span>
              <span className="text-gray-600 text-[10px]">·</span>
              <span className="text-gray-500 text-[10px]">{show.year}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}