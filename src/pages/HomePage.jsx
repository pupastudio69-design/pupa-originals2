import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Play, Info, Star, Clock, TrendingUp, Crown, ChevronRight, AlertTriangle } from 'lucide-react';
import {
  ALL_MOVIES, TRENDING, PUPA_ORIGINALS, NEW_RELEASES, AFRICAN_HITS, CATEGORIES
} from '../data/movies.js';

const auth = getAuth();
const db = getFirestore();

// Check subscription status
function checkSubscription() {
  const sub = localStorage.getItem('pupa_subscription');
  if (!sub) return { active: false, expired: true, reason: 'no_subscription' };

  try {
    const data = JSON.parse(sub);
    const expiry = new Date(data.expiryDate);
    const now = new Date();

    if (expiry > now) {
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return { active: true, expired: false, plan: data.plan, daysLeft };
    } else {
      localStorage.removeItem('pupa_subscription');
      return { active: false, expired: true, reason: 'expired' };
    }
  } catch {
    localStorage.removeItem('pupa_subscription');
    return { active: false, expired: true, reason: 'invalid' };
  }
}

function ContinueWatchingCard({ movie }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="flex-shrink-0 cursor-pointer relative group rounded-xl overflow-hidden"
      style={{ width: 160, aspectRatio: '16/9' }}
    >
      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className="h-full bg-emerald-500" style={{ width: `${movie.progress || 0}%` }} />
      </div>
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-[11px] font-medium truncate">{movie.title}</p>
        <p className="text-gray-400 text-[9px]">{movie.progress || 0}% watched</p>
      </div>
    </div>
  );
}

function MovieCard({ movie, size = 'normal' }) {
  const navigate = useNavigate();
  const isLarge = size === 'large';

  return (
    <button
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="flex-shrink-0 text-left group"
      style={{ width: isLarge ? 160 : 120 }}
    >
      <div className={`relative rounded-xl overflow-hidden mb-2 ${isLarge ? 'aspect-[2/3]' : 'aspect-[2/3]'}`}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=Pupa'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded-full px-1.5 py-0.5">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-[10px]">{movie.rating || '4.5'}</span>
        </div>
      </div>
      <h3 className="text-white text-xs font-medium truncate">{movie.title}</h3>
      <p className="text-gray-500 text-[10px]">{movie.year} · {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}</p>
    </button>
  );
}

function ContentRow({ title, movies, icon: Icon }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-emerald-400" />}
          <h2 className="font-semibold text-white text-sm">{title}</h2>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

function SubscriptionBanner({ subStatus }) {
  const navigate = useNavigate();

  if (!subStatus.active) return (
    <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-red-900/50 to-orange-900/20 border border-red-500/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-400/20 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">Subscription Required</p>
          <p className="text-gray-400 text-xs">Please subscribe to watch movies</p>
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

  if (subStatus.daysLeft <= 3) return (
    <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-yellow-900/50 to-orange-900/20 border border-yellow-500/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
          <Crown size={20} className="text-yellow-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">Subscription Expiring Soon</p>
          <p className="text-gray-400 text-xs">{subStatus.daysLeft} days left. Renew now to keep watching.</p>
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

  return (
    <div className="mx-4 mb-6 rounded-xl p-4 bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 border border-emerald-500/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
          <Crown size={20} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">{subStatus.plan === 'premium' ? 'Premium Active' : 'Basic Active'}</p>
          <p className="text-gray-400 text-xs">{subStatus.daysLeft} days remaining</p>
        </div>
      </div>
    </div>
  );
}

function FeaturedBanner() {
  const navigate = useNavigate();
  const featured = ALL_MOVIES[Math.floor(Math.random() * ALL_MOVIES.length)];

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <img
        src={featured.poster}
        alt={featured.title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1200/1a1a2e/ffffff?text=Pupa'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">FEATURED</span>
          <span className="text-gray-400 text-xs">{featured.year}</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-400 text-xs">{Array.isArray(featured.genre) ? featured.genre[0] : featured.genre}</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{featured.title}</h1>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 max-w-md">{featured.description}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/movie/${featured.id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
          >
            <Play size={18} fill="black" />
            Play Now
          </button>
          <button 
            onClick={() => navigate(`/movie/${featured.id}`)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors"
          >
            <Info size={18} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriesPreview() {
  const navigate = useNavigate();
  return (
    <section className="mb-6 px-4">
      <h2 className="font-semibold text-white text-sm mb-3">Browse Categories</h2>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.slice(0, 4).map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate('/explore')}
            className="relative h-20 rounded-xl overflow-hidden group"
          >
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{cat.name}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [subStatus, setSubStatus] = useState({ active: false });
  const navigate = useNavigate();

  // Check subscription on mount
  useEffect(() => {
    const status = checkSubscription();
    setSubStatus(status);

    // If no active subscription, redirect to welcome page
    if (!status.active) {
      navigate('/welcome');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setContinueWatching(userDoc.data().watchHistory || []);
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const popularMovies = [...TRENDING].sort((a, b) => (b.views || '').replace('M', '000000').replace('K', '000') - (a.views || '').replace('M', '000000').replace('K', '000')).slice(0, 10);
  const recentlyAdded = [...NEW_RELEASES, ...PUPA_ORIGINALS].slice(0, 10);

  // Show loading while checking subscription
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-white text-sm">Loading...</div>
      </div>
    );
  }

  // If no subscription, this won't render (redirected above)
  // But just in case:
  if (!subStatus.active) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Subscription Required</p>
          <button 
            onClick={() => navigate('/welcome')}
            className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <FeaturedBanner />

      <div className="pt-4">
        <SubscriptionBanner subStatus={subStatus} />

        {user && continueWatching.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="font-semibold text-white text-sm">Continue Watching</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {continueWatching.map(m => (
                <ContinueWatchingCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}

        <ContentRow title="Popular Movies" movies={popularMovies} icon={TrendingUp} />
        <ContentRow title="Recently Added" movies={recentlyAdded} icon={Clock} />
        <ContentRow title="Pupa Originals" movies={PUPA_ORIGINALS} icon={Star} />
        <ContentRow title="African Hits" movies={AFRICAN_HITS} icon={Star} />

        <CategoriesPreview />
      </div>
    </div>
  );
}[]