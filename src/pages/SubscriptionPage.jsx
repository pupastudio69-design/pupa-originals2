import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { 
  ArrowLeft, Crown, Check, Clock, AlertCircle, 
  CreditCard, Shield, Zap
} from 'lucide-react';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { subscription, isSubscribed, isPremium, isTrial, daysLeft } = useSubscription();

  const getStatusColor = () => {
    if (isPremium()) return 'text-yellow-400';
    if (isTrial()) return 'text-emerald-400';
    if (isSubscribed()) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getStatusText = () => {
    if (isPremium()) return 'Premium Active';
    if (isTrial()) return 'Free Trial';
    if (isSubscribed()) return 'Basic Active';
    return 'No Active Plan';
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/me')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Subscription</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/20 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center">
              <Crown size={32} className="text-yellow-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {getStatusText()}
              </p>
              <p className="text-gray-400 text-sm">
                {isSubscribed() ? `${daysLeft()} days remaining` : 'Subscribe to start watching'}
              </p>
            </div>
          </div>

          {subscription && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="text-white capitalize">{subscription.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Period</span>
                <span className="text-white capitalize">{subscription.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Started</span>
                <span className="text-white">
                  {new Date(subscription.startDate).toLocaleDateString('en-NG')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expires</span>
                <span className="text-white">
                  {new Date(subscription.expiryDate).toLocaleDateString('en-NG')}
                </span>
              </div>
              {subscription.amountPaid > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Paid</span>
                  <span className="text-white">₦{subscription.amountPaid.toLocaleString()}</span>
                </div>
              )}
              {subscription.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference</span>
                  <span className="text-gray-500 text-xs">{subscription.paymentReference}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan Benefits */}
        <h3 className="text-white font-bold mb-3">Your Benefits</h3>
        <div className="space-y-2 mb-6">
          {isPremium() ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Zap size={18} className="text-yellow-400" />
                <span className="text-white text-sm">4K Ultra HD Streaming</span>
                <Check size={16} className="text-emerald-400 ml-auto" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Crown size={18} className="text-yellow-400" />
                <span className="text-white text-sm">Unlimited Downloads</span>
                <Check size={16} className="text-emerald-400 ml-auto" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Shield size={18} className="text-yellow-400" />
                <span className="text-white text-sm">No Ads</span>
                <Check size={16} className="text-emerald-400 ml-auto" />
              </div>
            </>
          ) : isTrial() ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Clock size={18} className="text-emerald-400" />
                <span className="text-white text-sm">Full Premium Access (24 hours)</span>
                <Check size={16} className="text-emerald-400 ml-auto" />
              </div>
            </>
          ) : (
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <p className="text-gray-400 text-sm">No active subscription</p>
              <p className="text-gray-500 text-xs mt-1">Subscribe to unlock content</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!isPremium() && (
            <button
              onClick={() => navigate('/welcome')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all"
            >
              {isTrial() ? 'Upgrade to Premium' : 'Subscribe Now'}
            </button>
          )}

          <button
            onClick={() => navigate('/support')}
            className="w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={18} className="text-gray-400" />
            Billing Issues?
          </button>
        </div>

        {/* Cancel Notice */}
        {isSubscribed() && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-xs text-center">
              To cancel your subscription, contact support at pupastudio69@gmail.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}