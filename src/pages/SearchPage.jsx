import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { ALL_MOVIES } from '../data/movies';

const GENRES = ['Action', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Fantasy'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019'];
const RATINGS = ['4.5+', '4.0+', '3.5+', '3.0+'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const filteredMovies = useMemo(() => {
    return ALL_MOVIES.filter((movie) => {
      const matchesQuery = searchQuery === '' || 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === null || 
        (Array.isArray(movie.genre) ? movie.genre.includes(selectedGenre) : movie.genre === selectedGenre);
      
      const matchesYear = selectedYear === null || movie.year.toString() === selectedYear;
      
      const movieRating = parseFloat(movie.rating || '4.5');
      const matchesRating = selectedRating === null || 
        parseFloat(selectedRating) <= movieRating;

      return matchesQuery && matchesGenre && matchesYear && matchesRating;
    });
  }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedRating(null);
    setSearchQuery('');
  };

  const activeFilterCount = [selectedGenre, selectedYear, selectedRating].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                : 'bg-white/10 border-white/20 text-gray-400'
            }`}
          >
            <Filter size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 text-xs font-bold bg-yellow-400 text-black rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 pb-3 border-t border-white/10 pt-3">
            {/* Genre Filter */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Genre</p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedGenre === genre
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Year</p>
              <div className="flex flex-wrap gap-2">
                {YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedYear === year
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Rating</p>
              <div className="flex flex-wrap gap-2">
                {RATINGS.map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedRating === rating
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    ⭐ {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4">
        <p className="text-sm text-gray-400 mb-4">
          {filteredMovies.length} result{filteredMovies.length !== 1 ? 's' : ''}
        </p>

        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search size={40} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No movies found</p>
            <p className="text-gray-600 text-xs">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMovies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="text-left group"
              >
                <div className="relative rounded-lg overflow-hidden mb-2 aspect-[2/3]">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" fill="white" font-size="16" text-anchor="middle" dy=".3em">Pupa</text></svg>';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-1 right-1 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white text-[10px] font-medium">{movie.rating || '4.5'}</span>
                  </div>
                </div>
                <h3 className="text-white text-xs font-medium truncate group-hover:text-yellow-400 transition-colors">{movie.title}</h3>
                <p className="text-gray-500 text-[10px]">{movie.year}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
