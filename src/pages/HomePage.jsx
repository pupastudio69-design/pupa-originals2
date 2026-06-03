import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import CategoriesGrid from '../components/CategoriesGrid';
import Top10Row from '../components/Top10Row';
import {
  TRENDING, PUPA_ORIGINALS, NEW_RELEASES, AFRICAN_HITS
} from '../data/movies.js';

const auth = getAuth();
const db = getFirestore();

function ContinueWatchingCard({ movie }) {
  return (
    <div
      className="flex-shrink-0 cursor-pointer relative group rounded-xl overflow-hidden"
      style={{ width: 160, aspectRatio: '16/9' }}
    >
      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full"
          style={{
            width: `${movie.progress || 0}%`,
            background: 'linear-gradient(90deg, #16a34a, #facc15)',
          }}
        />
      </div>

      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-[11px] font-body font-medium line-clamp-1">{movie.title}</p>
        <p className="text-gray-400 text-[9px]">{movie.progress || 0}% watched</p>
      </div>

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

export default function HomePage({ onCategoriesOpen }) {
  const [continueWatching, setContinueWatching] = useState([]);
  const [loadingContinue, setLoadingContinue] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const history = data.watchHistory || [];
            setContinueWatching(history);
          } else {
            setContinueWatching([]);
          }
        } catch (err) {
          console.error('Error loading watch history:', err);
          setContinueWatching([]);
        }
      } else {
        setContinueWatching([]);
      }
      setLoadingContinue(false);
    });
    return () => unsubscribe();
  }, []);

  const recentlyAdded = [...TRENDING, ...NEW_RELEASES]
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 10);

  const currentYear = new Date().getFullYear();
  const comingSoon = [...PUPA_ORIGINALS, ...AFRICAN_HITS]
    .filter(m => m.year > currentYear || m.comingSoon)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-pupa-bg pb-24">
      <HeroBanner />

      {user && continueWatching.length > 0 && (
        <section className="mb-8 mt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-body font-semibold text-white text-base">Continue Watching</h2>
            <button className="text-emerald-500 text-xs hover:text-yellow-400 transition-colors">See all</button>
          </div>
          <div className="scroll-row px-4">
            {continueWatching.map(m => (
              <ContinueWatchingCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}

      {!user && !loadingContinue && (
        <section className="mb-8 mt-4 mx-4">
          <div className="rounded-xl p-4 bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Sign in to continue watching</p>
              <p className="text-gray-400 text-xs">Your watch progress will be saved across devices</p>
            </div>
          </div>
        </section>
      )}

      <ContentRow title="Trending Now" movies={TRENDING} />
      <ContentRow title="Recently Added" movies={recentlyAdded} badge="new" />
      <ContentRow title="Pupa Originals" movies={PUPA_ORIGINALS} badge="gold" size="lg" />
      <ContentRow title="New Releases" movies={NEW_RELEASES} badge="new" />

      {/* Categories Section */}
      <section className="mb-8 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-body font-semibold text-white text-base">Categories</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onCategoriesOpen();
            }}
            className="text-emerald-500 text-xs hover:text-yellow-400 transition-colors px-2 py-1"
          >
            See all
          </button>
        </div>
        <CategoriesGrid />
      </section>

      <ContentRow title="African Hits" movies={AFRICAN_HITS} />

      {comingSoon.length > 0 && (
        <ContentRow title="Coming Soon" movies={comingSoon} badge="soon" />
      )}

      <Top10Row />

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

      <ContentRow title="Recommended For You" movies={[...TRENDING].reverse()} />
    </div>
  );
}