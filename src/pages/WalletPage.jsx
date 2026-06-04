import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { 
  Wallet, CreditCard, ArrowUpRight, Gift, Copy, Check, 
  X, Crown, Star, Loader2, Zap, Globe, Lock, Play, Eye,
  Clock, Download, MessageSquare, Shield, Film, Sparkles
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, COIN_PACKAGES, buildPaymentData } from '../flutterwave.js';

const TOPUP_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({ 
    balance: 0, 
    points: 0, 
    referralCode: '', 
    referrals: 0,
    coins: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [showTopup, setShowTopup] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showCoins, setShowCoins] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      loadWallet();
      loadTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Load Flutterwave script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError('');
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);

      if (walletSnap.exists()) {
        setWallet(walletSnap.data());
      } else {
        const newWallet = {
          balance: 0,
          points: 0,
          coins: 0,
          referralCode: 'PUPA' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          referrals: 0,
          subscription: null,
          createdAt: serverTimestamp()
        };
        await setDoc(walletRef, newWallet);
        setWallet(newWallet);
      }
    } catch (err) {
      console.error('Error loading wallet:', err);
      setError('Failed to load wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error loading transactions:', err);
      setTransactions([]);
    }
  };

  // REAL FLUTTERWAVE PAYMENT FOR SUBSCRIPTION
  const handleSubscribe = async () => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    if (typeof window.FlutterwaveCheckout === 'undefined') {
      setError('Payment system loading... Please try again in a moment.');
      return;
    }

    const plan = SUBSCRIPTION_PLANS[selectedPlan];
    setProcessingPayment(true);

    try {
      const paymentData = buildPaymentData({
        user: user,
        amount: plan.price,
        email: user.email,
        name: user.displayName,
        paymentType: 'subscription',
        planId: selectedPlan,
      });

      window.FlutterwaveCheckout({
        ...paymentData,
        onclose: () => {
          setProcessingPayment(false);
        },
        callback: async (response) => {
          setProcessingPayment(false);

          if (response.status === 'successful') {
            // Verify payment on backend (Cloud Function)
            await verifyAndActivateSubscription(response, selectedPlan);
          } else {
            setError('Payment was not completed. Please try again.');
          }
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  // REAL FLUTTERWAVE PAYMENT FOR COINS
  const handleBuyCoins = async (pkg) => {
    if (!user) {
      alert('Please sign in to buy coins');
      return;
    }

    if (typeof window.FlutterwaveCheckout === 'undefined') {
      setError('Payment system loading... Please try again in a moment.');
      return;
    }

    setProcessingPayment(true);

    try {
      const paymentData = buildPaymentData({
        user: user,
        amount: pkg.price,
        email: user.email,
        name: user.displayName,
        paymentType: 'coins',
        coinPackage: pkg,
      });

      window.FlutterwaveCheckout({
        ...paymentData,
        onclose: () => {
          setProcessingPayment(false);
        },
        callback: async (response) => {
          setProcessingPayment(false);

          if (response.status === 'successful') {
            await verifyAndAddCoins(response, pkg);
          } else {
            setError('Payment was not completed. Please try again.');
          }
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const verifyAndActivateSubscription = async (flutterwaveResponse, planId) => {
    try {
      const plan = SUBSCRIPTION_PLANS[planId];
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

      // Update wallet with subscription
      const walletRef = doc(db, 'wallets', user.uid);
      await updateDoc(walletRef, {
        subscription: {
          plan: planId,
          status: 'active',
          startedAt: serverTimestamp(),
          expiresAt: expiryDate,
          price: plan.price,
          transactionId: flutterwaveResponse.transaction_id,
          txRef: flutterwaveResponse.tx_ref,
        }
      });

      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'subscription',
        amount: plan.price,
        reference: flutterwaveResponse.transaction_id,
        txRef: flutterwaveResponse.tx_ref,
        status: 'success',
        plan: planId,
        paymentMethod: flutterwaveResponse.payment_type,
        createdAt: serverTimestamp()
      });

      setWallet(prev => ({ 
        ...prev, 
        subscription: { 
          plan: planId, 
          status: 'active', 
          expiresAt: expiryDate,
          transactionId: flutterwaveResponse.transaction_id
        }
      }));

      setPaymentSuccess({ type: 'subscription', plan: plan.name });
      setShowSubscribe(false);
      loadTransactions();

      setTimeout(() => setPaymentSuccess(null), 5000);
    } catch (err) {
      console.error('Error activating subscription:', err);
      setError('Payment succeeded but activation failed. Contact support with ID: ' + flutterwaveResponse.transaction_id);
    }
  };

  const verifyAndAddCoins = async (flutterwaveResponse, pkg) => {
    try {
      const walletRef = doc(db, 'wallets', user.uid);
      const walletSnap = await getDoc(walletRef);
      const currentCoins = walletSnap.data()?.coins || 0;

      await updateDoc(walletRef, {
        coins: currentCoins + pkg.coins
      });

      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'coins',
        amount: pkg.price,
        reference: flutterwaveResponse.transaction_id,
        txRef: flutterwaveResponse.tx_ref,
        status: 'success',
        coinsPurchased: pkg.coins,
        paymentMethod: flutterwaveResponse.payment_type,
        createdAt: serverTimestamp()
      });

      setWallet(prev => ({ ...prev, coins: currentCoins + pkg.coins }));
      setPaymentSuccess({ type: 'coins', amount: pkg.coins });
      setShowCoins(false);
      loadTransactions();

      setTimeout(() => setPaymentSuccess(null), 5000);
    } catch (err) {
      console.error('Error adding coins:', err);
      setError('Payment succeeded but coins not added. Contact support with ID: ' + flutterwaveResponse.transaction_id);
    }
  };

  const copyReferralLink = () => {
    const code = wallet.referralCode || 'PUPA000000';
    const link = `https://pupaoriginals.com/signup?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSubscribed = wallet?.subscription && wallet.subscription.status === 'active';
  const subscriptionDaysLeft = isSubscribed && wallet.subscription.expiresAt 
    ? Math.ceil((wallet.subscription.expiresAt.toDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const currentPlan = isSubscribed ? SUBSCRIPTION_PLANS[wallet.subscription.plan] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm">Please sign in to access your wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/50 to-[#0a0a1a] pt-12 pb-8 px-4">
        <h1 className="text-2xl font-bold text-white mb-1">Wallet</h1>
        <p className="text-gray-400 text-sm">Manage your subscription, points & coins</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => { setError(''); loadWallet(); }}
              className="text-red-400 text-xs underline mt-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success Message */}
        {paymentSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-bold text-sm">
                  {paymentSuccess.type === 'subscription' 
                    ? `${paymentSuccess.plan} subscription activated!` 
                    : `${paymentSuccess.amount} coins added!`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status Card */}
        <div className={`rounded-2xl p-6 relative overflow-hidden ${
          isSubscribed 
            ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
            : 'bg-gradient-to-br from-gray-700 to-gray-800'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">
                  {isSubscribed ? 'Current Plan' : 'No Active Plan'}
                </p>
                <h2 className="text-3xl font-bold text-white">
                  {isSubscribed ? currentPlan?.name : 'Free'}
                </h2>
              </div>
              {isSubscribed && (
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">{subscriptionDaysLeft} days</p>
                  <p className="text-white/60 text-xs">remaining</p>
                </div>
              )}
            </div>

            {isSubscribed && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentPlan?.features.slice(0, 4).map(feature => (
                  <span key={feature} className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubscribe(true)}
                disabled={processingPayment}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2
                  ${isSubscribed 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-white text-purple-600 hover:bg-gray-100'}`}
              >
                <Crown className="w-4 h-4" />
                {processingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSubscribed ? 'Change Plan' : 'Subscribe')}
              </button>
              <button 
                onClick={() => setShowCoins(true)}
                disabled={processingPayment}
                className="flex-1 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-bold text-sm hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Buy Coins
              </button>
            </div>
          </div>
        </div>

        {/* Points, Referrals & Coins */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-xs">Points</span>
            </div>
            <p className="text-white font-bold text-xl">{(wallet?.points || 0).toLocaleString()}</p>
            <p className="text-gray-500 text-[10px] mt-1">Unlock BTS & Early</p>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs">Referrals</span>
            </div>
            <p className="text-white font-bold text-xl">{wallet?.referrals || 0}</p>
            <p className="text-gray-500 text-[10px] mt-1">+1pt per signup</p>
          </div>

          <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400 text-xs">Coins</span>
            </div>
            <p className="text-white font-bold text-xl">{(wallet?.coins || 0).toLocaleString()}</p>
            <p className="text-gray-500 text-[10px] mt-1">Gift creators</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
          <p className="text-white font-bold text-sm mb-2">Refer & Earn Points</p>
          <p className="text-gray-400 text-xs mb-3">
            Share your link. Earn 1 point per friend who joins. Use points to unlock BTS & Early Releases. 
            <span className="text-red-400"> Points cannot be used for gifting creators.</span>
          </p>

          <div className="flex gap-2">
            <div className="flex-1 bg-black/30 rounded-lg px-3 py-2 text-gray-400 text-xs truncate">
              pupaoriginals.com/signup?ref={wallet?.referralCode || 'PUPA000000'}
            </div>
            <button 
              onClick={copyReferralLink}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* How Points Work */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
          <p className="text-white font-bold text-sm mb-3">How Points Work</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-white text-sm">Refer Friends</p>
                <p className="text-gray-400 text-xs">Get 1 point for each friend who downloads the app</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-white text-sm">Unlock Content</p>
                <p className="text-gray-400 text-xs">Use points to unlock BTS & Early Releases</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">✕</span>
              </div>
              <div>
                <p className="text-white text-sm">Cannot Gift Creators</p>
                <p className="text-gray-400 text-xs">To gift creators, you must buy coins with real money</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-white font-bold mb-3">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="bg-[#1a1a2e] rounded-xl p-8 text-center border border-white/5">
              <Wallet className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 10).map(tx => (
                <div key={tx.id} className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                      ${tx.type === 'subscription' ? 'bg-purple-500/20' : tx.type === 'coins' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                      {tx.type === 'subscription' ? <Crown className="w-5 h-5 text-purple-400" /> :
                       tx.type === 'coins' ? <Zap className="w-5 h-5 text-orange-400" /> :
                       <CreditCard className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold capitalize">{tx.type}</p>
                      <p className="text-gray-500 text-xs">
                        {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-white">
                      -₦{tx.amount?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0a0a1a] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Choose Plan</h2>
                <button onClick={() => setShowSubscribe(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`w-full p-4 rounded-xl border transition-all text-left relative
                      ${selectedPlan === key 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-white/10 bg-[#1a1a2e] hover:border-white/20'}`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-4 px-2 py-0.5 bg-purple-600 rounded text-[10px] text-white font-bold">
                        POPULAR
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {key === 'basic' ? <Eye className="w-5 h-5 text-gray-400" /> : <Crown className="w-5 h-5 text-yellow-400" />}
                        <span className="text-white font-bold">{plan.name}</span>
                      </div>
                      <span className="text-purple-400 font-bold">₦{plan.price.toLocaleString()}/mo</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {plan.hasAds ? (
                        <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded font-bold">With Ads</span>
                      ) : (
                        <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded font-bold">No Ads</span>
                      )}
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-bold">{plan.quality}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded font-bold">{plan.maxMovies} Movies</span>
                    </div>

                    <div className="space-y-1.5">
                      {plan.features.map(feature => (
                        <div key={feature} className="flex items-center gap-2">
                          {key === 'premium' ? (
                            <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          )}
                          <span className="text-[11px] text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {key === 'basic' && (
                      <div className="mt-3 p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                        <p className="text-[10px] text-yellow-500/80">
                          Limited experience. Eventually you will want more content access. Upgrade anytime.
                        </p>
                      </div>
                    )}
                    {key === 'premium' && (
                      <div className="mt-3 p-2 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                        <p className="text-[10px] text-purple-400/80">
                          Full 4K experience. Everything unlimited. No restrictions. Best value.
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleSubscribe}
                disabled={processingPayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
              >
                {processingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                {processingPayment ? 'Processing...' : `Pay ₦${SUBSCRIPTION_PLANS[selectedPlan].price.toLocaleString()} with Flutterwave`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Coins Modal */}
      {showCoins && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0a0a1a] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Buy Coins</h2>
                <button onClick={() => setShowCoins(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Coins are used to gift creators. Points cannot be used for gifting.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {COIN_PACKAGES.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => handleBuyCoins(pkg)}
                    disabled={processingPayment}
                    className="p-4 rounded-xl border border-white/10 bg-[#1a1a2e] hover:border-orange-500/50 transition-all text-center"
                  >
                    <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-white font-bold">{pkg.label}</p>
                    <p className="text-purple-400 text-sm">₦{pkg.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-[10px] mt-1">{pkg.description}</p>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-orange-400 text-sm font-bold">Secure Payment</p>
                <p className="text-gray-500 text-xs mt-1">Powered by Flutterwave. Cards, Bank Transfer & USSD accepted.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}