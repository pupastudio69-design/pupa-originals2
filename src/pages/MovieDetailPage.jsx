
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Play, Share2, Download, Bookmark, Heart, 
  MessageCircle, Send, Gift, X, Star, Clock, Calendar 
} from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, query, where, 
  onSnapshot, orderBy, serverTimestamp, doc, getDoc 
} from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

// YouTube Embed Player
function VideoPlayer({ videoUrl, title, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-black/80">
        <h3 className="text-white text-sm font-medium truncate">{title}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// Gift Modal
function GiftModal({ onClose, movie }) {
  const [amount, setAmount] = useState(800);
  const [sent, setSent] = useState(false);

  const gifts = [
    { name: 'Bronze', amount: 800, icon: '🥉' },
    { name: 'Silver', amount: 1500, icon: '🥈' },
    { name: 'Gold', amount: 3000, icon: '🥇' },
    { name: 'Platinum', amount: 5000, icon: '💎' },
    { name: 'Royal', amount: 10000, icon: '👑' },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 flex items-end justify-center" onClick={onClose}>
      <div className="w-full max-w-md bg-[#041b11] rounded-t-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Send a Gift</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-emerald-400 font-medium">Gift sent successfully!</p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">Support the creators of "{movie.title}"</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {gifts.map((gift) => (
                <button
                  key={gift.name}
                  onClick={() => setAmount(gift.amount)}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    amount === gift.amount 
                      ? 'bg-emerald-500/20 border border-emerald-500/40' 
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="text-2xl mb-1">{gift.icon}</div>
                  <p className="text-white text-xs font-medium">{gift.name}</p>
                  <p className="text-emerald-400 text-[10px]">₦{gift.amount}</p>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setSent(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium"
            >
              Send ₦{amount} Gift
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Comments Section
function CommentsSection({ movieId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!movieId) return;

    const q = query(
      collection(db, 'movies', String(movieId), 'comments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(fetched);
    });

    return () => unsubscribe();
  }, [movieId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await addDoc(collection(db, 'movies', String(movieId), 'comments'), {
        text: newComment.trim(),
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <MessageCircle size={18} />
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </form>
      ) : (
        <p className="text-gray-500 text-sm mb-4">Sign in to comment</p>
      )}

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-4">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-[10px] font-bold">
                  {(comment.userName || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-xs font-medium">{comment.userName || 'Anonymous'}</span>
              <span className="text-gray-600 text-[10px]">
                {comment.createdAt?.toDate?.() ? 
                  new Date(comment.createdAt.toDate()).toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieDetailPage({ movie, onBack }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!movie) return null;

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Watch ${movie.title} on Pupa Originals!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (movie.videoType === 'youtube') {
      alert('Download not available for YouTube videos. Use the Watch Now button to stream.');
      return;
    }
    // For direct MP4 files
    const a = document.createElement('a');
    a.href = movie.videoUrl;
    a.download = `${movie.title}.mp4`;
    a.click();
  };

  const getGenres = (genre) => {
    if (Array.isArray(genre)) return genre;
    if (typeof genre === 'string') return [genre];
    return [];
  };

  const genres = getGenres(movie.genre);

  return (
    <div className="min-h-screen bg-pupa-bg pb-24">
      {/* Video Player Overlay */}
      {showVideo && (
        <VideoPlayer 
          videoUrl={movie.videoUrl} 
          title={movie.title}
          onClose={() => setShowVideo(false)}
        />
      )}

      {/* Gift Modal */}
      {showGift && <GiftModal onClose={() => setShowGift(false)} movie={movie} />}

      {/* Backdrop Image */}
      <div className="relative h-72">
        <img 
          src={movie.backdrop || movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041b11] via-[#041b11]/60 to-transparent" />

        {/* Back button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-16 relative z-10">
        {/* Poster & Title */}
        <div className="flex gap-4 mb-4">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-28 h-40 rounded-xl object-cover shadow-lg"
            style={{ border: '2px solid rgba(22,163,74,0.3)' }}
          />
          <div className="flex-1 pt-16">
            <h1 className="text-white text-xl font-display font-bold mb-1">{movie.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-400 flex items-center gap-1">
                <Star size={14} className="fill-yellow-400" />
                {movie.rating}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">{movie.year}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                {movie.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {genres.map((g) => (
            <span 
              key={g} 
              className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs"
            >
              {g}
            </span>
          ))}
          {movie.isPupa && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
              PUPA ORIGINAL
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setShowVideo(true)}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
          >
            <Play size={18} className="fill-white" />
            Watch Now
          </button>
          <button 
            onClick={() => setShowGift(true)}
            className="px-4 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
          >
            <Gift size={18} />
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-around mb-6 pb-6 border-b border-white/10">
          <button 
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 size={20} />
            <span className="text-[10px]">Share</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Download size={20} />
            <span className="text-[10px]">Download</span>
          </button>
          <button 
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex flex-col items-center gap-1 transition-colors ${bookmarked ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Bookmark size={20} className={bookmarked ? 'fill-emerald-400' : ''} />
            <span className="text-[10px]">Save</span>
          </button>
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex flex-col items-center gap-1 transition-colors ${liked ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart size={20} className={liked ? 'fill-red-400' : ''} />
            <span className="text-[10px]">Like</span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">About</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{movie.description}</p>
        </div>

        {/* Cast & Director */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Cast</h3>
          <div className="flex flex-wrap gap-2">
            {movie.cast?.map((actor) => (
              <span key={actor} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm">
                {actor}
              </span>
            )) || <span className="text-gray-500 text-sm">Cast information unavailable</span>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Director</h3>
          <p className="text-gray-300 text-sm">{movie.director || 'Unknown'}</p>
        </div>

        {/* Comments */}
        <CommentsSection movieId={movie.id} />
      </div>
    </div>
  );
}