import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeBilling, subscribe } from '../services/billing';
import { Check, Crown, Star, Zap, ArrowLeft } from 'lucide-react';

const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    productIds: {
      monthly: 'pupa_basic_monthly',
      yearly: 'pupa_basic_yearly'
    },
    features: [
      'Standard Streaming Quality',
      '30-60 Movie Library',
      'Delayed New Releases (7-14 days)',
      'Light Ads & Sponsored Messages',
      'View-Only Comments',
      'No Downloads',
      'No Exclusive Content',
      'No Early Releases',
      'Silver PUPA Badge on Profile'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    productIds: {
      monthly: 'pupa_premium_monthly',
      yearly: 'pupa_premium_yearly'
    },
    features: [
      '4K Ultra HD Streaming',
      'Unlimited Movie Library',
      'Immediate New Releases',
      'No Ads — Ever',
      'Full Comments & Interaction',
      'Unlimited Downloads',
      'Exclusive Content Access',
      'Early Releases & Voting Power',
      'BTS Content & Creator Gifts',
      'Gold PUPA Badge on Profile',
      'Priority Support'
    ],
    popular: true
  }
};

export default function WelcomePage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const items = await initializeBilling();
    const map = {};
    items.forEach(p => {
      map[p.productId] = p;
    });
    setProducts(map);
  };

  const getProductId = () => {
    return PLANS[selectedPlan].productIds[billingPeriod];
  };

  const getPrice = () => {
    const productId = getProductId();
    const product = products[productId];
    if (product) {
      return product.price;
    }
    // Fallback prices while loading
    if (billingPeriod === 'yearly') {
      return selectedPlan === 'premium' ? '₦40,000' : '₦25,000';
    }
    return selectedPlan === 'premium' ? '₦4,000' : '₦2,500';
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    const productId = getProductId();
    const result = await subscribe(productId);

    if (result.success) {
      localStorage.setItem('pupa_subscription', JSON.stringify({
        planId: selectedPlan,
        period: billingPeriod,
        status: 'active',
        purchaseToken: result.data.purchaseToken,
        productId: productId
      }));
      alert('Subscription successful!');
      navigate('/');
    } else {
      setError(result.error || 'Payment failed. Please try again.');
    }

    setLoading(false);
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
        <p className="text-gray-400 text-sm">Subscribe via Google Play Billing</p>
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
            Yearly
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
              <span className="text-white font-bold text-lg">{getPrice()}</span>
              <span className="text-gray-400 text-xs block">/{billingPeriod}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {PLANS.basic.features.slice(0, 4).map((feature, i) => (
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
              <span className="text-white font-bold text-lg">{getPrice()}</span>
              <span className="text-gray-400 text-xs block">/{billingPeriod}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {PLANS.premium.features.slice(0, 4).map((feature, i) => (
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

      {/* Subscribe Button */}
      <div className="px-5 pb-8">
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : (
            <>
              <Zap size={18} />
              Subscribe with Google Play
            </>
          )}
        </button>
        <p className="text-gray-600 text-xs text-center mt-3">
          Payments processed securely by Google Play Billing
        </p>
      </div>
    </div>
  );
}