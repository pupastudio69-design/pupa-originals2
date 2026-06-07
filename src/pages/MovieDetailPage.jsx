import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, ALL_MOVIES } from '../data/movies';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  ArrowLeft, Heart, Share2, Download, Plus, Check, Star, Clock, Calendar, Users, Play, X, ThumbsUp, ThumbsDown, AlertTriangle, Crown, MessageSquare
} from 'lucide-react';
import { getAuth } from 'firebase/auth';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);
  const { isPremium } = useSubscription();

  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
    return saved.some(item => item.id === id);
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`pupa_reviews_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, [id, movie]);

  const handleWatchComplete = () => {
    setHasWatched(true);
    setShowFeedback(true);
  };

  const submitFeedback = (type) => {
    setFeedbackType(type);
    console.log('Feedback:', { movieId: id, type, text: feedbackText, userId: user?.uid });
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
      setFeedbackType(null);
      setFeedbackText('');
    }, 3000);
  };

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Watch ${movie.title} on Pupa Originals!`,
      url: `https://pupaoriginals.com/movie/${movie.id}`
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      setShowShareModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://pupaoriginals.com/movie/${movie.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-bold">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const relatedMovies = getRelatedMovies();

  const submitReview = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (newReview.rating === 0) {
      alert('Please select a star rating');
      return;
    }
    if (!newReview.text.trim()) {
      alert('Please write a review');
      return;
    }

    const review = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      userPhoto: user.photoURL,
      rating: newReview.rating,
      text: newReview.text.trim(),
      date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      isPremium: false
    };

    const updated = [review, ...reviews];
    setReviews(updated);
    localStorage.setItem(`pupa_reviews_${id}`, JSON.stringify(updated));
    setShowReviewForm(false);
    setNewReview({ rating: 0, text: '' });
  };

  const toggleReviewLike = (reviewId) => {
    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, liked: !r.liked, likes: r.liked ? (r.likes - 1) : (r.likes + 1) };
      }
      return r;
    });
    setReviews(updated);
    localStorage.setItem(`pupa_reviews_${id}`, JSON.stringify(updated));
  };

  const toggleReviewDislike = (reviewId) => {
    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, disliked: !r.disliked, dislikes: r.disliked ? (r.dislikes - 1) : (r.dislikes + 1) };
      }
      return r;
    });
    setReviews(updated);
    localStorage.setItem(`pupa_reviews_${id}`, JSON.stringify(updated));
  };

  const toggleWatchlist = () => {
    const saved = JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
    if (isInWatchlist) {
      const updated = saved.filter(item => item.id !== id);
      localStorage.setItem('pupa_watchlist', JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      const movieData = {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        genre: Array.isArray(movie.genre) ? movie.genre[0] : movie.genre
      };
      localStorage.setItem('pupa_watchlist', JSON.stringify([movieData, ...saved]));
      setIsInWatchlist(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-20">
      {/* Poster / Video Area */}
      <div className="relative w-full aspect-video bg-black">
        {!showVideo ? (
          <>
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={() => setShowVideo(true)} className="w-20 h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 flex items-center justify-center transition-all hover:scale-110">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </button>
            </div>
            <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <iframe src={movie.videoUrl} className="w-full h-full" allowFullScreen title={movie.title} />
            <button onClick={() => { setShowVideo(false); handleWatchComplete(); }} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Movie Info */}
      <div className="px-4 py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><Calendar size={14} className="text-emerald-400" />{movie.year}</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-emerald-400" />{movie.duration}</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{movie.rating}</span>
              {movie.isPupaOriginal && (
                <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 rounded text-xs font-bold">PUPA ORIGINAL</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button onClick={() => setIsLiked(!isLiked)} className={`w-10 h-10 rounded-full flex items-center justify-center border ${isLiked ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={toggleWatchlist} className={`w-10 h-10 rounded-full flex items-center justify-center border ${isInWatchlist ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold">4.5</span>
          <span className="text-gray-500 text-sm">({movie.likes?.toLocaleString()} likes)</span>
        </div>

        {/* Watch Button - Premium check for exclusive content */}
        {!showVideo && (
          <>
            {movie.isPupaOriginal && !isPremium() ? (
              <div className="w-full py-3 bg-yellow-400/20 border border-yellow-400/30 rounded-xl text-yellow-400 font-bold flex items-center justify-center gap-2 mb-4">
                <Crown size={18} />
                Premium Only — Upgrade to Watch
              </div>
            ) : (
              <button onClick={() => setShowVideo(true)} className="w-full py-3 bg-white rounded-xl text-black font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors mb-4">
                <Play className="w-5 h-5 fill-black" /> Watch Now
              </button>
            )}
          </>
        )}

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre.map((g, i) => (
            <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">{g}</span>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{movie.description}</p>

        {/* Cast & Crew */}
        <div className="mb-6">
          <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Users size={16} className="text-emerald-400" /> Cast & Crew</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400"><span className="text-gray-600">Director:</span> <span className="text-gray-300">{movie.director}</span></p>
            <p className="text-gray-400"><span className="text-gray-600">Cast:</span> <span className="text-gray-300">{movie.cast.join(', ')}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl border border-gray-700">
            <Download className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] text-gray-400">Download</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl border border-gray-700">
            <Share2 className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] text-gray-400">Share</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-gray-800 rounded-xl border border-gray-700 opacity-50">
            <AlertTriangle className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] text-gray-400">Report</span>
          </button>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div>
            <h3 className="text-white font-bold mb-4 text-sm">Recommended For You</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedMovies.map(related => (
                <button key={related.id} onClick={() => navigate(`/movie/${related.id}`)} className="text-left">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-900">
                    <img src={related.poster} alt={related.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-sm font-semibold truncate">{related.title}</p>
                  <p className="text-gray-500 text-xs">{related.year}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Community Reviews */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              Community Reviews
            </h3>
            <button 
              onClick={() => setShowReviewForm(true)}
              className="text-yellow-400 text-xs font-medium"
            >
              Write a Review
            </button>
          </div>

          {/* Average Rating */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{movie.rating || '4.5'}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(star => (
                    <Star 
                      key={star} 
                      size={12} 
                      className={star <= Math.round(movie.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                    />
                  ))}
                </div>
                <p className="text-gray-500 text-[10px] mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(stars => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-gray-500 text-[10px] w-3">{stars}</span>
                      <Star size={10} className="text-gray-600" />
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-500 text-[10px] w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{review.userName?.[0]?.toUpperCase() || 'U'}</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{review.userName || 'User'}</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            size={10} 
                            className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                          />
                        ))}
                        <span className="text-gray-500 text-[10px] ml-1">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  {review.isPremium && (
                    <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">Premium</span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">{review.text}</p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleReviewLike(review.id)}
                    className="flex items-center gap-1 text-gray-500 text-xs hover:text-emerald-400"
                  >
                    <ThumbsUp size={12} className={review.liked ? 'text-emerald-400 fill-emerald-400' : ''} />
                    {review.likes || 0}
                  </button>
                  <button 
                    onClick={() => toggleReviewDislike(review.id)}
                    className="flex items-center gap-1 text-gray-500 text-xs hover:text-red-400"
                  >
                    <ThumbsDown size={12} className={review.disliked ? 'text-red-400 fill-red-400' : ''} />
                    {review.dislikes || 0}
                  </button>
                  <span className="text-gray-600 text-xs">Was this helpful?</span>
                </div>
              </div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No reviews yet</p>
              <p className="text-gray-600 text-xs">Be the first to review this movie</p>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Write a Review</h3>
              <button onClick={() => setShowReviewForm(false)} className="text-gray-400">
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-400 text-xs mb-3">{movie.title}</p>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                  className="p-1"
                >
                  <Star 
                    size={28} 
                    className={star <= newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-gray-500 text-xs mb-4">
              {newReview.rating === 1 ? 'Terrible' :
               newReview.rating === 2 ? 'Bad' :
               newReview.rating === 3 ? 'Okay' :
               newReview.rating === 4 ? 'Good' :
               newReview.rating === 5 ? 'Excellent' : 'Tap a star to rate'}
            </p>

            {/* Review Text */}
            <textarea
              value={newReview.text}
              onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Share your thoughts about this movie..."
              className="w-full p-3 rounded-xl bg-gray-800 text-white text-sm placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500 resize-none mb-4"
              rows={4}
              maxLength={500}
            />
            <p className="text-gray-600 text-[10px] text-right mb-4">{newReview.text.length}/500</p>

            <button
              onClick={submitReview}
              disabled={newReview.rating === 0 || !newReview.text.trim()}
              className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal - After Watching */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-gray-800">
            {!feedbackSubmitted ? (
              <>
                <h3 className="text-white font-bold text-lg mb-1 text-center">How was your experience?</h3>
                <p className="text-gray-400 text-sm text-center mb-6">{movie.title}</p>

                <div className="flex gap-3 mb-4">
                  <button onClick={() => submitFeedback('loved')} className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/30 transition-colors">
                    Loved it
                  </button>
                  <button onClick={() => submitFeedback('good')} className="flex-1 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold text-sm hover:bg-yellow-500/30 transition-colors">
                    Good
                  </button>
                  <button onClick={() => submitFeedback('improve')} className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/30 transition-colors">
                    Needs improvement
                  </button>
                </div>

                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what went wrong or what you liked (optional)"
                  className="w-full p-3 rounded-xl bg-gray-800 text-white text-sm placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500 resize-none mb-4"
                  rows={3}
                />

                <div className="flex gap-2 mb-4">
                  <button onClick={() => setShowFeedback(false)} className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-400 text-sm">Skip</button>
                  <button onClick={() => submitFeedback(feedbackType || 'general')} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold">Submit</button>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <p className="text-gray-500 text-xs mb-2">Report issues:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Playback issues', 'Video quality', 'Suggestions', 'General'].map(issue => (
                      <button key={issue} onClick={() => { setFeedbackText(issue); }} className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs hover:bg-gray-700">
                        {issue}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <ThumbsUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-white font-bold mb-1">Thank you!</p>
                <p className="text-gray-400 text-sm">Your feedback helps us improve.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-sm border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Share Movie</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg mb-4">
              <p className="text-gray-400 text-xs break-all">https://pupaoriginals.com/movie/{movie.id}</p>
            </div>
            <button onClick={copyLink} className="w-full py-3 bg-emerald-600 rounded-xl text-white font-bold flex items-center justify-center gap-2">
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}