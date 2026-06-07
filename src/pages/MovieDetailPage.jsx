import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, ALL_MOVIES } from '../data/movies';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  ArrowLeft, Heart, Share2, Download, Plus, Check, Star, Clock, Calendar, Users, Play, X, ThumbsUp, ThumbsDown, Crown, MessageSquare, Send
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
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  
  // Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`pupa_reviews_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  
  // Comments
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(`pupa_comments_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'comments'

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, [id, movie]);

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

  const submitComment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      userPhoto: user.photoURL,
      text: newComment.trim(),
      date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      likes: 0,
      liked: false
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem(`pupa_comments_${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  const toggleCommentLike = (commentId) => {
    const updated = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, liked: !c.liked, likes: c.liked ? (c.likes - 1) : (c.likes + 1) };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem(`pupa_comments_${id}`, JSON.stringify(updated));
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
            <button onClick={() => setShowVideo(false)} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white">
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
          <span className="text-white font-bold">{movie.rating || '4.5'}</span>
          <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
        </div>

        {/* Watch Button */}
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
          <div className="mb-6">
            <h3 className="text-white font-bold mb-4 text-sm">Recommended For You</h3>
            <div className="grid grid-cols-3 gap-2">
              {relatedMovies.map(related => (
                <button key={related.id} onClick={() => navigate(`/movie/${related.id}`)} className="text-left">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-1 bg-gray-900">
                    <img src={related.poster} alt={related.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-[10px] font-medium truncate">{related.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reviews & Comments Section */}
        <div className="mt-8">
          {/* Tab Switcher */}
          <div className="flex items-center gap-4 mb-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'comments' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
            >
              Comments ({comments.length})
            </button>
          </div>

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-white text-sm font-medium">Community Reviews</span>
                </div>
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
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="text-center py-8">
                  <Star size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No reviews yet</p>
                  <p className="text-gray-600 text-xs">Be the first to review this movie</p>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-400" />
                  <span className="text-white text-sm font-medium">Comments</span>
                </div>
              </div>

              {/* Add Comment */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                  />
                  <button
                    onClick={submitComment}
                    disabled={!newComment.trim()}
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center disabled:opacity-30"
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Comment List */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{comment.userName?.[0]?.toUpperCase() || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{comment.userName || 'User'}</p>
                          <p className="text-gray-500 text-[10px]">{comment.date}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{comment.text}</p>
                    <button 
                      onClick={() => toggleCommentLike(comment.id)}
                      className="flex items-center gap-1 text-gray-500 text-xs hover:text-emerald-400"
                    >
                      <ThumbsUp size={12} className={comment.liked ? 'text-emerald-400 fill-emerald-400' : ''} />
                      {comment.likes || 0}
                    </button>
                  </div>
                ))}
              </div>

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No comments yet</p>
                  <p className="text-gray-600 text-xs">Be the first to comment</p>
                </div>
              )}
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