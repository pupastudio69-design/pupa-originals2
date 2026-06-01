import React, { useState } from 'react';
import {
  ArrowLeft, Play, Download, Gift, Star, Clock, Calendar,
  Heart, MessageCircle, Share2, ThumbsUp, Bookmark, Users,
  Coins, Diamond, Crown, Sparkles, Flame
} from 'lucide-react';

// Gift coins with prices by geography
const COIN_GIFTS = [
  { 
    id: 'bronze', 
    name: 'Bronze', 
    icon: Coins, 
    color: '#cd7f32',
    prices: { NG: 800, GH: 20, UK: 2.5, US: 3 }
  },
  { 
    id: 'silver', 
    name: 'Silver', 
    icon: Sparkles, 
    color: '#c0c0c0',
    prices: { NG: 1500, GH: 35, UK: 4.5, US: 5 }
  },
  { 
    id: 'gold', 
    name: 'Gold', 
    icon: Flame, 
    color: '#ffd700',
    prices: { NG: 3000, GH: 70, UK: 9, US: 10 }
  },
  { 
    id: 'diamond', 
    name: 'Diamond', 
    icon: Diamond, 
    color: '#b9f2ff',
    prices: { NG: 5000, GH: 120, UK: 15, US: 18 }
  },
  { 
    id: 'crown', 
    name: 'Crown', 
    icon: Crown, 
    color: '#ff6b6b',
    prices: { NG: 10000, GH: 250, UK: 30, US: 35 }
  },
];

// User's region - in real app, detect from IP or user settings
const USER_REGION = 'NG'; // Nigeria default
const CURRENCY_SYMBOLS = { NG: '₦', GH: '₵', UK: '£', US: '$' };

export default function MovieDetailPage({ movie, onBack }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedGift, setSelectedGift] = useState(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'Chioma A.', avatar: 'C', comment: 'Absolutely breathtaking cinematography. African cinema at its finest!', likes: 42, time: '2h ago', gifts: 3 },
    { id: 2, user: 'Kofi M.', avatar: 'K', comment: 'The storyline had me gripped from start to finish. 10/10 Pupa Original!', likes: 31, time: '4h ago', gifts: 1 },
    { id: 3, user: 'Amina D.', avatar: 'A', comment: 'Finally a streaming platform that represents us properly. This is cinema!', likes: 58, time: '1d ago', gifts: 5 },
  ]);

  const handleSendGift = (giftId) => {
    const gift = COIN_GIFTS.find(g => g.id === giftId);
    if (!gift) return;

    // In real app: deduct from user's wallet, send to creator
    const price = gift.prices[USER_REGION];
    const currency = CURRENCY_SYMBOLS[USER_REGION];

    alert(`You sent ${gift.name} gift worth ${currency}${price} to the creator!`);
    setSelectedGift(giftId);
    setShowGiftModal(false);
  };

  const handleAddComment = (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: 'You',
        avatar: 'Y',
        comment: newComment,
        likes: 0,
        time: 'Just now',
        gifts: 0,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const getGiftPrice = (gift) => {
    const currency = CURRENCY_SYMBOLS[USER_REGION];
    const price = gift.prices[USER_REGION];
    return `${currency}${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-pupa-bg page-enter pb-20">
      {/* Hero backdrop */}
      <div className="relative" style={{ height: '45vh', minHeight: 280 }}>
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pupa-bg via-pupa-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-pupa-bg/70 to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-14 left-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        {/* Share */}
        <button className="absolute top-14 right-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center">
          <Share2 size={17} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 -mt-16 relative z-10">
        {/* Movie poster + title row */}
        <div className="flex gap-4 mb-5">
          <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-cinematic" style={{ width: 90, height: 135 }}>
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pt-10">
            {movie.isPupa && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/25 mb-2">
                <span className="text-yellow-400 text-[9px] font-mono tracking-widest">PUPA ORIGINAL</span>
              </div>
            )}
            <h1 className="font-display font-semibold text-2xl text-white leading-tight mb-1">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-emerald-400/70 text-xs italic font-body">{movie.tagline}</p>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-sm font-mono font-semibold">{movie.rating}</span>
          </div>
          {movie.year && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Calendar size={11} /> {movie.year}
            </div>
          )}
          {movie.duration && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Clock size={11} /> {movie.duration}
            </div>
          )}
          {(movie.genre || []).map((g, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] border border-emerald-800 text-emerald-400">
              {g}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button className="btn-gold flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold">
            <Play size={16} className="fill-black" /> Watch Now
          </button>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center border border-emerald-800/40"
          >
            <Bookmark size={18} className={bookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center border border-emerald-800/40"
          >
            <Heart size={18} className={liked ? 'text-red-400 fill-red-400' : 'text-gray-400'} />
          </button>
          <button className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center border border-emerald-800/40">
            <Download size={18} className="text-emerald-400" />
          </button>
        </div>

        {/* Gift Creator Button */}
        <button 
          onClick={() => setShowGiftModal(true)}
          className="w-full mb-6 py-3 rounded-xl border border-yellow-500/30 text-yellow-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-yellow-500/10 transition-colors"
        >
          <Gift size={16} /> Support the Creator with Coins
        </button>

        {/* Gift Selection Modal */}
        {showGiftModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center" onClick={() => setShowGiftModal(false)}>
            <div className="w-full max-w-md bg-pupa-bg rounded-t-2xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4" />
              <h3 className="text-white font-semibold text-center mb-1">Send a Gift</h3>
              <p className="text-gray-400 text-xs text-center mb-4">Support the creators with Pupa Coins</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {COIN_GIFTS.map((gift) => {
                  const Icon = gift.icon;
                  return (
                    <button
                      key={gift.id}
                      onClick={() => handleSendGift(gift.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl glass-dark hover:border-yellow-500/30 transition-colors"
                    >
                      <Icon size={28} style={{ color: gift.color }} />
                      <span className="text-white text-xs font-medium">{gift.name}</span>
                      <span className="text-yellow-400 text-[10px] font-mono">{getGiftPrice(gift)}</span>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowGiftModal(false)}
                className="w-full py-3 rounded-xl text-gray-400 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Storyline */}
        <div className="mb-6">
          <h3 className="font-body font-semibold text-white mb-2">Storyline</h3>
          <p className="text-gray-400 text-sm leading-relaxed font-body">{movie.description}</p>
        </div>

        {/* Cast */}
        {movie.cast && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-emerald-400" />
              <h3 className="font-body font-semibold text-white">Cast</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto scroll-row pb-0">
              {movie.cast.map((actor, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display font-semibold text-lg text-white"
                    style={{
                      background: `hsl(${i * 60 + 120}, 40%, 25%)`,
                      border: '2px solid rgba(22,163,74,0.3)',
                    }}
                  >
                    {actor[0]}
                  </div>
                  <p className="text-gray-400 text-[10px] text-center font-body w-16 leading-tight">
                    {actor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Supporters */}
        <div className="mb-6">
          <h3 className="font-body font-semibold text-white mb-3">Top Supporters</h3>
          <div className="flex items-center gap-2">
            {['C', 'K', 'A', 'E', 'M'].map((letter, i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display text-white border-2 border-pupa-bg"
                style={{ 
                  background: `hsl(${i * 70 + 100}, 50%, 30%)`,
                  marginLeft: i > 0 ? '-8px' : '0',
                  zIndex: 5 - i
                }}
              >
                {letter}
              </div>
            ))}
            <span className="text-gray-400 text-xs ml-2">+42 others gifted coins</span>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={15} className="text-emerald-400" />
            <h3 className="font-body font-semibold text-white">Community</h3>
            <span className="text-gray-500 text-xs">({comments.length})</span>
          </div>

          {/* Comment input */}
          <div className="flex gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-emerald-900/60 flex items-center justify-center flex-shrink-0 text-emerald-400 text-sm font-display">
              Y
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyPress={handleAddComment}
                placeholder="Share your thoughts..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-700 transition-colors font-body"
              />
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-display font-medium"
                  style={{ background: 'rgba(22,163,74,0.2)', color: '#22c55e' }}
                >
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-xs font-semibold font-body">{c.user}</span>
                    <span className="text-gray-600 text-[10px]">{c.time}</span>
                    {c.gifts > 0 && (
                      <span className="text-yellow-400 text-[10px] flex items-center gap-0.5">
                        <Gift size={9} /> {c.gifts} gifts
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm font-body leading-relaxed">{c.comment}</p>
                  <button className="flex items-center gap-1 mt-2 text-gray-500 text-xs hover:text-emerald-400 transition-colors">
                    <ThumbsUp size={11} /> {c.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}