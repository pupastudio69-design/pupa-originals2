import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { CreditCard, Zap } from 'lucide-react';

const PAYSTACK_PUBLIC_KEY = "pk_test_0ff3fe8f6d3c8b18add73f494594e74d053e3f34";

export default function PaystackPayment({ 
  email, 
  amount, 
  type = 'topup',
  plan = 'monthly',
  onSuccess, 
  onClose,
  metadata = {}
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = {
    reference: `${type}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
    email: email || 'customer@pupaoriginals.com',
    amount: amount * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: type
        },
        {
          display_name: "Plan",
          variable_name: "plan",
          value: plan
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    if (!email) {
      setError('Please sign in to make a payment');
      return;
    }
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setLoading(true);
    setError('');
    
    initializePayment(
      (response) => {
        setLoading(false);
        console.log('Payment successful:', response);
        if (onSuccess) onSuccess(response);
      },
      (closeResponse) => {
        setLoading(false);
        console.log('Payment closed:', closeResponse);
        if (onClose) onClose(closeResponse);
      }
    );
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {type === 'subscription' ? 'Subscribe to Premium' : 'Top Up Wallet'}
            </h3>
            <p className="text-gray-400 text-xs">
              {type === 'subscription' 
                ? `Unlock unlimited access - ${plan}` 
                : 'Add funds to your wallet'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-gray-400 text-sm">Amount</span>
          <span className="text-white font-bold text-lg">₦{amount?.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-white/10">
          <span className="text-gray-400 text-sm">Fee</span>
          <span className="text-gray-400 text-sm">₦{Math.ceil(amount * 0.015 + 100).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <span className="text-white font-semibold">Total</span>
          <span className="text-green-400 font-bold text-xl">
            ₦{Math.ceil(amount * 1.015 + 100).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold 
                   hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Zap className="w-5 h-5" />
            {type === 'subscription' ? 'Subscribe Now' : 'Pay Now'}
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <span className="text-gray-500 text-xs">Secured by Paystack</span>
      </div>
    </div>
  );
}