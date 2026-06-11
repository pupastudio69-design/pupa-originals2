import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Plus, ThumbsUp, Share2, Download, ChevronLeft, Star, 
  Clock, Calendar, MessageSquare, Send, Heart, ChevronDown, ChevronUp,
  Gift, Coins, X
} from 'lucide-react';
import { getMovieById } from '../data/movies';
import { showInterstitialAd, isFreeTier } from '../services/ads';

// Coin packages
const COIN_PACKAGES = [
  { id: 'coins-100', coins: 100, price: 500, label: '100 Coins' },
  { id: 'coins-250', coins: 250, price: 1000, label: '250 Coins' },
  { id: 'coins-500', coins: 500, price: 2000, label: '500 Coins' },
  { id: 'coins-1000', coins: 1000, price: 3500, label: '1000 Coins' }
];

// Mock comments data with replies
const MOCK_COMMENTS = [
  {
    id: 1,
    userId: 'user-1',
    username: 'Sarah Johnson',
    avatar: 'SJ',
    avatarColor: 'from-pink-500 to-rose-500',
    text: 'This show is absolutely incredible! The cinematography is top-notch and the storyline keeps you hooked from episode one.',
    likes: 234,
    date: '2 days ago',
    replies: [
      {
        id: 11,
        userId: 'user-2',
        username: 'Mike Chen',
        avatar: 'MC',
        avatarColor: 'from-blue-500 to-cyan-500',
        text: 'Totally agree! Episode 3 had me on the edge of my seat.',
        likes: 45,
        date: '1 day ago'
      },
      {
        id: 12,
        userId: 'user-3',
        username: 'Emma Wilson',
        avatar: 'EW',
        avatarColor: 'from-purple-500 to-violet-500',
        text: 'The character development is amazing too!',
        likes: 23,
        date: '12 hours ago'
      }
    ]
  },
  {
    id: 2,
    userId: 'user-4',
    username: 'David Park',
    avatar: 'DP',
    avatarColor: 'from-emerald-500 to-teal-500',
    text: "Just finished binge-watching the whole season. Can't wait for season 2! The cliffhanger at the end was insane.",
    likes: 189,
    date: '3 days ago',
    replies: [
      {
        id: 21,
        userId: 'user-5',
        username: 'Lisa Kim',
        avatar: 'LK',
        avatarColor: 'from-orange-500 to-amber-500',
        text: 'Same here! That ending though... 😱',
        likes: 67,
        date: '2 days ago'
      }
    ]
  },
  {
    id: 3,
    userId: 'user-6',
    username: 'Alex Turner',
    avatar: 'AT',
    avatarColor: 'from-indigo-500 to-blue-500',
    text: 'The soundtrack alone is worth watching for. Beautifully composed and perfectly timed with each scene.',
    likes: 156,
    date: '4 days ago',
    replies: []
  },
  {
    id: 4,
    userId: 'user-7',
    username: 'Maria Garcia',
    avatar: 'MG',
    avatarColor: 'from-red-500 to-pink-500',
    text: "Best series I've watched this year. The acting is phenomenal and the plot twists are unpredictable.",
    likes: 98,
    date: '5 days ago',
    replies: []
  }
];

// Related community posts
const RELATED_COMMUNITY = [
  {
    id: 1,
    userId: 'user-8',
    username: 'FilmBuff_99',
    avatar: 'F9',
    avatarColor: 'from-yellow-500 to-orange-500',
    text: "Theory: The main character is actually the villain. Here's why...",
    likes: 412,
    comments: 89,
    date: '1 day ago'
  },
  {
    id: 2,
    userId: 'user-9',
    username: 'SeriesAddict',
    avatar: 'SA',
    avatarColor: 'from-green-500 to-emerald-500',
    text: 'Ranking all episodes from best to worst. Do you agree?',
    likes: 267,
    comments: 45,
    date: '2 days ago'
  },
  {
    id: 3,
    userId: 'user-10',
    username: 'CriticCorner',
    avatar: 'CC',
    avatarColor: 'from-cyan-500 to-blue-500',
    text: 'Hidden easter eggs you might have missed in episode 5!',
    likes: 189,
    comments: 32,
    date: '3 days ago'
  }
];

// Comment Component with inline replies
function CommentItem({ comment, onReply, onNavigateToProfile }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReply?.(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
      setShowReplies(true);
    }
  };

  return (
    <div className="py-3 border-b border-white/5 last:border-0">
      <div className="flex gap-3">
        <button onClick={() => onNavigateToProfile?.(comment.userId)} className="flex-shrink-0">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${comment.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
            {comment.avatar}
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => onNavigateToProfile?.(comment.userId)} className="text-white text-sm font-medium hover:text-yellow-400 transition-colors">
              {comment.username}
            </button>
            <span className="text-gray-600 text-xs">{comment.date}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
          <div className="flex items-center gap-4 mt-2">
            <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}>
              <ThumbsUp size={14} className={liked ? 'fill-yellow-400' : ''} />
              {likeCount}
            </button>
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              <MessageSquare size={14} /> Reply
            </button>
          </div>

          {showReplyInput && (
            <div className="flex gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                ME
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-yellow-400/50"
                  autoFocus
                />
                <button onClick={handleReply} disabled={!replyText.trim()} className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold disabled:opacity-50">
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 mt-2 text-yellow-400 text-xs font-medium">
              {showReplies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {showReplies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-white/5">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <button onClick={() => onNavigateToProfile?.(reply.userId)} className="flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${reply.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {reply.avatar}
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <button onClick={() => onNavigateToProfile?.(reply.userId)} className="text-white text-xs font-medium hover:text-yellow-400 transition-colors">
                        {reply.username}
                      </button>
                      <span className="text-gray-600 text-[10px]">{reply.date}</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{reply.text}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
                        <ThumbsUp size={12} /> {reply.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Community Post
function CommunityPost({ post, onNavigateToProfile }) {
  return (
    <div className="py-3 border-b border-white/5 last:border-0">
      <div className="flex gap-3">
        <button onClick={() => onNavigateToProfile?.(post.userId)} className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
            {post.avatar}
          </div>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => onNavigateToProfile?.(post.userId)} className="text-white text-xs font-medium hover:text-yellow-400 transition-colors">
              {post.username}
            </button>
            <span className="text-gray-600 text-[10px]">{post.date}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{post.text}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Heart size={12} /> {post.likes}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare size={12} /> {post.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Episode Download Item
function EpisodeItem({ episode }) {
  const [downloaded, setDownloaded] = useState(() => JSON.parse(localStorage.getItem(`pupa_dl_${episode.number}`) || 'false'));
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    if (downloaded) {
      setDownloaded(false);
      localStorage.setItem(`pupa_dl_${episode.number}`, 'false');
      return;
    }
    setDownloading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setDownloading(false);
        setDownloaded(true);
        localStorage.setItem(`pupa_dl_${episode.number}`, 'true');
      }
      setProgress(p);
    }, 300);
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0">
        {String(episode.number).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{episode.title}</p>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <span>{episode.duration}</span><span>·</span><span>{episode.size}</span>
        </div>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          downloaded ? 'bg-emerald-500/20 text-emerald-400' : downloading ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
        }`}
      >
        {downloading ? (
          <span className="text-[10px] font-bold">{Math.round(progress)}%</span>
        ) : downloaded ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <Download size={16} />
        )}
      </button>
    </div>
  );
}

// Coin Gift Modal
function CoinGiftModal({ onClose, movieTitle }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userCoins, setUserCoins] = useState(() => {
    return parseInt(localStorage.getItem('pupa_coins') || '0');
  });
  const [showPurchase, setShowPurchase] = useState(false);

  const handleGift = () => {
    if (!selectedPackage) return;
    if (userCoins < selectedPackage.coins) {
      setShowPurchase(true);
      return;
    }

    // Deduct coins
    const newBalance = userCoins - selectedPackage.coins;
    setUserCoins(newBalance);
    localStorage.setItem('pupa_coins', newBalance.toString());

    // Save gift record
    const gifts = JSON.parse(localStorage.getItem('pupa_gifts') || '[]');
    gifts.push({
      movieTitle,
      coins: selectedPackage.coins,
      date: new Date().toISOString()
    });
    localStorage.setItem('pupa_gifts', JSON.stringify(gifts));

    alert(`You gifted ${selectedPackage.coins} coins for "${movieTitle}"!`);
    onClose();
  };

  const handlePurchaseCoins = (pkg) => {
    // For now, just add coins (in production, this would use Google Play Billing)
    const newBalance = userCoins + pkg.coins;
    setUserCoins(newBalance);
    localStorage.setItem('pupa_coins', newBalance.toString());
    setShowPurchase(false);
    alert(`Purchased ${pkg.coins} coins!`);
  };

  if (showPurchase) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-[#0a0a1a] rounded-2xl p-6 w-full max-w-sm border border-white/10">
          <h3 className="text-white font-bold text-lg mb-2">Buy Coins</h3>
          <p className="text-gray-400 text-sm mb-4">You need more coins to gift. Choose a package:</p>

          <div className="space-y-2 mb-4">
            {COIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePurchaseCoins(pkg)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-sm font-medium">{pkg.label}</p>
                  <p className="text-gray-500 text-xs">₦{pkg.price.toLocaleString()}</p>
                </div>
                <Coins size={18} className="text-yellow-400" />
              </button>
            ))}
          </div>

          <button onClick={() => setShowPurchase(false)} className="w-full py-2 rounded-xl bg-white/5 text-gray-400 text-sm">
            Back to Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#0a0a1a] rounded-2xl p-6 w-full max-w-sm border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Gift Coins</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-2">Movie: <span className="text-white">{movieTitle}</span></p>
        <p className="text-yellow-400 text-sm mb-4">Your balance: {userCoins} coins</p>

        <div className="space-y-2 mb-4">
          {COIN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedPackage?.id === pkg.id
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div>
                <p className="text-white text-sm font-medium">{pkg.label}</p>
                <p className="text-gray-500 text-xs">₦{pkg.price.toLocaleString()}</p>
              </div>
              <Coins size={18} className={selectedPackage?.id === pkg.id ? 'text-yellow-400' : 'text-gray-500'} />
            </button>
          ))}
        </div>

        <button
          onClick={handleGift}
          disabled={!selectedPackage}
          className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm disabled:opacity-50"
        >
          {selectedPackage ? `Gift ${selectedPackage.coins} Coins` : 'Select Amount'}
        </button>
      </div>
    </div>
  );
}

// Users icon helper
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  const [activeTab, setActiveTab] = useState('for-you');
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    const list = JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
    return list.some(item => item.id === id);
  });
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [showGiftModal, setShowGiftModal] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <p className="text-gray-500">Content not found</p>
      </div>
    );
  }

  const isTV = movie.type === 'tv';

  const handleWatchlist = () => {
    const list = JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
    if (isInWatchlist) {
      localStorage.setItem('pupa_watchlist', JSON.stringify(list.filter(item => item.id !== id)));
    } else {
      list.push({ id: movie.id, title: movie.title, poster: movie.poster });
      localStorage.setItem('pupa_watchlist', JSON.stringify(list));
    }
    setIsInWatchlist(!isInWatchlist);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      userId: 'current-user',
      username: 'You',
      avatar: 'ME',
      avatarColor: 'from-yellow-500 to-amber-500',
      text: newComment,
      likes: 0,
      date: 'Just now',
      replies: []
    };
    setComments([comment, ...comments]);
    setNewComment('');
    const userComments = JSON.parse(localStorage.getItem('pupa_user_comments') || '[]');
    userComments.unshift({ movieTitle: movie.title, text: newComment, date: 'Just now' });
    localStorage.setItem('pupa_user_comments', JSON.stringify(userComments));
  };

  const handleReply = (commentId, text) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, {
            id: Date.now(),
            userId: 'current-user',
            username: 'You',
            avatar: 'ME',
            avatarColor: 'from-yellow-500 to-amber-500',
            text,
            likes: 0,
            date: 'Just now'
          }]
        };
      }
      return c;
    }));
  };

  const navigateToProfile = (userId) => {
    if (userId === 'current-user') {
      navigate('/me');
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Backdrop */}
      <div className="relative w-full" style={{ height: '50vh', minHeight: '280px' }}>
        <img src={movie.backdrop || movie.poster} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/40 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isTV ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {isTV ? 'TV SERIES' : 'MOVIE'}
          </span>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-10">
        <h1 className="text-2xl font-bold text-white mb-2">{movie.title}</h1>
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{movie.rating?.toFixed(1)}</span>
          <span>{movie.year}</span>
          {movie.duration && <span className="flex items-center gap-1"><Clock size={12} />{movie.duration}</span>}
          {isTV && <span className="flex items-center gap-1"><Calendar size={12} />{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>}
          <span className="px-2 py-0.5 bg-white/10 rounded text-[10px]">{movie.genre?.[0]}</span>
        </div>

        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => {
              if (isFreeTier()) showInterstitialAd();
              // Play video logic here
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-400 text-black rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
          >
            <Play size={18} fill="black" /> Watch Now
          </button>
          <button onClick={handleWatchlist} className={`flex items-center justify-center gap-2 px-4 rounded-xl font-medium text-sm transition-colors ${
            isInWatchlist ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white hover:bg-white/20'
          }`}>
            <Plus size={18} className={isInWatchlist ? 'rotate-45' : ''} />
            {isInWatchlist ? 'Added' : 'Watchlist'}
          </button>
        </div>

        {/* Gift Coins Button */}
        <button
          onClick={() => setShowGiftModal(true)}
          className="w-full py-3 mb-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 font-medium text-sm hover:from-yellow-500/30 hover:to-amber-500/30 transition-all flex items-center justify-center gap-2"
        >
          <Gift size={18} />
          Gift Coins to Support This Movie
        </button>

        <div className="flex items-center justify-around mb-6 pb-6 border-b border-white/5">
          <button onClick={() => setIsLiked(!isLiked)} className={`flex flex-col items-center gap-1 transition-colors ${isLiked ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>
            <ThumbsUp size={20} className={isLiked ? 'fill-yellow-400' : ''} />
            <span className="text-[10px]">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Share2 size={20} /><span className="text-[10px]">Share</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Download size={20} /><span className="text-[10px]">Download</span>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>
        </div>

        {movie.cast && (
          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-2">Cast</h3>
            <div className="flex gap-2 flex-wrap">
              {movie.cast.map((actor, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-xs">{actor}</span>
              ))}
            </div>
          </div>
        )}

        {/* Episode Downloads - TV Only */}
        {isTV && movie.episodeList && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Download size={16} className="text-yellow-400" /> Resources
              </h3>
              <span className="text-gray-500 text-xs">{movie.episodeList.length} Episodes</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              {movie.episodeList.map((episode) => (
                <EpisodeItem key={episode.number} episode={episode} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs - For You / Comments */}
        <div className="flex border-b border-white/5 mb-4">
          <button onClick={() => setActiveTab('for-you')} className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'for-you' ? 'text-yellow-400' : 'text-gray-500'}`}>
            For You
            {activeTab === 'for-you' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-yellow-400 rounded-full" />}
          </button>
          <button onClick={() => setActiveTab('comments')} className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'comments' ? 'text-yellow-400' : 'text-gray-500'}`}>
            Comments
            {activeTab === 'comments' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-yellow-400 rounded-full" />}
          </button>
        </div>

        {activeTab === 'for-you' && (
          <div className="pb-6">
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <UsersIcon /> Related Community
              </h3>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                {RELATED_COMMUNITY.map(post => (
                  <CommunityPost key={post.id} post={post} onNavigateToProfile={navigateToProfile} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-3">You Might Also Like</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <button key={i} onClick={() => navigate(`/movie/movie-${i}`)} className="flex-shrink-0" style={{ width: 120 }}>
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-1">
                      <img src={`https://images.unsplash.com/photo-${['1536440136628-849c177e76a1','1489599849927-2ee91cede3ba','1485846234645-a62644f84728','1440404653325-ab127d49abc1'][i-1]}?w=300&h=450&fit=crop`} alt="Suggested" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white text-[10px] truncate">Suggested {i}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="pb-6">
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                ME
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-yellow-400/50"
                />
                <button onClick={handleAddComment} disabled={!newComment.trim()} className="px-4 py-2.5 rounded-xl bg-yellow-400 text-black disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={18} />
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              {comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onReply={handleReply} onNavigateToProfile={navigateToProfile} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coin Gift Modal */}
      {showGiftModal && (
        <CoinGiftModal 
          onClose={() => setShowGiftModal(false)} 
          movieTitle={movie.title} 
        />
      )}
    </div>
  );
}