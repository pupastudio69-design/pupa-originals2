import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Tv, Film, BookOpen, Sparkles } from 'lucide-react';
import { TV_SHOWS, ALL_MOVIES, DOCUMENTARIES, ENTERTAINMENT } from '../data/movies';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'tv-shows', label: 'TV Shows', icon: Tv },
  { id: 'documentaries', label: 'Documentaries', icon: BookOpen },
  { id: 'entertainment', label: 'Entertainment', icon: Sparkles },
];

const CONTENT_TYPES = {
  movies: ALL_MOVIES.slice(0, 8),
  'tv-shows': TV_SHOWS,
  documentaries: DOCUMENTARIES,
  entertainment: ENTERTAINMENT
};

const FALLBACK_WIDE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" fill="white" font-size="24" text-anchor="middle" dy=".3em">Pupa Originals</text></svg>';

export default function TVShowsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getContent = () => {
    if (activeCategory === 'all') {
      return Object.values(CONTENT_TYPES).flat();
    }
    return CONTENT_TYPES[activeCategory] || [];
  };

  const filteredContent = getContent().filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 pt-4">
      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="text-xl font-bold text-white mb-4">TV & Shows</h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search movies, shows, docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-400/50"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid - 3 columns with 16:9 cards */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2">
          {filteredContent.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/movie/${item.id}`)}
              className="text-left group"
            >
              <div className="relative rounded-xl overflow-hidden mb-1.5 aspect-video">
                <img
                  src={item.backdrop || item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = FALLBACK_WIDE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/50 backdrop-blur-sm rounded-full px-1 py-0.5">
                  <span className="text-yellow-400 text-[8px]">★</span>
                  <span className="text-white text-[8px] font-medium">{item.rating?.toFixed(1) || '4.5'}</span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-1.5 left-1.5 px-1 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-[7px] font-bold">
                  {item.type === 'tv' ? 'TV' : item.type === 'movie' ? 'MOVIE' : item.type?.toUpperCase() || 'VIDEO'}
                </div>

                {/* Episodes Badge for TV Shows */}
                {item.type === 'tv' && (
                  <div className="absolute bottom-1.5 left-1.5 px-1 py-0.5 rounded bg-emerald-500/80 text-white text-[7px] font-bold">
                    {item.totalEpisodes || item.episodes?.length || 12} EP
                  </div>
                )}

                {/* Play icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M3 2l9 5-9 5V2z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-white text-[10px] font-medium truncate leading-tight">{item.title}</h3>
              <p className="text-gray-500 text-[8px] mt-0.5">{item.year} · {Array.isArray(item.genre) ? item.genre[0] : item.genre}</p>
            </button>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <Filter size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No content found</p>
            <p className="text-gray-600 text-xs mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}