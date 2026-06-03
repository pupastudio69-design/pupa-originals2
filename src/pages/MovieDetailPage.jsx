import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowLeft, Play, Plus, Check, Share2, Download, Star, Clock, Calendar, 
  Eye, ThumbsUp, MessageCircle, X, Gift, Crown
} from 'lucide-react';

export default function MovieDetailPage({ movie, onBack }) {
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (user && movie) {
      checkWatchlist();
      checkSubscription();
    }
  }, [user, movie]);

  const checkWatchlist = async () => {
    try {
      const watchlistRef = doc(db, 'watchlists', `${user.uid}_${movie.id}`);
      const snap = await getDoc(watchlistRef);
      setInWatchlist(snap.exists());
    } catch (e) {
      console.error('Error checking watchlist:', e);
    }
  };

  const checkSubscription = async () => {
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const snap = await getDoc(walletRef);
      if (snap.exists()) {
        const data = snap.data();
        setIsSubscribed(data.subscription && data.subscription.status === 'active');
      }
    } catch (e) {
      console.error('Error checking subscription:', e);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) return;
    try {
      const watchlistRef = doc(db, 'watchlists', `${user.uid}_${movie.id}`);
      if (inWatchlist) {
        await setDoc(watchlistRef, { deleted: true }, { merge: true });
        setInWatchlist(false);
      } else {
        await setDoc(watchlistRef, {
          userId: user.uid,
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster,
          addedAt: serverTimestamp()
        });
        setInWatchlist(true);
      }
    } catch (e) {
      console.error('Error toggling watchlist:', e);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      alert('Please sign in to download movies');
      return;
    }

    // Check if premium (no ads) for download feature
    if (!isSubscribed && movie.isPupa) {
      setShowDownloadModal(true);
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          saveDownload();
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const saveDownload = async () => {
    try {
      await addDoc(collection(db, 'downloads'), {
        userId: user.uid,
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster,
        videoUrl: movie.videoUrl,
        downloadedAt: serverTimestamp()
      });
    } catch (e) {
      console.error('Error saving download:', e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Watch ${movie.title} on Pupa Originals!`,
          url: window.location.href
        });
      } catch (e) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={movie.videoUrl}
          title={movie.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Movie Info */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Actions */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="text-green-400 font-semibold">{movie.rating}</span>
              <span>{movie.year}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{movie.duration}</span>
              {movie.isPupa && (
                <span className="px-2 py-0.5 bg-purple-600 rounded text-xs text-white">PUPA ORIGINAL</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={toggleWatchlist}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {inWatchlist ? <Check className="w-5 h-5 text-green-400" /> : <Plus className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Downloading... {downloadProgress}%
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Download for Offline
            </>
          )}
        </button>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>

        {/* Cast & Crew */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Cast & Crew</h3>
          <div className="flex flex-wrap gap-2">
            {movie.cast.map(actor => (
              <span key={actor} className="px-3 py-1.5 bg-white/5 rounded-lg text-gray-300 text-sm">
                {actor}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm">Director: <span className="text-white">{movie.director}</span></p>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2">
          {movie.genre.map(g => (
            <span key={g} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
              {g}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center">
            <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{(movie.views / 1000000).toFixed(1)}M</p>
            <p className="text-gray-500 text-xs">Views</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center">
            <ThumbsUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{movie.rating}</p>
            <p className="text-gray-500 text-xs">Rating</p>
          </div>
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center">
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-white font-bold text-sm">{movie.year}</p>
            <p className="text-gray-500 text-xs">Year</p>
          </div>
        </div>

        {/* Source Attribution */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs">
            Source: <span className="text-white">{movie.source}</span>
            {movie.source === 'archive.org' && ' (Internet Archive - Free Public Domain)'}
            {movie.source === 'ibakatv' && ' (IBAKA TV - Official Nollywood Channel)'}
          </p>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-sm w-full border border-white/10">
            <div className="text-center mb-4">
              <Crown className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-bold text-lg">Premium Required</h3>
              <p className="text-gray-400 text-sm mt-1">
                Downloading Pupa Originals requires a Premium subscription (₦6,000/month).
              </p>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => { setShowDownloadModal(false); /* navigate to wallet */ }}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                Upgrade to Premium
              </button>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Watch Online Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}