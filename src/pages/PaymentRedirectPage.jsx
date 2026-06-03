import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft } from 'lucide-react';

export default function PaymentRedirectPage() {
  const navigate = useNavigate();

  const plans = [
    { name: 'Monthly', price: '₦1,500', period: '/month', features: ['HD Streaming', 'No Ads', 'Download Movies'] },
    { name: '3 Months', price: '₦4,000', period: '/3 months', features: ['HD Streaming', 'No Ads', 'Download', 'Early Access'], popular: true },
    { name: 'Yearly', price: '₦12,000', period: '/year', features: ['4K Streaming', 'No Ads', 'Download', 'Early Access', 'Exclusive'] }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4">
      <div className="max-w-md mx-auto pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to App</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h1>
          <p className="text-gray-400 text-sm">Complete your payment securely on our website</p>
        </div>

        <div className="space-y-4 mb-8">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-[#1a1a2e] rounded-xl p-5 border transition-all relative
              ${plan.popular ? 'border-purple-500' : 'border-white/10'}`}>
              {plan.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-600 rounded-full text-[10px] text-white font-semibold">
                  MOST POPULAR
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">{plan.name}</h3>
                <div className="text-right">
                  <span className="text-purple-400 font-bold text-lg">{plan.price}</span>
                  <span className="text-gray-500 text-xs">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-400 text-xs">
                    <div className="w-1 h-1 rounded-full bg-purple-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <a 
                href={`https://pupaoriginals.com/subscribe?plan=${plan.name.toLowerCase().replace(/\s/g, '-')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-purple-600 rounded-xl text-white font-semibold text-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Pay on Website
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-xs mb-2">Secured by Paystack</p>
          <p className="text-gray-600 text-xs">You will be redirected to our secure payment page</p>
        </div>
      </div>
    </div>
  );
}