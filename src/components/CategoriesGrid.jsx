import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/movies';

export default function CategoriesGrid() {
  return (
    <section className="mb-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-body font-semibold text-white text-base">Browse Categories</h2>
        <button className="flex items-center gap-0.5 text-emerald-500 text-xs hover:text-yellow-400 transition-colors">
          All <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="category-card relative cursor-pointer"
            style={{ aspectRatio: '16/9' }}
          >
            {/* Background image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay */}
            <div
              className="category-overlay absolute inset-0 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(4,27,17,0.75) 0%, rgba(0,0,0,0.5) 100%)',
              }}
            />

            {/* Emerald accent border */}
            <div
              className="absolute inset-0 rounded-xl transition-opacity duration-300"
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(22, 163, 74, 0.3)',
                opacity: 0,
              }}
            />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display font-semibold text-white text-sm tracking-wide">
                {cat.name}
              </p>
              <p className="font-mono text-emerald-400/70 text-[10px] mt-0.5">
                {cat.count} titles
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
