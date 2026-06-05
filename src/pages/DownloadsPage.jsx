import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Bell, ArrowLeft, Wifi, Clock, Film } from 'lucide-react';

export default function DownloadsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-6 pb-24">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <Download className="w-10 h-10 text-emerald-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-3">Downloads Coming Soon</h1>

        {/* Message */}
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Offline downloads will allow you to watch movies without internet in future updates.
        </p>

        {/* Future Benefits */}
        <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
          <h3 className="text-white text-sm font-semibold mb-3">Future Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                <Wifi className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm">Basic Plan</p>
                <p className="text-gray-500 text-xs">Limited downloads</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Download className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm">Premium Plan</p>
                <p className="text-gray-500 text-xs">Unlimited downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notify Button */}
        <button className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 mb-4">
          <Bell className="w-5 h-5" />
          Notify Me When Available
        </button>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full py-3.5 rounded-xl bg-white/5 text-gray-400 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}