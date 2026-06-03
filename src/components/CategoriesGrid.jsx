import React from 'react';
import { Clapperboard, Film, Heart, Laugh, Drama, Ghost, Music, Globe, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'action', name: 'Action', icon: Clapperboard, color: '#ef4444', count: 148 },
  { id: 'nollywood', name: 'Nollywood', icon: Film, color: '#16a34a', count: 324 },
  { id: 'romance', name: 'Romance', icon: Heart, color: '#ec4899', count: 210 },
  { id: 'drama', name: 'Drama', icon: Drama, color: '#8b5cf6', count: 276 },
  { id: 'comedy', name: 'Comedy', icon: Laugh, color: '#f59e0b', count: 192 },
  { id: 'horror', name: 'Horror', icon: Ghost, color: '#dc2626', count: 89 },
  { id: 'musical', name: 'Musical', icon: Music, color: '#06b6d4', count: 67 },
  { id: 'documentary', name: 'Documentary', icon: Globe, color: '#10b981', count: 155 },
];

export default function CategoriesGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <div
            key={cat.id}
            className="relative rounded-xl p-3 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10"
              style={{ background: cat.color, transform: 'translate(40%, -40%)' }}
            />
            <Icon size={20} style={{ color: cat.color }} className="mx-auto mb-1.5" />
            <p className="text-white text-[10px] font-body font-medium">{cat.name}</p>
          </div>
        );
      })}
    </div>
  );
}