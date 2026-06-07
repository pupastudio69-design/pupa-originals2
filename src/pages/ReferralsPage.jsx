import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  ArrowLeft, Copy, Check, Share2, Gift, Users, Star,
  Crown, Zap, Link2, MessageCircle
} from 'lucide-react';

export default function ReferralsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(() => {
    return parseInt(localStorage.getItem('pupa_referral_count') || '0');
  });
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('pupa_points') || '0');
  });

  // Generate referral code from user ID
  const referralCode = user?.uid ? `PUPA${user.uid.slice(0, 6).toUpperCase()}` : 'PUPA000000';
  const referralLink = `https://pupaoriginals.com/signup?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    const shareData = {
      title: 'Join Pupa Originals',
      text: `Watch Nollywood movies on Pupa Originals! Use my code ${referralCode} to sign up.`,
      url: referralLink
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      copyLink();
    }
  };

  // Referral rewards
  const REFERRAL_REWARDS = [
    { count: 1, reward: '50 points', icon: Star },
    { count: 3, reward: '100 points', icon: Gift },
    { count: 5, reward: 'Free week Premium', icon: Crown },
    { count: 10, reward: '1 month Premium', icon: Zap },
    { count: 25, reward: '3 months Premium', icon: Crown },
  ];

  const getNextReward = () => {
    for (const reward of REFERRAL_REWARDS) {
      if (referrals < reward.count) return reward;
    }
    return null;
  };

  const nextReward = getNextReward();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/me')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Invite Friends</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <Users size={20} className="text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{referrals}</p>
            <p className="text-gray-500 text-xs">Friends Joined</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <Star size={20} className="text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">{points}</p>
            <p className="text-gray-500 text-xs">Points Earned</p>
          </div>
        </div>

        {/* Next Reward */}
        {nextReward && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-xl p-4 border border-purple-500/20 mb-4">
            <p className="text-gray-400 text-xs mb-1">Next Reward</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <nextReward.icon size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{nextReward.reward}</p>
                <p className="text-gray-500 text-xs">{nextReward.count - referrals} more friends needed</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full"
                style={{ width: `${(referrals / nextReward.count) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Referral Code */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">Your Referral Code</h3>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3">
          <div className="flex items-center justify-between mb-3">
            <code className="text-2xl font-bold text-yellow-400 tracking-wider">{referralCode}</code>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-gray-500 text-xs">Share this code with friends. They get a bonus, you get points.</p>
        </div>

        {/* Referral Link */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-gray-400 text-xs mb-2">Or share your link</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={referralLink} 
              readOnly 
              className="flex-1 bg-black/30 rounded-lg px-3 py-2 text-gray-400 text-xs border border-white/10"
            />
            <button
              onClick={copyLink}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <Link2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">Share</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareReferral}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500"
          >
            <Share2 size={18} />
            Share
          </button>
          <button
            onClick={() => {
              const text = `Join Pupa Originals! Use my code ${referralCode} for bonus points. ${referralLink}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-600 text-white font-medium text-sm hover:bg-green-500"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">How It Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-white text-sm">Share your code</p>
              <p className="text-gray-500 text-xs">Send to friends via WhatsApp, SMS, or social media</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-white text-sm">Friend signs up</p>
              <p className="text-gray-500 text-xs">They create an account using your code</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-white text-sm">You both earn</p>
              <p className="text-gray-500 text-xs">Get 100 points. If they subscribe, get 500 more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Table */}
      <div className="px-4 mb-6">
        <h3 className="text-white text-sm font-semibold mb-3">Referral Rewards</h3>
        <div className="space-y-2">
          {REFERRAL_REWARDS.map((reward) => (
            <div 
              key={reward.count}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                referrals >= reward.count ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                referrals >= reward.count ? 'bg-emerald-500/20' : 'bg-white/10'
              }`}>
                <reward.icon size={16} className={referrals >= reward.count ? 'text-emerald-400' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${referrals >= reward.count ? 'text-emerald-400' : 'text-white'}`}>
                  {reward.count} Friends
                </p>
                <p className="text-gray-500 text-xs">{reward.reward}</p>
              </div>
              {referrals >= reward.count && <Check size={16} className="text-emerald-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Premium Bonus */}
      {isPremium() && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-yellow-400" />
              <div>
                <p className="text-white text-sm font-medium">Premium Bonus Active</p>
                <p className="text-gray-500 text-xs">2x points on all referrals</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}