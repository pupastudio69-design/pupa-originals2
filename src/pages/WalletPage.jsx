import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { 
  Wallet, CreditCard, Gift, Users, Star, X, Globe, Share2, Check, 
  Crown, Film, Sparkles, Popcorn, Heart, Flame, Diamond, Zap, 
  Play, Clock, Lock, Unlock, LogIn 
} from 'lucide-react';

// Pricing data by region
const PRICING = {
  NG: { 
    currency: '₦', 
    basic: 4000, 
    premium: 6000, 
    name: 'Nigeria',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
  US: { 
    currency: '$', 
    basic: 7.99, 
    premium: 12.99, 
    name: 'USA',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
  UK: { 
    currency: '£', 
    basic: 5.99, 
    premium: 9.99, 
    name: 'UK',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
  GH: { 
    currency: '₵', 
    basic: 50, 
    premium: 80, 
    name: 'Ghana',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
  KE: { 
    currency: 'KSh', 
    basic: 800, 
    premium: 1200, 
    name: 'Kenya',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
  ZA: { 
    currency: 'R', 
    basic: 90, 
    premium: 150, 
    name: 'South Africa',
    basicName: 'Basic (With Ads)',
    premiumName: 'Premium (No Ads + BTS + Early Access)'
  },
};

// Coin gifts for movies
const MOVIE_GIFTS = [
  { id: 'popcorn', name: 'Popcorn', icon: Popcorn, price: 100, color: '#fbbf24' },
  { id: 'heart', name: 'Heart', icon: Heart, price: 200, color: '#ef4444' },
  { id: 'flame', name: 'Fire', icon: Flame, price: 500, color: '#f97316' },
  { id: 'sparkle', name: 'Sparkle', icon: Sparkles, price: 1000, color: '#a78bfa' },
  { id: 'diamond', name: 'Diamond', icon: Diamond, price: 5000, color: '#06b6d4' },
  { id: 'crown', name: 'Crown', icon: Crown, price: 10000, color: '#facc15' },
  { id: 'zap', name: 'Thunder', icon: Zap, price: 2500, color: '#eab308' },
  { id: 'film', name: 'Reel', icon: Film, price: 750, color: '#22c55e' },
];

// Sample movies for gifting
const MOVIES = [
  { id: 1, title: 'Black Panther: Wakanda Forever', image: '🎬', genre: 'Action' },
  { id: 2, title: 'The Woman King', image: '⚔️', genre: 'Drama' },
  { id: 3, title: 'Blood Sisters', image: '🔥', genre: 'Thriller' },
  { id: 4, title: 'King of Boys', image: '👑', genre: 'Crime' },
  { id: 5, title: 'Namaste Wahala', image: '💕', genre: 'Romance' },
  { id: 6, title: 'Citation', image: '📚', genre: 'Drama' },
];

export default function WalletPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState('NG');
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('Free');
  const [watchTime, setWatchTime] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGift, setSelectedGift] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [giftQuantity, setGiftQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const p = PRICING[region];

  // Get user data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserData(user.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setBalance(data.balance || 0);
        setPoints(data.points || 0);
        setReferrals(data.referrals || 0);
        setCurrentPlan(data.plan || 'Free');
        setWatchTime(data.watchTime || 0);
        setRegion(data.region || 'NG');
      } else {
        // Create new user document
        await setDoc(doc(db, 'users', uid), {
          balance: 0,
          points: 0,
          referrals: 0,
          plan: 'Free',
          watchTime: 0,
          region: 'NG',
          createdAt: serverTimestamp(),
        });
      }
      loadTransactions(uid);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadTransactions = (uid) => {
    const q = query(
      collection(db, 'users', uid, 'transactions'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Now'
      }));
      setTransactions(txs);
    });
    return unsubscribe;
  };

  const addTransaction = async (uid, type, desc, amount, icon) => {
    try {
      await addDoc(collection(db, 'users', uid, 'transactions'), {
        type,
        desc,
        amount,
        icon,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const updateUserField = async (field, value) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        [field]: value,
      });
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleRegionChange = async (newRegion) => {
    setRegion(newRegion);
    if (currentUser) {
      await updateUserField('region', newRegion);
    }
  };

  const handleSubscribe = async (planName) => {
    if (!currentUser) {
      alert('Please sign in first!');
      return;
    }
    const price = planName === 'Basic' ? p.basic : p.premium;
    if (balance >= price) {
      const newBalance = balance - price;
      setBalance(newBalance);
      setCurrentPlan(planName);
      await updateUserField('balance', newBalance);
      await updateUserField('plan', planName);
      await addTransaction(
        currentUser.uid,
        'sub',
        `${planName} Subscription`,
        `-${p.currency}${price.toLocaleString()}`,
        planName === 'Premium' ? '👑' : '⭐'
      );
      setShowModal(null);
      alert(`Successfully subscribed to ${planName} plan!`);
    } else {
      alert('Insufficient balance! Please top up your wallet.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentUser) return;
    if (confirm('Are you sure? No refunds will be issued.')) {
      setCurrentPlan('Free');
      await updateUserField('plan', 'Free');
      await addTransaction(
        currentUser.uid,
        'cancel',
        'Subscription Cancelled',
        'No refund',
        '❌'
      );
      alert('Subscription cancelled. You can still watch until the end of your billing period.');
    }
  };

  const handleTopUp = async () => {
    if (!currentUser) {
      alert('Please sign in first!');
      return;
    }
    const amount = parseFloat(topUpAmount);
    if (amount && amount > 0) {
      const newBalance = balance + amount;
      setBalance(newBalance);
      await updateUserField('balance', newBalance);
      await addTransaction(
        currentUser.uid,
        'topup',
        'Wallet Top Up',
        `+${p.currency}${amount.toLocaleString()}`,
        '💳'
      );
      setTopUpAmount('');
      setShowModal(null);
      alert(`Successfully added ${p.currency}${amount.toLocaleString()} to your wallet!`);
    }
  };

  const handleSendGift = async () => {
    if (!currentUser) {
      alert('Please sign in first!');
      return;
    }
    if (!selectedMovie || !selectedGift) return;
    const gift = MOVIE_GIFTS.find(g => g.id === selectedGift);
    const totalPrice = gift.price * giftQuantity;

    if (balance >= totalPrice) {
      const newBalance = balance - totalPrice;
      setBalance(newBalance);
      await updateUserField('balance', newBalance);
      await addTransaction(
        currentUser.uid,
        'gift',
        `Sent ${giftQuantity}x ${gift.name} to ${selectedMovie.title}`,
        `-${p.currency}${totalPrice.toLocaleString()}`,
        gift.name
      );
      setShowModal(null);
      setSelectedMovie(null);
      setSelectedGift(null);
      setGiftQuantity(1);
      alert(`Sent ${giftQuantity}x ${gift.name} to "${selectedMovie.title}"!`);
    } else {
      alert('Insufficient balance!');
    }
  };

  const handleShareReferral = () => {
    if (!currentUser) {
      alert('Please sign in first!');
      return;
    }
    const referralCode = `PU${currentUser.uid.substring(0, 6).toUpperCase()}`;
    const referralLink = `https://pupaoriginals.com/join?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReferralSignup = async () => {
    if (!currentUser) return;
    const newCount = referrals + 1;
    setReferrals(newCount);
    await updateUserField('referrals', newCount);
    if (newCount <= 10) {
      const newPoints = points + 10;
      setPoints(newPoints);
      await updateUserField('points', newPoints);
      await addTransaction(
        currentUser.uid,
        'reward',
        'Friend Joined via Referral',
        '+10 pts',
        '🎁'
      );
      if (newCount === 10) {
        alert('🎉 Congratulations! You invited 10 friends! Bonus unlocked!');
      }
    }
  };

  const handleUnlockFeature = async (featureName, cost) => {
    if (!currentUser) {
      alert('Please sign in first!');
      return;
    }
    if (points >= cost) {
      const newPoints = points - cost;
      setPoints(newPoints);
      await updateUserField('points', newPoints);
      await addTransaction(
        currentUser.uid,
        'unlock',
        `Unlocked: ${featureName}`,
        `-${cost} pts`,
        '🔓'
      );
      alert(`Unlocked ${featureName} for 24 hours!`);
    } else {
      alert(`Need ${cost} points! Watch more movies to earn points.`);
    }
  };

  const quickActions = [
    { icon: CreditCard, label: 'Top Up', color: '#16a34a', action: () => setShowModal('topup') },
    { icon: Gift, label: 'Send Gift', color: '#facc15', action: () => setShowModal('gifts') },
  ];

  const referralProgress = Math.min((referrals / 10) * 100, 100);

  const plans = [
    { 
      name: 'Basic', 
      price: p.basic, 
      features: ['4K Streaming', '1 Screen', 'With Ads', 'Standard Downloads'],
      description: p.basicName
    },
    { 
      name: 'Premium', 
      price: p.premium, 
      features: ['4K + HDR', '2 Screens', 'No Ads', 'BTS Access', 'Early Releases', 'Unlimited Downloads'],
      highlight: true,
      description: p.premiumName
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center px-5">
        <div className="text-center">
          <LogIn size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm mb-4">Please sign in to access your wallet</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pupa-bg pt-16 pb-24 page-enter">
      <div className="px-5 pt-4">
        {/* Header with Region */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold text-white">Wallet</h1>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-400" />
            <select
              value={region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {Object.entries(PRICING).map(([code, data]) => (
                <option key={code} value={code} className="bg-gray-900">
                  {data.name} ({data.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Balance card */}
        <div
          className="relative rounded-2xl p-5 mb-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #064e2a 0%, #0d3b23 50%, #041b11 100%)',
            border: '1px solid rgba(22,163,74,0.25)',
          }}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-yellow-500/5" />
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-emerald-500/5" />

          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-xs font-body mb-1">Available Balance</p>
              <p className="font-display text-3xl font-semibold text-white">
                {p.currency}{balance.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Wallet size={18} className="text-yellow-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/15 px-3 py-1.5 rounded-full">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs font-mono font-medium">{points} Points</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-500/15 px-3 py-1.5 rounded-full">
              <Clock size={11} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-mono">{watchTime}m watched</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickActions.map(({ icon: Icon, label, color, action }) => (
            <button
              key={label}
              onClick={action}
              className="glass-dark rounded-xl py-4 flex flex-col items-center gap-2 hover:border-emerald-700/50 transition-all active:scale-95"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-gray-300 text-xs font-body">{label}</span>
            </button>
          ))}
        </div>

        {/* Current Plan Status */}
        <div className="rounded-2xl p-4 mb-6 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown size={18} className={currentPlan === 'Premium' ? 'text-yellow-400' : 'text-gray-400'} />
              <span className="text-white font-semibold text-sm">Current Plan: {currentPlan}</span>
            </div>
            {currentPlan !== 'Free' && (
              <button
                onClick={handleCancelSubscription}
                className="text-red-400 text-xs hover:text-red-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {currentPlan === 'Basic' && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-gray-400 text-xs mb-2">Unlock Premium features with points:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUnlockFeature('BTS Access', 50)}
                  className="flex-1 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Unlock size={12} />
                  BTS (50 pts)
                </button>
                <button
                  onClick={() => handleUnlockFeature('Early Access', 100)}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <Unlock size={12} />
                  Early (100 pts)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Referral section */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            background: 'rgba(250,204,21,0.05)',
            border: '1px solid rgba(250,204,21,0.2)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center">
              <Users size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold font-body">Refer & Earn</p>
              <p className="text-gray-400 text-xs font-body">Invite friends = 10 points each</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-gray-400 text-xs">{referrals} / 10 invited</span>
              <span className="text-yellow-400 text-xs font-mono">{referralProgress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${referralProgress}%`,
                  background: 'linear-gradient(90deg, #16a34a, #facc15)',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleShareReferral}
            className="w-full py-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-sm font-medium hover:bg-yellow-500/25 transition-colors flex items-center justify-center gap-2 mb-2"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'Link Copied!' : 'Copy Referral Link'}
          </button>

          <button
            onClick={handleReferralSignup}
            className="w-full py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-colors"
          >
            + Simulate Friend Joining (Demo)
          </button>
        </div>

        {/* Subscription plans */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-body font-semibold text-white">Subscription Plans</h3>
            <span className="text-xs text-gray-400">{p.name}</span>
          </div>

          <div className="space-y-3">
            {plans.map(plan => (
              <div
                key={plan.name}
                className="rounded-xl p-4"
                style={{
                  background: plan.highlight
                    ? 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(4,27,17,0.8))'
                    : 'rgba(255,255,255,0.03)',
                  border: plan.highlight
                    ? '1px solid rgba(22,163,74,0.4)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-semibold font-body">{plan.name}</p>
                      {plan.highlight && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                          BEST VALUE
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-[11px] font-body">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-display font-semibold">
                      {p.currency}{plan.price.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-[10px]">/month</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {plan.features.map((feature, idx) => (
                    <span key={idx} className="text-gray-400 text-[10px] font-body flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                      <Check size={10} className="text-emerald-500" />
                      {feature}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={currentPlan === plan.name}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: currentPlan === plan.name 
                      ? 'rgba(255,255,255,0.1)' 
                      : plan.highlight ? '#16a34a' : 'rgba(255,255,255,0.1)',
                    color: currentPlan === plan.name ? '#6b7280' : plan.highlight ? 'white' : '#9ca3af',
                    border: currentPlan === plan.name ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  {currentPlan === plan.name ? 'Current Plan' : `Subscribe to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <h3 className="font-body font-semibold text-white mb-3">Recent Activity</h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-body font-medium">{t.desc}</p>
                    <p className="text-gray-500 text-xs">{t.date}</p>
                  </div>
                  <p
                    className="text-sm font-mono font-medium"
                    style={{ color: t.amount.startsWith('+') ? '#22c55e' : t.amount === 'No refund' ? '#ef4444' : '#f3f4f6' }}
                  >
                    {t.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10">
            {/* Top Up Modal */}
            {showModal === 'topup' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg">Top Up Wallet</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Amount ({p.currency})</label>
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000, 20000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTopUpAmount(amt.toString())}
                        className="py-2 rounded-lg bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors border border-white/10"
                      >
                        {p.currency}{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleTopUp}
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Top Up Now
                  </button>
                </div>
              </div>
            )}

            {/* Gift Modal */}
            {showModal === 'gifts' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg">Send Movie Gift</h3>
                  <button onClick={() => { setShowModal(null); setSelectedMovie(null); setSelectedGift(null); }} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                {!selectedMovie ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm mb-3">Select a movie you watched:</p>
                    {MOVIES.map(movie => (
                      <button
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                          {movie.image}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{movie.title}</p>
                          <p className="text-gray-500 text-xs">{movie.genre}</p>
                        </div>
                        <Play size={16} className="text-gray-400 ml-auto" />
                      </button>
                    ))}
                  </div>
                ) : !selectedGift ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setSelectedMovie(null)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        ← Back
                      </button>
                      <span className="text-gray-500">|</span>
                      <span className="text-white text-sm">{selectedMovie.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Choose a gift:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {MOVIE_GIFTS.map(gift => {
                        const GiftIcon = gift.icon;
                        return (
                          <button
                            key={gift.id}
                            onClick={() => setSelectedGift(gift.id)}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/10 hover:border-white/20"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ background: `${gift.color}20` }}
                              >
                                <GiftIcon size={24} style={{ color: gift.color }} />
                              </div>
                              <p className="text-white text-sm font-medium">{gift.name}</p>
                              <p className="text-gray-400 text-xs">{p.currency}{gift.price.toLocaleString()}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setSelectedGift(null)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        ← Back
                      </button>
                    </div>

                    {(() => {
                      const gift = MOVIE_GIFTS.find(g => g.id === selectedGift);
                      const GiftIcon = gift.icon;
                      return (
                        <>
                          <div className="text-center">
                            <div
                              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                              style={{ background: `${gift.color}20` }}
                            >
                              <GiftIcon size={32} style={{ color: gift.color }} />
                            </div>
                            <p className="text-white text-lg font-semibold">{gift.name}</p>
                            <p className="text-gray-400 text-sm">{p.currency}{gift.price.toLocaleString()} each</p>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-gray-400 text-sm mb-2">Movie: <span className="text-white">{selectedMovie.title}</span></p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-gray-400 text-sm">Quantity:</span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setGiftQuantity(Math.max(1, giftQuantity - 1))}
                                  className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20"
                                >
                                  -
                                </button>
                                <span className="text-white font-mono">{giftQuantity}</span>
                                <button
                                  onClick={() => setGiftQuantity(giftQuantity + 1)}
                                  className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-white/10">
                              <span className="text-gray-400">Total</span>
                              <span className="text-white font-semibold">{p.currency}{(gift.price * giftQuantity).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 text-xs text-gray-500">
                            <span>Balance: {p.currency}{balance.toLocaleString()}</span>
                            <span>•</span>
                            <span>Points: {points}</span>
                          </div>

                          <button
                            onClick={handleSendGift}
                            className="w-full py-3 rounded-xl bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors"
                          >
                            Send {giftQuantity}x {gift.name}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}