import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { TRENDING, PUPA_ORIGINALS } from '../data/movies';

const TRENDING_SEARCHES = ['Nollywood 2025', 'Queen of Benin', 'Afrobeats Rising', 'Lagos Thriller', 'African Epic'];

export default function SearchOverlay({ onClose, onMovieSelect }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.length > 1
    ? [...TRENDING, ...PUPA_ORIGINALS].filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(4,27,17,0.97)', backdropFilter: 'blur(24px)' }}
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 border-b border-white/5">
        <Search size={18} className="text-emerald-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies, series, genres..."
          className="flex-1 bg-transparent text-white text-base placeholder-gray-600 outline-none font-body"
        />
        <button onClick={onClose}>
          <X size={20} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {query.length === 0 ? (
          <>
            {/* Trending searches */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-emerald-400" />
                <p className="text-gray-400 text-xs font-body uppercase tracking-wider">Trending Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full glass text-gray-300 text-xs hover:border-emerald-700 transition-colors font-body"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gray-500" />
                <p className="text-gray-400 text-xs font-body uppercase tracking-wider">Recent</p>
              </div>
              {TRENDING.slice(0, 3).map(m => (
                <button
                  key={m.id}
                  className="w-full flex items-center gap-3 py-2.5 border-b border-white/5"
                  onClick={() => { onMovieSelect(m); onClose(); }}
                >
                  <img src={m.poster} alt={m.title} className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-white text-sm font-body font-medium">{m.title}</p>
                    <p className="text-gray-500 text-xs">{m.genre} • {m.year}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <p className="text-gray-500 text-xs mb-3 font-body">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Search size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 font-body">No results found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(m => (
                  <button
                    key={m.id}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                    onClick={() => { onMovieSelect(m); onClose(); }}
                  >
                    <img src={m.poster} alt={m.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-body font-medium">{m.title}</p>
                      <p className="text-gray-500 text-xs">{m.genre} • {m.year}</p>
                      <p className="text-yellow-400 text-[10px] font-mono mt-0.5">★ {m.rating}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
