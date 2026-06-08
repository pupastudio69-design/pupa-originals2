import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Play } from 'lucide-react';
import { CATEGORIES, getContentByCategory } from '../data/movies';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const category = CATEGORIES.find(c => c.id === id);
  const content = getContentByCategory(id);

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24 pt-16 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{category?.name || 'Category'}</h1>
          <p className="text-gray-500 text-sm">{content.length} titles</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {content.map((item) => (
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
              {item.isNew && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">NEW</span>
              )}
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

      {content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No content in this category yet</p>
        </div>
      )}
    </div>
  );
}