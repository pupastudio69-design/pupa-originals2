import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  Play, Star, Clock, TrendingUp, ChevronRight, Search, Bell,
  Flame, Award, Heart
} from 'lucide-react';
import {
  ALL_MOVIES, TRENDING, PUPA_ORIGINALS, NEW_RELEASES, 
  TOP_RATED, COMMUNITY_PICKS
} from '../data/movies';

const auth = getAuth();
const db = getFirestore();

// SVG fallback for broken images
const FALLBACK_POSTER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" fill="white" font-size="16" text-anchor="middle" dy=".3em">Pupa</text></svg>';

const FALLBACK_WIDE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" fill="white" font-size="24" text-anchor="middle" dy=".3em">Pupa Originals</text></svg>';

function HeroBanner() {
  const navigate = useNavigate();
  const featured = ALL_MOVIES[0];

  return (
    <div className="relative h-[65vh] w-full overflow-hidden">
      <img
        src={featured.poster}
        alt={featured.title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = FALLBACK_WIDE; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/80 to-transparent" />
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white tracking-tight">PUPA</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/search')}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Search size={18} className="text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center relative">
            <Bell size={18} className="text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 text-[10px] font-bold">PUPA ORIGINAL</span>
          <span className="text-gray-300 text-xs">{featured.year}</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-300 text-xs">{featured.genre?.[0] || 'Drama'}</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-300 text-xs flex items-center gap-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            {featured.rating || '4.5'}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{featured.title}</h2>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 max-w-sm">{featured.description}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/watch/${featured.id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            <Play size={18} fill="black" />
            Watch Now
          </button>
          <button 
            onClick={() => navigate(`/movie/${featured.id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentRow({ title, movies, icon: Icon, seeAll = true }) {
  const navigate = useNavigate();
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-yellow-400" />}
          <h2 className="font-semibold text-white text-sm">{title}</h2>
        </div>
        {seeAll && (
          <button 
            onClick={() => navigate('/tv-shows')}
            className="flex items-center gap-1 text-gray-400 text-xs hover:text-white transition-colors"
          >
            See All <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="flex-shrink-0 text-left group"
      style={{ width: 120 }}
    >
      <div className="relative rounded-xl overflow-hidden mb-2 aspect-[2/3]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = FALLBACK_POSTER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-[10px] font-medium">{movie.rating || '4.5'}</span>
        </div>
        {movie.isNew && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] font-bold">
            NEW
          </div>
        )}
      </div>
      <h3 className="text-white text-xs font-medium truncate">{movie.title}</h3>
      <p className="text-gray-500 text-[10px]">{movie.year} · {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}</p>
    </button>
  );
}

function ContinueWatching() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('pupa_watch_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 5));
      } catch {}
    }
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-semibold text-white text-sm">Continue Watching</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/watch/${item.id}`)}
            className="flex-shrink-0 cursor-pointer relative group rounded-xl overflow-hidden"
            style={{ width: 160, aspectRatio: '16/9' }}
          >
            <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-emerald-500" style={{ width: `${item.progress || 0}%` }} />
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-[11px] font-medium truncate">{item.title}</p>
              <p className="text-gray-400 text-[9px]">{item.progress || 0}% watched</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play size={18} className="text-white fill-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscriptionBanner() {
  const navigate = useNavigate();
  const { isSubscribed, isTrial, isPremium, daysLeft } = useSubscription();

  if (isPremium()) return null;

  if (!isSubscribed()) {
    return (
      <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <Award size={20} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Unlock Premium</p>
            <p className="text-gray-400 text-xs">Subscribe for unlimited access</p>
          </div>
          <button 
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold"
          >
            Subscribe
          </button>
        </div>
      </div>
    );
  }

  if (isTrial()) {
    return (
      <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
            <Clock size={20} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Free Trial Active</p>
            <p className="text-gray-400 text-xs">{daysLeft()} hours left. Subscribe to keep watching.</p>
          </div>
          <button 
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  if (daysLeft() <= 3) {
    return (
      <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <Clock size={20} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">Expiring Soon</p>
            <p className="text-gray-400 text-xs">{daysLeft()} days left. Renew now.</p>
          </div>
          <button 
            onClick={() => navigate('/welcome')}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold"
          >
            Renew
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isSubscribed, isPremium } = useSubscription();

  // Redirect to welcome if not subscribed
  useEffect(() => {
    if (!isSubscribed()) {
      navigate('/welcome');
    }
  }, [isSubscribed, navigate]);

  if (!isSubscribed()) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <HeroBanner />

      <div className="pt-4">
        <SubscriptionBanner />
        <ContinueWatching />
        
        {/* Premium: All content. Basic: Limited library */}
        <ContentRow title="Trending Now" movies={TRENDING.slice(0, isPremium() ? 12 : 4)} icon={Flame} />
        
        <ContentRow title="Popular This Week" movies={ALL_MOVIES.slice(0, isPremium() ? 12 : 4)} icon={TrendingUp} />
        
        {/* Premium: Immediate access. Basic: Delayed (older movies only) */}
        <ContentRow 
          title={isPremium() ? "New Releases" : "Recently Added"} 
          movies={isPremium() ? NEW_RELEASES.slice(0, 12) : ALL_MOVIES.slice(8, 12)} 
          icon={Clock} 
        />
        
        {/* Pupa Originals — Premium only */}
        {isPremium() && (
          <ContentRow title="Pupa Originals" movies={PUPA_ORIGINALS.slice(0, 8)} icon={Award} />
        )}
        
        <ContentRow title="Top Rated" movies={TOP_RATED.slice(0, isPremium() ? 12 : 6)} icon={Star} />
        
        {/* Community Picks — Premium only */}
        {isPremium() && (
          <ContentRow title="Community Picks" movies={COMMUNITY_PICKS.slice(0, 8)} icon={Heart} />
        )}

        {/* Basic plan upgrade prompt */}
        {!isPremium() && (
          <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Award size={20} className="text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">Upgrade to Premium</p>
                <p className="text-gray-400 text-xs">Unlock 4K, unlimited downloads, and exclusive content</p>
              </div>
              <button 
                onClick={() => navigate('/welcome')}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}