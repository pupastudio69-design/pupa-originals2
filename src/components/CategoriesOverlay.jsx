import React from 'react';
import { X, Film, Heart, Laugh, Drama, Ghost, Music, Globe, Clapperboard, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'action', name: 'Action', icon: Clapperboard, color: '#ef4444', count: 148 },
  { id: 'nollywood', name: 'Nollywood', icon: Film, color: '#16a34a', count: 324 },
  { id: 'romance', name: 'Romance', icon: Heart, color: '#ec4899', count: 210 },
  { id: 'drama', name: 'Drama', icon: Drama, color: '#8b5cf6', count: 276 },
  { id: 'comedy', name: 'Comedy', icon: Laugh, color: '#f59e0b', count: 192 },
  { id: 'horror', name: 'Horror', icon: Ghost, color: '#dc2626', count: 89 },
  { id: 'musical', name: 'Musical', icon: Music, color: '#06b6d4', count: 67 },
  { id: 'documentary', name: 'Documentary', icon: Globe, color: '#10b981', count: 155 },
  { id: 'premium', name: 'Pupa Originals', icon: Sparkles, color: '#facc15', count: 45 },
];

export default function CategoriesOverlay({ onClose, onCategorySelect }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(4,27,17,0.97)', backdropFilter: 'blur(24px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Browse Categories</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategorySelect?.(cat);
                  onClose();
                }}
                className="relative rounded-xl p-4 text-left overflow-hidden group transition-transform active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                  style={{ background: cat.color, transform: 'translate(30%, -30%)' }}
                />
                <Icon size={24} style={{ color: cat.color }} className="mb-3" />
                <p className="text-white text-sm font-body font-medium">{cat.name}</p>
                <p className="text-gray-500 text-xs">{cat.count} titles</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}