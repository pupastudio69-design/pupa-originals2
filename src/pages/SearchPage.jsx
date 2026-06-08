import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft } from 'lucide-react';

// Safe import
let moviesData;
try {
  moviesData = require('../data/movies.js');
} catch (e) {
  moviesData = {};
}

const { ALL_MOVIES = [], TV_SHOWS = [] } = moviesData;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const allContent = [...ALL_MOVIES, ...TV_SHOWS];
  const results = query.length > 1
    ? allContent.filter(m => m.title?.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 pt-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-white font-bold">Search Results</h1>
      </div>
      <p className="text-gray-500 text-sm mb-4">{results.length} results for "{query}"</p>
      <div className="grid grid-cols-3 gap-3">
        {results.map(item => (
          <button key={item.id} onClick={() => navigate(`/movie/${item.id}`)} className="text-left">
            <div className="aspect-[2/3] rounded-xl overflow-hidden mb-1">
              <img src={item.poster || 'https://via.placeholder.com/300x450'} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-white text-[10px] truncate">{item.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}