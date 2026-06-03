import React from 'react';
import { Clapperboard, Film, Heart, Laugh, Drama, Ghost, Music, Globe, Sparkles } from 'lucide-react';

// Accurate counts based on actual movies in movies.js
const CATEGORIES = [
  { id: 1, name: "Action", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", count: 4 },
  { id: 2, name: "Nollywood", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80", count: 9 },
  { id: 3, name: "Romance", image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400&q=80", count: 8 },
  { id: 4, name: "Drama", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80", count: 14 },
  { id: 5, name: "Documentary", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", count: 1 },
  { id: 6, name: "Animation", image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80", count: 0 },
  { id: 7, name: "Comedy", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80", count: 1 },
  { id: 8, name: "Thriller", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80", count: 2 },
];

export default function CategoriesGrid({ onCategoryClick }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onCategoryClick?.(cat)}
          className="relative rounded-xl overflow-hidden group cursor-pointer active:scale-95 transition-transform"
          style={{ aspectRatio: '16/10' }}
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-sm font-body font-semibold">{cat.name}</p>
            <p className="text-gray-400 text-[10px]">{cat.count} titles</p>
          </div>
        </div>
      ))}
    </div>
  );
}