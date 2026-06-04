import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS, buildPaymentData, FLUTTERWAVE_CONFIG } from '../flutterwave';
import { Crown, Check, X, AlertCircle, Zap, Gift } from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trialActive, setTrialActive] = useState(false);

  // Check if user already has active subscription or trial
  useEffect(() => {
    const checkSub = async () => {
      if (!user) return;
      // In real app, check Firestore for active subscription
      // For now, we'll let them through if they have localStorage flag
      const hasSub = localStorage.getItem('pupa_subscription');
      if (hasSub) {
        navigate('/');
      }
    };
    checkSub();
  }, [user, navigate]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setError('');
  };

  const handleStartTrial = async () => {
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }

    setLoading(true);

    try {
      // Simulate starting free trial
      // In production: create trial in Firestore with expiry date (24 hours from now)
      const trialData = {
        plan: selectedPlan,
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day
        status: 'trial'
      };

      localStorage.setItem('pupa_subscription', JSON.stringify(trialData));

      // Redirect to home
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
      const plan = SUBSCRIPTION_PLANS[selectedPlan];
      const paymentData = buildPaymentData({
        user,
        amount: plan.price,
        paymentType: 'subscription',
        planId: selectedPlan,
        callbackUrl: window.location.origin + '/wallet?payment=success'
      });

      // Load Flutterwave script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.onload = () => {
        window.FlutterwaveCheckout({
          ...paymentData,
          callback: (response) => {
            if (response.status === 'successful') {
              // Save subscription
              const subData = {
                plan: selectedPlan,
                startDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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

  const plans = [
    { ...SUBSCRIPTION_PLANS.basic, id: 'basic' },
    { ...SUBSCRIPTION_PLANS.premium, id: 'premium' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-yellow-400 flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Pupa Originals</h1>
        <p className="text-gray-400 text-sm">Choose your plan to start watching</p>
      </div>

      {/* Free Trial Banner */}
      <div className="w-full max-w-md bg-gradient-to-r from-emerald-500/20 to-yellow-400/20 border border-emerald-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white text-sm font-semibold">1-Day Free Trial</p>
            <p className="text-gray-400 text-xs">Try any plan free for 24 hours. Cancel anytime.</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Plans */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleSelectPlan(plan.id)}
            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
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
                <p className="text-gray-400 text-sm">{plan.quality} • {plan.maxMovies} movies</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPlan === plan.id ? 'border-yellow-400 bg-yellow-400' : 'border-gray-600'
              }`}>
                {selectedPlan === plan.id && <Check className="w-4 h-4 text-black" />}
              </div>
            </div>

            <div className="mb-3">
              <span className="text-2xl font-bold text-white">₦{plan.price.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">/month</span>
            </div>

            <ul className="space-y-2">
              {plan.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={handleStartTrial}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Start 1-Day Free Trial'}
        </button>

        <button
          onClick={handlePayNow}
          disabled={loading || !selectedPlan}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Pay Now & Subscribe'}
        </button>

        <p className="text-center text-gray-500 text-xs">
          You can cancel anytime. No hidden fees.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center gap-2 text-gray-500 text-xs">
        <Gift className="w-4 h-4" />
        <span>Subscription auto-renews monthly</span>
      </div>
    </div>
  );
}