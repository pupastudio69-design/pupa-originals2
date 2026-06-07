import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  Star, Gift, Crown, Zap, Check, ArrowLeft, Lock,
  Ticket, Percent, Clock, Award, ChevronRight
} from 'lucide-react';

// Points system
const POINTS = {
  SIGNUP: 50,
  WATCH_MOVIE: 10,
  COMPLETE_PROFILE: 30,
  REFER_FRIEND: 100,
  FRIEND_SUBSCRIBES: 500,
  DAILY_LOGIN: 5,
  REVIEW_MOVIE: 20,
  SHARE_MOVIE: 15
};

const REWARDS_TIERS = [
  { name: 'Bronze', min: 0, color: '#cd7f32', icon: Star },
  { name: 'Silver', min: 200, color: '#c0c0c0', icon: Award },
  { name: 'Gold', min: 500, color: '#ffd700', icon: Crown },
  { name: 'Platinum', min: 1000, color: '#e5e4e2', icon: Zap }
];

const REWARDS = [
  {
    id: 'discount-10',
    title: '10% Off Premium',
    description: 'Get 10% off your next Premium subscription',
    cost: 200,
    icon: Percent,
    available: true
  },
  {
    id: 'discount-25',
    title: '25% Off Premium',
    description: 'Big savings on your next Premium subscription',
    cost: 400,
    icon: Percent,
    available: true
  },
  {
    id: 'free-week',
    title: 'Free Week Premium',
    description: 'Enjoy Premium for 7 days at no cost',
    cost: 300,
    icon: Clock,
    available: true
  },
  {
    id: 'exclusive-movie',
    title: 'Exclusive Movie Access',
    description: 'Watch a Pupa Original before anyone else',
    cost: 500,
    icon: Ticket,
    available: true
  },
  {
    id: 'merch',
    title: 'Pupa Merch',
    description: 'Coming soon: T-shirts, hoodies, and more',
    cost: 1000,
    icon: Gift,
    available: false
  }
];

const MILESTONES = [
  { id: 'signup', label: 'Create Account', points: POINTS.SIGNUP, icon: Star, check: (user) => !!user },
  { id: 'profile', label: 'Complete Profile', points: POINTS.COMPLETE_PROFILE, icon: Award, check: (user) => !!(user?.displayName && user?.photoURL) },
  { id: 'watch', label: 'Watch First Movie', points: POINTS.WATCH_MOVIE, icon: Zap, check: () => false },
  { id: 'review', label: 'Write a Review', points: POINTS.REVIEW_MOVIE, icon: Star, check: () => false },
  { id: 'share', label: 'Share a Movie', points: POINTS.SHARE_MOVIE, icon: Gift, check: () => false },
  { id: 'refer', label: 'Refer a Friend', points: POINTS.REFER_FRIEND, icon: Crown, check: () => false },
  { id: 'daily', label: 'Daily Login Streak', points: POINTS.DAILY_LOGIN, icon: Clock, check: () => false }
];

export default function RewardsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('pupa_points') || '0');
  });
  const [claimedRewards, setClaimedRewards] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_claimed_rewards') || '[]');
  });
  const [showSuccess, setShowSuccess] = useState(null);

  // Calculate tier
  const getTier = () => {
    for (let i = REWARDS_TIERS.length - 1; i >= 0; i--) {
      if (points >= REWARDS_TIERS[i].min) return REWARDS_TIERS[i];
    }
    return REWARDS_TIERS[0];
  };

  const currentTier = getTier();
  const nextTier = REWARDS_TIERS.find(t => t.min > points);
  const progressToNext = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const claimReward = (reward) => {
    if (points < reward.cost) return;
    if (claimedRewards.includes(reward.id)) return;
    
    const newPoints = points - reward.cost;
    const newClaimed = [...claimedRewards, reward.id];
    
    setPoints(newPoints);
    setClaimedRewards(newClaimed);
    localStorage.setItem('pupa_points', newPoints.toString());
    localStorage.setItem('pupa_claimed_rewards', JSON.stringify(newClaimed));
    setShowSuccess(reward);
    
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const addPoints = (amount, reason) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    localStorage.setItem('pupa_points', newPoints.toString());
    
    // Save history
    const history = JSON.parse(localStorage.getItem('pupa_points_history') || '[]');
    history.unshift({ amount, reason, date: new Date().toISOString() });
    localStorage.setItem('pupa_points_history', JSON.stringify(history.slice(0, 50)));
  };

  // Check completed milestones
  const completedMilestones = MILESTONES.filter(m => m.check(user));
  const pendingMilestones = MILESTONES.filter(m => !m.check(user));

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/me')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Rewards</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Points Card */}
      <div className="px-4 py-4">
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-2xl p-5 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-400 text-xs font-medium mb-1">Your Points</p>
              <h2 className="text-3xl font-bold text-white">{points.toLocaleString()}</h2>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${currentTier.color}20` }}>
              <currentTier.icon size={28} style={{ color: currentTier.color }} />
            </div>
          </div>

          {/* Tier Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span style={{ color: currentTier.color }} className="font-medium">{currentTier.name}</span>
              {nextTier && <span className="text-gray-500">{nextTier.name}</span>}
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ width: `${progressToNext}%`, backgroundColor: currentTier.color }}
              />
            </div>
            {nextTier && (
              <p className="text-gray-500 text-[10px] mt-1">
                {nextTier.min - points} points to {nextTier.name}
              </p>
            )}
          </div>

          {/* Premium bonus */}
          {isPremium() && (
            <div className="mt-3 p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
              <p className="text-yellow-400 text-xs font-medium">
                <Crown size={12} className="inline mr-1" />
                Premium Bonus: 2x points on all activities
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">Earn Points</h3>
        <div className="space-y-2">
          {MILESTONES.map((milestone) => {
            const isCompleted = milestone.check(user);
            return (
              <div 
                key={milestone.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isCompleted ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500/20' : 'bg-white/10'
                }`}>
                  {isCompleted ? (
                    <Check size={18} className="text-emerald-400" />
                  ) : (
                    <milestone.icon size={18} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                    {milestone.label}
                  </p>
                  <p className="text-gray-500 text-xs">+{milestone.points} points</p>
                </div>
                {isCompleted && (
                  <span className="text-emerald-400 text-xs font-bold">Done</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Shop */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">Redeem Rewards</h3>
        <div className="space-y-3">
          {REWARDS.map((reward) => {
            const isClaimed = claimedRewards.includes(reward.id);
            const canAfford = points >= reward.cost;
            const isAvailable = reward.available;

            return (
              <div 
                key={reward.id}
                className={`p-4 rounded-xl border ${
                  isClaimed ? 'bg-emerald-500/10 border-emerald-500/20' : 
                  !isAvailable ? 'bg-white/5 border-white/10 opacity-50' :
                  'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isClaimed ? 'bg-emerald-500/20' : 'bg-yellow-400/20'
                  }`}>
                    <reward.icon size={24} className={isClaimed ? 'text-emerald-400' : 'text-yellow-400'} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium">{reward.title}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{reward.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-400 text-xs font-bold">{reward.cost} pts</span>
                      {!isAvailable && <span className="text-gray-600 text-xs">Coming soon</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => claimReward(reward)}
                    disabled={isClaimed || !canAfford || !isAvailable}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      isClaimed ? 'bg-emerald-500/20 text-emerald-400' :
                      !isAvailable ? 'bg-gray-800 text-gray-600' :
                      canAfford ? 'bg-yellow-400 text-black hover:bg-yellow-300' :
                      'bg-white/10 text-gray-500'
                    }`}
                  >
                    {isClaimed ? 'Claimed' : !isAvailable ? 'Locked' : canAfford ? 'Claim' : 'Need pts'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-24 left-4 right-4 bg-emerald-500 rounded-xl p-4 text-center z-50">
          <p className="text-white font-bold text-sm">Reward Claimed!</p>
          <p className="text-emerald-100 text-xs">{showSuccess.title}</p>
        </div>
      )}

      {/* Referral CTA */}
      <div className="px-4 mb-6">
        <button
          onClick={() => navigate('/referrals')}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-500/20 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Gift size={20} className="text-purple-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white text-sm font-medium">Invite Friends</p>
            <p className="text-gray-500 text-xs">Earn 100 points per friend</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}