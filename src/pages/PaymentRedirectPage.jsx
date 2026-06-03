import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function PaymentRedirectPage() {
  const handlePayment = () => {
    // Redirect to your website for payment
    window.location.href = 'https://pupaoriginals.com/subscribe';
  };

  return (
    <div className="min-h-screen bg-pupa-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <ExternalLink size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Complete Payment</h2>
        <p className="text-gray-400 text-sm mb-6">
          To comply with Play Store policies, subscription payments are processed on our secure website.
        </p>
        <button 
          onClick={handlePayment}
          className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
        >
          Go to Payment Page
        </button>
        <p className="text-gray-600 text-xs mt-4">
          You'll be redirected to pupaoriginals.com
        </p>
      </div>
    </div>
  );
}