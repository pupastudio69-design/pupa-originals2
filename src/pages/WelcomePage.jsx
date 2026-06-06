import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  SUBSCRIPTION_PLANS, 
  buildMonnifyPaymentData, 
  initializeMonnifyPayment,
  verifyMonnifyTransaction 
} from '../monnify';
import { Crown, Check, AlertCircle, Zap, Gift, Star, MessageSquare, Download, Wallet } from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PLANS = {
    basic: {
      ...SUBSCRIPTION_PLANS.basic,
      price: selectedPeriod === 'yearly' 
        ? SUBSCRIPTION_PLANS.basic.yearlyPrice 
        : SUBSCRIPTION_PLANS.basic.monthlyPrice
    },
    premium: {
      ...SUBSCRIPTION_PLANS.premium,
      price: selectedPeriod === 'yearly' 
        ? SUBSCRIPTION_PLANS.premium.yearlyPrice 
        : SUBSCRIPTION_PLANS.premium.monthlyPrice
    }
  };

  useEffect(() => {
    const hasSub = localStorage.getItem('pupa_subscription');
    if (hasSub) {
      try {
        const data = JSON.parse(hasSub);
        if (new Date(data.expiryDate) > new Date()) {
          navigate('/');
        }
      } catch {}
    }
  }, [navigate]);

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

  const handleStartTrial = async () => {
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }
    setLoading(true);
    try {
      const trialData = {
        plan: selectedPlan,
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'trial'
      };
      localStorage.setItem('pupa_subscription', JSON.stringify(trialData));
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            const subData = {
              plan: selectedPlan,
              period: selectedPeriod,
              startDate: new Date().toISOString(),
              expiryDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              paymentReference: response.paymentReference,
              transactionReference: response.transactionReference,
              paymentMethod: 'monnify_card',
              amountPaid: amount
            };
            localStorage.setItem('pupa_subscription', JSON.stringify(subData));
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

  const plans = [PLANS.basic, PLANS.premium];

  const upcomingFeatures = [
    { icon: MessageSquare, label: 'Comments', desc: 'Discuss movies with other members' },
    { icon: Download, label: 'Offline Downloads', desc: 'Watch without internet' },
    { icon: Wallet, label: 'Wallet & Coins', desc: 'Gift and support creators' },
    { icon: Gift, label: 'Rewards Program', desc: 'Earn points for watching' },
    { icon: Star, label: 'Referrals', desc: 'Invite friends and earn' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-yellow-400 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 text-sm">Start with a 1-day free trial</p>
      </div>

      <div className="w-full max-w-md bg-white/5 rounded-xl p-1 mb-6 flex">
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedPeriod === 'monthly' ? 'bg-emerald-500 text-white' : 'text-gray-400'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedPeriod('yearly')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
            selectedPeriod === 'yearly' ? 'bg-emerald-500 text-white' : 'text-gray-400'
          }`}
        >
          Yearly
          <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full">Save</span>
        </button>
      </div>

      {error && (
        <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="w-full max-w-md space-y-4 mb-8">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = getPrice(plan);
          const savings = getSavings(plan);

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
                  POPULAR
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.quality}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-gray-600'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-black" />}
                </div>
              </div>

              <div className="mb-3">
                <span className="text-2xl font-bold text-white">₦{price.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">/{selectedPeriod === 'yearly' ? 'year' : 'month'}</span>
                {savings > 0 && (
                  <p className="text-emerald-400 text-xs mt-1">Save ₦{savings.toLocaleString()} per year</p>
                )}
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-md bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
        <h3 className="text-blue-400 text-sm font-semibold mb-2 flex items-center gap-2">
          <Zap size={16} />
          Coming Soon to Pupa
        </h3>
        <p className="text-gray-400 text-xs mb-3">
          We are building more features for you. Here is what is coming:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {upcomingFeatures.map((f) => (
            <div key={f.label} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
              <f.icon size={14} className="text-gray-500" />
              <div>
                <p className="text-gray-300 text-[11px] font-medium">{f.label}</p>
                <p className="text-gray-600 text-[9px]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-3">
          Subscribe now to lock in your price. All future features will be included in your plan.
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <button
          onClick={handleStartTrial}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Start 1-Day Free Trial'}
        </button>

        <button
          onClick={handlePayNow}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Pay Now with Monnify'}
        </button>

        <p className="text-center text-gray-500 text-xs">
          Cancel anytime. No hidden fees. Card payments only.
        </p>
      </div>
    </div>
  );
}