import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, ALL_MOVIES } from '../movies';
import { 
  ArrowLeft, Heart, Share2, MessageCircle, Gift, Download, 
  Plus, Check, Play, Star, Clock, Calendar, Users, Copy, X
} from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const COIN_PACKAGES = [
    { coins: 100, price: 500, label: '100 Coins' },
    { coins: 250, price: 1000, label: '250 Coins' },
    { coins: 500, price: 2000, label: '500 Coins' },
    { coins: 1000, price: 3500, label: '1000 Coins' }
  ];

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser && movie) {
      checkWatchlist(currentUser.uid);
      loadComments();
    }
    setLoading(false);
  }, [id, movie]);

  const checkWatchlist = async (uid) => {
    try {
      const watchlistRef = doc(db, 'watchlists', uid);
      const watchlistSnap = await getDoc(watchlistRef);
      if (watchlistSnap.exists()) {
        const movies = watchlistSnap.data().movies || [];
        setIsInWatchlist(movies.some(m => m.id === id));
      }
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const loadComments = async () => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('movieId', '==', id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      alert('Please sign in to like movies');
      return;
    }
    setIsLiked(!isLiked);
    // Save to Firestore
    try {
      const likesRef = doc(db, 'likes', user.uid);
      const likesSnap = await getDoc(likesRef);
      if (!likesSnap.exists()) {
        await setDoc(likesRef, { movies: [] });
      }
      const movies = likesSnap.data()?.movies || [];
      if (isLiked) {
        await updateDoc(likesRef, { movies: movies.filter(m => m !== id) });
      } else {
        await updateDoc(likesRef, { movies: arrayUnion(id) });
      }
    } catch (error) {
      console.error('Error saving like:', error);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      alert('Please sign in to add to watchlist');
      return;
    }
    try {
      const watchlistRef = doc(db, 'watchlists', user.uid);
      const watchlistSnap = await getDoc(watchlistRef);

      if (!watchlistSnap.exists()) {
        await setDoc(watchlistRef, { movies: [] });
      }

      if (isInWatchlist) {
        const movies = watchlistSnap.data()?.movies || [];
        await updateDoc(watchlistRef, {
          movies: movies.filter(m => m.id !== id)
        });
        setIsInWatchlist(false);
      } else {
        await updateDoc(watchlistRef, {
          movies: arrayUnion({
            id: movie.id,
            title: movie.title,
            poster: movie.poster,
            addedAt: serverTimestamp()
          })
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      alert('Please sign in to download');
      return;
    }
    if (movie.isPupaOriginal) {
      try {
        const walletRef = doc(db, 'wallets', user.uid);
        const walletSnap = await getDoc(walletRef);
        const subscription = walletSnap.data()?.subscription;
        if (!subscription || subscription.status !== 'active') {
          alert('Premium subscription (₦6,000/month) required to download Pupa Originals');
          return;
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }

    setDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          addDoc(collection(db, 'downloads'), {
            userId: user.uid,
            movieId: movie.id,
            title: movie.title,
            poster: movie.poster,
            downloadedAt: serverTimestamp()
          }).catch(console.error);
          alert(`Download complete! ${movie.title} saved to your downloads.`);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Watch ${movie.title} on Pupa Originals!`,
      url: `https://pupaoriginals.com/movie/${movie.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://pupaoriginals.com/movie/${movie.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGift = async (packageId) => {
    if (!user) {
      alert('Please sign in to gift creators');
      return;
    }
    alert('Coin purchases coming soon! Paystack integration in progress.\n\nFor now, enjoy free streaming!');
    setShowGiftModal(false);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        movieId: id,
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const getRelatedMovies = () => {
    if (!movie) return [];
    return ALL_MOVIES.filter(m => 
      m.id !== movie.id && 
      m.genre.some(g => movie.genre.includes(g))
    ).slice(0, 4);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Movie not found</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const relatedMovies = getRelatedMovies();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-20">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={movie.videoUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={movie.title}
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Movie Info */}
      <div className="px-4 py-6">
        {/* Title & Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.year}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration}
              </span>
              <span className="px-2 py-0.5 bg-gray-800 rounded text-xs">{movie.rating}</span>
              {movie.isPupaOriginal && (
                <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 rounded text-xs font-medium">
                  PUPA ORIGINAL
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={toggleLike}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLiked ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={toggleWatchlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isInWatchlist ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-semibold">4.5</span>
          </div>
          <span className="text-gray-500 text-sm">({movie.likes?.toLocaleString()} likes)</span>
          <span className="text-gray-500 text-sm">{movie.views} views</span>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre.map((g, i) => (
            <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {movie.description}
        </p>

        {/* Cast & Crew */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Cast & Crew
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">
              <span className="text-gray-500">Director:</span>{' '}
              <span className="text-gray-300">{movie.director}</span>
            </p>
            <p className="text-gray-400">
              <span className="text-gray-500">Cast:</span>{' '}
              <span className="text-gray-300">{movie.cast.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            {downloading ? (
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-6 h-6 text-purple-400" />
            )}
            <span className="text-xs text-gray-400">
              {downloading ? `${downloadProgress}%` : 'Download'}
            </span>
          </button>

          <button
            onClick={() => setShowGiftModal(true)}
            className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Gift className="w-6 h-6 text-pink-400" />
            <span className="text-xs text-gray-400">Gift</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <Share2 className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-400">Share</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-green-400" />
            <span className="text-xs text-gray-400">Comments</span>
          </button>
        </div>

        {/* Source Attribution */}
        <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
          <p className="text-xs text-gray-500">
            Source: <span className="text-gray-400">{movie.source}</span>
          </p>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Comments ({comments.length})</h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={submitComment} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-500 text-sm mb-4">Sign in to comment</p>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-medium">
                        {(comment.userName || 'U')[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{comment.userName || 'User'}</span>
                      <span className="text-xs text-gray-600">
                        {comment.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 ml-8">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-4">Related Movies</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedMovies.map(related => (
                <button
                  key={related.id}
                  onClick={() => navigate(`/movie/${related.id}`)}
                  className="text-left"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                    <img
                      src={related.poster}
                      alt={related.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster';
                      }}
                    />
                  </div>
                  <p className="text-white text-sm font-medium truncate">{related.title}</p>
                  <p className="text-gray-500 text-xs">{related.year}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Buy Coins</h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Coins are used to gift creators. Points cannot be used for gifting.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {COIN_PACKAGES.map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => handleGift(pkg.coins)}
                  className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors text-center"
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-500 text-lg">⚡</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{pkg.label}</p>
                  <p className="text-purple-400 text-sm">₦{pkg.price.toLocaleString()}</p>
                </button>
              ))}
            </div>

            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-yellow-400 text-sm font-medium">Paystack Coming Soon</p>
              <p className="text-gray-500 text-xs mt-1">
                Coin purchases will be available once Paystack is integrated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Share Movie</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg mb-4">
              <p className="text-gray-400 text-xs break-all">
                https://pupaoriginals.com/movie/{movie.id}
              </p>
            </div>

            <button
              onClick={copyLink}
              className="w-full py-3 bg-purple-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}