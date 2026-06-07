import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Tv, Film, BookOpen, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'tv-shows', label: 'TV Shows', icon: Tv },
  { id: 'documentaries', label: 'Documentaries', icon: BookOpen },
  { id: 'entertainment', label: 'Entertainment', icon: Sparkles },
];

const CONTENT_TYPES = {
  movies: [
    { id: 'm1', title: 'Movie 1', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+1', year: '2024', genre: 'Drama', rating: 4.5 },
    { id: 'm2', title: 'Movie 2', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+2', year: '2024', genre: 'Action', rating: 4.2 },
    { id: 'm3', title: 'Movie 3', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+3', year: '2024', genre: 'Comedy', rating: 4.0 },
    { id: 'm4', title: 'Movie 4', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+4', year: '2024', genre: 'Thriller', rating: 4.7 },
    { id: 'm5', title: 'Movie 5', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+5', year: '2024', genre: 'Drama', rating: 4.3 },
    { id: 'm6', title: 'Movie 6', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Movie+6', year: '2024', genre: 'Romance', rating: 4.1 },
  ],
  'tv-shows': [
    { id: 's1', title: 'Show 1', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Show+1', year: '2024', genre: 'Drama', rating: 4.5, episodes: 12 },
    { id: 's2', title: 'Show 2', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Show+2', year: '2024', genre: 'Comedy', rating: 4.2, episodes: 8 },
    { id: 's3', title: 'Show 3', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Show+3', year: '2024', genre: 'Thriller', rating: 4.7, episodes: 10 },
    { id: 's4', title: 'Show 4', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Show+4', year: '2024', genre: 'Action', rating: 4.0, episodes: 15 },
  ],
  documentaries: [
    { id: 'd1', title: 'Documentary 1', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Doc+1', year: '2024', genre: 'Documentary', rating: 4.8 },
    { id: 'd2', title: 'Documentary 2', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Doc+2', year: '2024', genre: 'Documentary', rating: 4.5 },
    { id: 'd3', title: 'Documentary 3', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Doc+3', year: '2024', genre: 'Documentary', rating: 4.3 },
  ],
  entertainment: [
    { id: 'e1', title: 'Entertainment 1', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Ent+1', year: '2024', genre: 'Entertainment', rating: 4.2 },
    { id: 'e2', title: 'Entertainment 2', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Ent+2', year: '2024', genre: 'Entertainment', rating: 4.0 },
    { id: 'e3', title: 'Entertainment 3', poster: 'https://placehold.co/300x450/1a1a2e/666666?text=Ent+3', year: '2024', genre: 'Entertainment', rating: 4.5 },
  ]
};

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

      {/* Content Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredContent.map((item) => (
            <button
              key={item.id}
              onClick={() => item.youtubeId ? navigate(`/watch/${item.id}`) : navigate(`/movie/${item.id}`)}
              className="text-left group"
            >
              <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3]">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                  <span className="text-yellow-400 text-[10px]">★</span>
                  <span className="text-white text-[10px] font-medium">{item.rating}</span>
                </div>

                {/* Episodes Badge for Shows */}
                {item.episodes && (
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[9px] font-bold">
                    {item.episodes} EP
                  </div>
                )}
              </div>
              <h3 className="text-white text-xs font-medium truncate">{item.title}</h3>
              <p className="text-gray-500 text-[10px]">{item.year} · {item.genre}</p>
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