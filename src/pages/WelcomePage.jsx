import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  SUBSCRIPTION_PLANS, 
  buildMonnifyPaymentData, 
  initializeMonnifyPayment,
  verifyMonnifyTransaction 
} from '../monnify';
import { 
  Crown, Check, AlertCircle, Zap, Star, Clock, Shield,
  Wifi, MessageSquare, Download, Gift, ChevronRight, X
} from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const { startTrial, savePaidSubscription, isSubscribed } = useSubscription();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTrialModal, setShowTrialModal] = useState(false);

  // If already subscribed, go home
  useEffect(() => {
    if (isSubscribed()) {
      navigate('/');
    }
  }, [isSubscribed, navigate]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setError('');
  };

  const getPrice = (plan) => {
    return selectedPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (selectedPeriod === 'yearly') {
      const monthlyTotal = plan.monthlyPrice * 12;
      return monthlyTotal - plan.yearlyPrice;
    }
    return 0;
  };

  // 1-DAY FREE TRIAL
  const handleStartTrial = async () => {
    if (!selectedPlan) {
      setError('Please select a plan to start your trial');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      startTrial(selectedPlan);
      setLoading(false);
      setShowTrialModal(true);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  // PAY WITH MONNIFY
  const handlePayNow = async () => {
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const plan = SUBSCRIPTION_PLANS[selectedPlan];
      const amount = getPrice(plan);

      const paymentData = buildMonnifyPaymentData({
        user,
        amount,
        email: user?.email,
        name: user?.displayName,
        paymentType: 'subscription',
        planId: selectedPlan,
        callbackUrl: `${window.location.origin}/welcome?payment=success`
      });

      await initializeMonnifyPayment(
        paymentData,
        async (response) => {
          console.log('Payment successful:', response);
          const verify = await verifyMonnifyTransaction(response.paymentReference);
          
          if (verify.success && verify.status === 'PAID') {
            const duration = selectedPeriod === 'yearly' ? 365 : 30;
            savePaidSubscription(selectedPlan, selectedPeriod, amount, response.paymentReference, response.transactionReference);
            setLoading(false);
            navigate('/');
          } else {
            setLoading(false);
            setError('Payment verification failed. Contact support if charged.');
          }
        },
        (error) => {
          console.error('Payment failed:', error);
          setLoading(false);
          setError('Payment failed or was cancelled. Please try again.');
        }
      );
    } catch (err) {
      console.error('Payment init error:', err);
      setError('Payment initialization failed. Please try again.');
      setLoading(false);
    }
  };

  const plans = [
    {
      ...SUBSCRIPTION_PLANS.basic,
      price: selectedPeriod === 'yearly' ? SUBSCRIPTION_PLANS.basic.yearlyPrice : SUBSCRIPTION_PLANS.basic.monthlyPrice,
      savings: selectedPeriod === 'yearly' ? (SUBSCRIPTION_PLANS.basic.monthlyPrice * 12 - SUBSCRIPTION_PLANS.basic.yearlyPrice) : 0
    },
    {
      ...SUBSCRIPTION_PLANS.premium,
      price: selectedPeriod === 'yearly' ? SUBSCRIPTION_PLANS.premium.yearlyPrice : SUBSCRIPTION_PLANS.premium.monthlyPrice,
      savings: selectedPeriod === 'yearly' ? (SUBSCRIPTION_PLANS.premium.monthlyPrice * 12 - SUBSCRIPTION_PLANS.premium.yearlyPrice) : 0
    }
  ];

  const planFeatures = [
    { icon: Wifi, label: 'Streaming', basic: 'Standard', premium: '4K Ultra HD' },
    { icon: Download, label: 'Downloads', basic: '5 movies', premium: 'Unlimited' },
    { icon: Zap, label: 'New Releases', basic: '7-14 days delay', premium: 'Immediate' },
    { icon: MessageSquare, label: 'Community', basic: 'View only', premium: 'Full access' },
    { icon: Shield, label: 'Ads', basic: 'Light ads', premium: 'No ads' },
    { icon: Gift, label: 'Exclusive', basic: '❌', premium: '✅ Yes' },
    { icon: Star, label: 'Badge', basic: 'Silver', premium: 'Gold' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 text-sm">Unlock unlimited Nollywood entertainment</p>
      </div>

      {/* Period Toggle */}
      <div className="w-full max-w-md bg-white/5 rounded-xl p-1 mb-6 flex">
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPeriod === 'monthly' ? 'bg-yellow-400 text-black' : 'text-gray-400'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedPeriod('yearly')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
            selectedPeriod === 'yearly' ? 'bg-yellow-400 text-black' : 'text-gray-400'
          }`}
        >
          Yearly
          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Save</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Plan Cards */}
      <div className="w-full max-w-md space-y-4 mb-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
                isSelected ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-white/5 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <p className="text-gray-400 text-xs">{plan.quality}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-gray-600'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-black" />}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white">₦{plan.price.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">/{selectedPeriod === 'yearly' ? 'year' : 'month'}</span>
                {plan.savings > 0 && (
                  <p className="text-emerald-400 text-xs mt-1">Save ₦{plan.savings.toLocaleString()} per year</p>
                )}
              </div>

              <div className="space-y-2">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <div className="w-full max-w-md bg-white/5 rounded-xl border border-white/10 p-4 mb-6">
        <h3 classPlan="text-white text-sm font-semibold mb-3">Plan Comparison</h3>
        <div className="space-y-2">
          {planFeatures.map((feature) => (
            <div key={feature.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <feature.icon size={12} />
                {feature.label}
              </div>
              <div className="flex gap-4 text-xs">
                <span className={selectedPlan === 'basic' ? 'text-yellow-400 font-bold' : 'text-gray-500'}>
                  {feature.basic}
                </span>
                <span className={selectedPlan === 'premium' ? 'text-yellow-400 font-bold' : 'text-gray-500'}>
                  {feature.premium}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        {/* 1-Day Free Trial */}
        <button
          onClick={handleStartTrial}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Clock size={18} />
              Start 1-Day Free Trial
            </>
          )}
        </button>

        {/* Pay Now */}
        <button
          onClick={handlePayNow}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Crown size={18} />
              Pay Now with Monnify
            </>
          )}
        </button>

        <p className="text-center text-gray-500 text-xs">
          Cancel anytime. No hidden fees. Card payments only.
        </p>
      </div>

      {/* Trial Success Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#0a0a1a] rounded-2xl p-6 w-full max-w-sm border border-emerald-500/30 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Trial Started!</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your 1-day free trial of <span className="text-yellow-400 font-bold">{selectedPlan === 'premium' ? 'Premium' : 'Basic'}</span> is active.
            </p>
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-gray-400 text-xs">Expires in 24 hours</p>
              <p className="text-white text-sm font-medium">Subscribe before expiry to keep watching</p>
            </div>
            <button
              onClick={() => { setShowTrialModal(false); navigate('/'); }}
              className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold"
            >
              Start Watching
            </button>
          </div>
        </div>
      )}
    </div>
  );
}