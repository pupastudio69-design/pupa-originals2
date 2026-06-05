import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, Clock, Star, TrendingUp } from 'lucide-react';
import { ALL_MOVIES as movies } from '../data/movies';

const CATEGORIES = [
  { id: 'all', name: 'All Movies', icon: Film },
  { id: 'nollywood', name: 'Nollywood Classics', icon: Star },
  { id: 'documentary', name: 'Documentaries', icon: Clock },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
];

const GENRES = ['All', 'Drama', 'Comedy', 'Action', 'Romance', 'Thriller', 'Documentary'];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const nollywoodMovies = movies.filter(m => m.genre === 'Drama' || m.genre === 'Comedy');
  const documentaryMovies = movies.filter(m => m.genre === 'Documentary');
  const trendingMovies = [...movies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);

  const getMoviesByCategory = () => {
    switch (selectedCategory) {
      case 'nollywood': return nollywoodMovies;
      case 'documentary': return documentaryMovies;
      case 'trending': return trendingMovies;
      default: return filteredMovies;
    }
  };

  const displayMovies = getMoviesByCategory();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16 pb-24">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search movies, documentaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre Filters */}
      {selectedCategory === 'all' && (
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="px-4 py-4">
        <h2 className="text-white font-semibold text-lg mb-4">
          {selectedCategory === 'all' ? 'All Movies' : 
           selectedCategory === 'nollywood' ? 'Nollywood Classics' :
           selectedCategory === 'documentary' ? 'Documentaries' : 'Trending Now'}
        </h2>

        {displayMovies.length === 0 ? (
          <div className="text-center py-12">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayMovies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="text-left group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=Pupa';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-medium">{movie.rating || '4.5'}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                <p className="text-gray-500 text-xs">{movie.year} · {movie.genre}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}