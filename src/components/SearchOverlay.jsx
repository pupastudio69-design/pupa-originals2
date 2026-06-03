import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, Trash2 } from 'lucide-react';
import { ALL_MOVIES } from '../data/movies.js';

const TRENDING_SEARCHES = ['Nollywood 2025', 'Queen of Benin', 'Afrobeats Rising', 'Lagos Thriller', 'African Epic', 'Action', 'Drama', 'Comedy'];

export default function SearchOverlay({ onClose, onMovieSelect }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const saved = localStorage.getItem('pupa_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('pupa_recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pupa_recent_searches');
  };

  const removeRecentSearch = (term) => {
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('pupa_recent_searches', JSON.stringify(updated));
  };

  const results = query.length > 1
    ? ALL_MOVIES.filter(m => {
        const q = query.toLowerCase();
        return (
          m.title?.toLowerCase().includes(q) ||
          m.genre?.some(g => g.toLowerCase().includes(q)) ||
          m.year?.toString().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.cast?.some(actor => actor.toLowerCase().includes(q)) ||
          m.director?.toLowerCase().includes(q)
        );
      })
    : [];

  const uniqueResults = results.filter((m, index, self) =>
    index === self.findIndex(t => t.id === m.id)
  );

  const handleMovieClick = (movie) => {
    saveRecentSearch(movie.title);
    onMovieSelect(movie);
    onClose();
  };

  const handleTrendingClick = (term) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(4,27,17,0.97)', backdropFilter: 'blur(24px)' }}
    >
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 border-b border-white/5">
        <Search size={18} className="text-emerald-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && query.trim()) {
              saveRecentSearch(query.trim());
            }
          }}
          placeholder="Search movies, series, genres, actors, directors..."
          className="flex-1 bg-transparent text-white text-base placeholder-gray-600 outline-none font-body"
        />
        {query && (
          <button onClick={() => setQuery('')} className="mr-1">
            <X size={18} className="text-gray-500 hover:text-white" />
          </button>
        )}
        <button onClick={onClose}>
          <X size={20} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {query.length === 0 ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-emerald-400" />
                <p className="text-gray-400 text-xs font-body uppercase tracking-wider">Trending Searches</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleTrendingClick(s)}
                    className="px-3 py-1.5 rounded-full glass text-gray-300 text-xs hover:border-emerald-700 hover:text-emerald-400 transition-colors font-body"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <p className="text-gray-400 text-xs font-body uppercase tracking-wider">Recent Searches</p>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-gray-600 text-[10px] hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map(term => (
                    <div
                      key={term}
                      className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                      <button
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-2 text-left flex-1"
                      >
                        <Clock size={12} className="text-gray-600" />
                        <span className="text-gray-300 text-sm font-body">{term}</span>
                      </button>
                      <button
                        onClick={() => removeRecentSearch(term)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                      >
                        <Trash2 size={12} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-yellow-400" />
                <p className="text-gray-400 text-xs font-body uppercase tracking-wider">Top Rated</p>
              </div>
              {ALL_MOVIES
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 5)
                .map(m => (
                  <button
                    key={m.id}
                    className="w-full flex items-center gap-3 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg px-2"
                    onClick={() => handleMovieClick(m)}
                  >
                    <img src={m.poster} alt={m.title} className="w-10 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="text-left flex-1">
                      <p className="text-white text-sm font-body font-medium">{m.title}</p>
                      <p className="text-gray-500 text-xs">{m.genre?.join(', ')} • {m.year}</p>
                    </div>
                    <span className="text-yellow-400 text-xs font-mono">★ {m.rating}</span>
                  </button>
                ))}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-body">
                {uniqueResults.length} result{uniqueResults.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {uniqueResults.length > 0 && (
                <button
                  onClick={() => saveRecentSearch(query)}
                  className="text-emerald-500 text-[10px] hover:text-emerald-400"
                >
                  Save search
                </button>
              )}
            </div>

            {uniqueResults.length === 0 ? (
              <div className="text-center py-12">
                <Search size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 font-body mb-1">No results found</p>
                <p className="text-gray-600 text-xs font-body">Try searching by title, genre, actor, or director</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uniqueResults.map(m => (
                  <button
                    key={m.id}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left group"
                    onClick={() => handleMovieClick(m)}
                  >
                    <img src={m.poster} alt={m.title} className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-body font-medium truncate">{m.title}</p>
                      <p className="text-gray-500 text-xs">{m.genre?.join(', ')} • {m.year}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-yellow-400 text-[10px] font-mono">★ {m.rating}</span>
                        {m.isPupaOriginal && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-mono">ORIGINAL</span>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 2l9 5-9 5V2z" fill="#10b981" />
                        </svg>
                      </div>
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