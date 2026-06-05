import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { buildPaymentData, FLUTTERWAVE_CONFIG } from '../flutterwave';
import { Crown, Check, X, AlertCircle, Zap, Gift, Calendar } from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PLANS = {
    basic: {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 2500,
      yearlyPrice: 25000,
      features: [
        'Standard Streaming Quality',
        '30-60 Movie Library',
        'Delayed New Releases (7-14 days)',
        'Light Ads & Sponsored Messages',
        'View-Only Comments',
        'No Downloads',
        'No Exclusive Content'
      ],
      hasAds: true,
      hasDownloads: false,
      quality: 'Standard'
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 4000,
      yearlyPrice: 40000,
      features: [
        '4K Ultra HD Streaming',
        'Unlimited Movie Library',
        'Immediate New Releases',
        'No Ads — Ever',
        'Full Comments & Interaction',
        'Unlimited Downloads',
        'Exclusive Content Access',
        'Early Releases & Voting Power'
      ],
      hasAds: false,
      hasDownloads: true,
      quality: '4K Ultra HD',
      popular: true
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
    setLoading(true);
    setError('');

    try {
      const plan = PLANS[selectedPlan];
      const amount = getPrice(plan);
      const paymentData = buildPaymentData({
        user,
        amount,
        paymentType: 'subscription',
        planId: selectedPlan,
        callbackUrl: window.location.origin + '/profile?payment=success'
      });

      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => {
        window.FlutterwaveCheckout({
          ...paymentData,
          callback: (response) => {
            if (response.status === 'successful') {
              const duration = selectedPeriod === 'yearly' ? 365 : 30;
              const subData = {
                plan: selectedPlan,
                period: selectedPeriod,
                startDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                transactionId: response.transaction_id
              };
              localStorage.setItem('pupa_subscription', JSON.stringify(subData));
              navigate('/');
            } else {
              setError('Payment failed. Please try again.');
            }
            setLoading(false);
          },
          onclose: () => {
            setLoading(false);
            setError('Payment was cancelled. Please try again to continue.');
          }
        });
      };
      document.body.appendChild(script);
    } catch (err) {
      setError('Payment initialization failed. Please try again.');
      setLoading(false);
    }
  };

  const plans = [PLANS.basic, PLANS.premium];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-yellow-400 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 text-sm">Start with a 1-day free trial</p>
      </div>

      {/* Period Toggle */}
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
                {plan.features.slice(0, 4).map((feature, i) => (
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
          {loading ? 'Processing...' : `Pay Now & Subscribe`}
        </button>

        <p className="text-center text-gray-500 text-xs">
          Cancel anytime. No hidden fees. Subscription auto-renews.
        </p>
      </div>
    </div>
  );
}