
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_PLANS, buildPaymentData } from '../flutterwave';
import { Check, Crown, Star, Zap, ArrowLeft, Sparkles } from 'lucide-react';

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent redirect if already on welcome page
  useEffect(() => {
    // Only redirect if user has active subscription and is NOT on welcome page
    const sub = localStorage.getItem('pupa_subscription');
    if (sub) {
      try {
        const data = JSON.parse(sub);
        const now = new Date();
        const expiry = new Date(data.expiryDate);
        if (expiry > now) {
          // User has active sub, but check if they came from signup or manual navigation
          // Don't auto-redirect from welcome page - let them choose to upgrade
        }
      } catch {}
    }
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const plan = SUBSCRIPTION_PLANS[selectedPlan];
      const isYearly = billingPeriod === 'yearly';
      const amount = isYearly ? (selectedPlan === 'premium' ? 40000 : 25000) : plan.price;
      const period = isYearly ? 'year' : 'month';

      const paymentData = buildPaymentData({
        user,
        amount: amount,
        email: user?.email,
        name: user?.displayName,
        paymentType: 'subscription',
        planId: selectedPlan,
      });

      // Open Flutterwave checkout
      if (window.FlutterwaveCheckout) {
        window.FlutterwaveCheckout({
          ...paymentData,
          callback: function(response) {
            console.log('Payment successful:', response);

            // Save subscription
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + (isYearly ? 365 : 30));

            localStorage.setItem('pupa_subscription', JSON.stringify({
              planId: selectedPlan,
              plan: selectedPlan,
              status: 'active',
              expiryDate: expiryDate.toISOString(),
              period: billingPeriod,
              transactionId: response.transaction_id,
            }));

            alert('Payment successful! Welcome to Pupa ' + plan.name);
            navigate('/');
          },
          onclose: function() {
            setLoading(false);
            console.log('Payment modal closed');
          }
        });
      } else {
        // Fallback: redirect to Flutterwave payment link
        const txRef = paymentData.tx_ref;
        const publicKey = paymentData.public_key;
        const redirectUrl = encodeURIComponent(window.location.origin + '/welcome?payment=success&plan=' + selectedPlan + '&period=' + billingPeriod);

        const flutterwaveUrl = `https://checkout.flutterwave.com/v3/hosted/pay?public_key=${publicKey}&tx_ref=${txRef}&amount=${amount}&currency=NGN&payment_options=card&redirect_url=${redirectUrl}&customer[email]=${encodeURIComponent(user?.email || '')}&customer[name]=${encodeURIComponent(user?.displayName || '')}&customizations[title]=Pupa%20Originals%20Subscription&customizations[description]=Subscribe%20to%20${selectedPlan}%20plan`;

        window.location.href = flutterwaveUrl;
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handleFreeTrial = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 1 day free trial

    localStorage.setItem('pupa_subscription', JSON.stringify({
      planId: selectedPlan,
      plan: selectedPlan,
      status: 'trial',
      expiryDate: expiryDate.toISOString(),
      period: billingPeriod,
    }));

    alert('Free trial started! You have 24 hours of full access.');
    navigate('/');
  };

  const getPrice = () => {
    if (billingPeriod === 'yearly') {
      return selectedPlan === 'premium' ? 40000 : 25000;
    }
    return SUBSCRIPTION_PLANS[selectedPlan].price;
  };

  const getSavings = () => {
    if (billingPeriod === 'yearly') {
      const monthlyTotal = SUBSCRIPTION_PLANS[selectedPlan].price * 12;
      const yearlyPrice = selectedPlan === 'premium' ? 40000 : 25000;
      return monthlyTotal - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 mb-4">
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h1>
        <p className="text-gray-400 text-sm">Start your 1-day free trial today</p>
      </div>

      {/* Billing Period Toggle */}
      <div className="px-5 mb-6">
        <div className="flex rounded-xl bg-white/5 p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'monthly' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === 'yearly' 
                ? 'bg-emerald-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly {billingPeriod === 'yearly' && (
              <span className="text-xs bg-yellow-400 text-black px-1.5 py-0.5 rounded ml-1">
                Save ₦{getSavings().toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="px-5 space-y-4 mb-6">
        {/* Basic Plan */}
        <button
          onClick={() => setSelectedPlan('basic')}
          className={`w-full p-5 rounded-2xl text-left transition-all border ${
            selectedPlan === 'basic'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-emerald-400" />
              <span className="text-white font-bold">Basic</span>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-lg">₦{getPrice().toLocaleString()}</span>
              <span className="text-gray-400 text-xs block">/{billingPeriod}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {SUBSCRIPTION_PLANS.basic.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-400 text-xs">
                <Check size={14} className="text-emerald-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </button>

        {/* Premium Plan */}
        <button
          onClick={() => setSelectedPlan('premium')}
          className={`w-full p-5 rounded-2xl text-left transition-all border relative ${
            selectedPlan === 'premium'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className="absolute -top-2 right-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            POPULAR
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-yellow-400" />
              <span className="text-white font-bold">Premium</span>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-lg">₦{getPrice().toLocaleString()}</span>
              <span className="text-gray-400 text-xs block">/{billingPeriod}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {SUBSCRIPTION_PLANS.premium.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-400 text-xs">
                <Check size={14} className="text-yellow-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 mb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (
            <>
              <Zap size={18} />
              Subscribe Now — ₦{getPrice().toLocaleString()}/{billingPeriod}
            </>
          )}
        </button>

        <button
          onClick={handleFreeTrial}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50"
        >
          Start 1-Day Free Trial
        </button>
      </div>

      {/* Coming Soon Notice */}
      <div className="px-5 pb-8">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-xs text-center">
            <span className="font-bold">Coming Soon:</span> Comments, downloads, wallet, and rewards. 
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}