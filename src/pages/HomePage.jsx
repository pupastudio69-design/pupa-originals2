import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import CategoriesGrid from '../components/CategoriesGrid';
import Top10Row from '../components/Top10Row';
import {
  TRENDING, PUPA_ORIGINALS, NEW_RELEASES, AFRICAN_HITS
} from '../data/movies';

// Continue watching mock
const CONTINUE_WATCHING = [
  {
    id: 101, title: 'Blood of the Sahara', genre: 'Epic', year: 2025,
    poster: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80',
    rating: '9.1', isPupa: true, progress: 65,
  },
  {
    id: 102, title: 'Afrobeats Rising', genre: 'Documentary', year: 2025,
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    rating: '9.5', isPupa: true, progress: 30,
  },
  {
    id: 103, title: 'Lagos After Dark', genre: 'Thriller', year: 2025,
    poster: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80',
    rating: '8.7', isPupa: true, progress: 82,
  },
];

function ContinueWatchingCard({ movie, onClick }) {
  return (
    <div
      className="flex-shrink-0 cursor-pointer relative group rounded-xl overflow-hidden"
      style={{ width: 160, aspectRatio: '16/9' }}
      onClick={() => onClick(movie)}
    >
      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full"
          style={{
            width: `${movie.progress}%`,
            background: 'linear-gradient(90deg, #16a34a, #facc15)',
          }}
        />
      </div>

      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-[11px] font-body font-medium line-clamp-1">{movie.title}</p>
        <p className="text-gray-400 text-[9px]">{movie.progress}% watched</p>
      </div>

      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-yellow-400/90 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="black" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onMovieSelect }) {
  return (
    <div className="min-h-screen bg-pupa-bg pb-24">
      {/* Hero */}
      <HeroBanner onMovieSelect={onMovieSelect} />

      {/* Continue Watching */}
      <section className="mb-8 mt-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-body font-semibold text-white text-base">Continue Watching</h2>
          <button className="text-emerald-500 text-xs hover:text-yellow-400 transition-colors">See all</button>
        </div>
        <div className="scroll-row px-4">
          {CONTINUE_WATCHING.map(m => (
            <ContinueWatchingCard key={m.id} movie={m} onClick={onMovieSelect} />
          ))}
        </div>
      </section>

      <ContentRow title="Trending Now" movies={TRENDING} onMovieSelect={onMovieSelect} />
      <ContentRow title="Pupa Originals" movies={PUPA_ORIGINALS} onMovieSelect={onMovieSelect} badge="gold" size="lg" />
      <ContentRow title="New Releases" movies={NEW_RELEASES} onMovieSelect={onMovieSelect} badge="new" />
      <CategoriesGrid />
      <ContentRow title="African Hits" movies={AFRICAN_HITS} onMovieSelect={onMovieSelect} />
      <Top10Row onMovieSelect={onMovieSelect} />

      {/* Premium Early Access banner */}
      <div className="mx-4 mb-8 rounded-2xl p-5 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #064e2a 0%, #0d3b23 60%, #041b11 100%)',
        border: '1px solid rgba(250,204,21,0.25)',
      }}>
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-yellow-500/5" />
        <p className="text-[10px] font-mono text-yellow-400 tracking-widest uppercase mb-2">Premium Early Access</p>
        <h3 className="font-display font-semibold text-white text-xl mb-2">
          Watch before everyone else
        </h3>
        <p className="text-gray-400 text-xs font-body mb-4 leading-relaxed">
          Get exclusive access to new Pupa Originals up to 2 weeks before general release.
        </p>
        <button className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold">
          Upgrade to Premium
        </button>
      </div>

      <ContentRow title="Recommended For You" movies={[...TRENDING].reverse()} onMovieSelect={onMovieSelect} />
    </div>
  );
}
