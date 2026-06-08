import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, Star, Play, X } from 'lucide-react';
import { ALL_MOVIES, TV_SHOWS, DOCUMENTARIES, ENTERTAINMENT } from '../data/movies';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState([]);

  const allContent = [...ALL_MOVIES, ...TV_SHOWS, ...DOCUMENTARIES, ...ENTERTAINMENT];

  useEffect(() => {
    if (query) {
      const filtered = allContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.genre?.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
        item.cast?.some(c => c.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 pt-16 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
            autoFocus
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => { setSearchQuery(''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {/* Results */}
      {query && (
        <div>
          <p className="text-gray-500 text-sm mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>

          <div className="grid grid-cols-3 gap-3">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(`/movie/${item.id}`)}
                className="group text-left"
              >
                <div 
                  className="relative rounded-xl overflow-hidden mb-2"
                  style={{ aspectRatio: item.type === 'tv' ? '16/9' : '2/3' }}
                >
                  <img
                    src={item.type === 'tv' ? (item.backdrop || item.poster) : item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-yellow-400/90 flex items-center justify-center">
                      <Play size={14} fill="black" className="text-black ml-0.5" />
                    </div>
                  </div>
                </div>

                <p className="text-white text-[11px] font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={9} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-500 text-[10px]">{item.rating?.toFixed(1)}</span>
                  <span className="text-gray-600 text-[10px]">·</span>
                  <span className="text-gray-500 text-[10px]">{item.year}</span>
                </div>
              </button>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No results found</p>
              <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}