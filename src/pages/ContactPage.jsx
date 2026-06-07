import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone, Globe } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Contact Us</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <Globe size={32} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-bold">Pupa Originals</h2>
          <p className="text-gray-400 text-sm">Premium African Streaming</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Mail size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="text-white text-sm font-medium">pupastudio69@gmail.com</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Phone size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Phone</p>
              <p className="text-white text-sm font-medium">Coming Soon</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MapPin size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Address</p>
              <p className="text-white text-sm font-medium">Enugu, Nigeria</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white text-sm font-medium mb-2">Business Hours</p>
            <div className="space-y-1 text-gray-400 text-xs">
              <p>Monday - Friday: 9:00 AM - 6:00 PM (WAT)</p>
              <p>Saturday: 10:00 AM - 4:00 PM (WAT)</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 rounded-xl border border-yellow-500/20">
          <p className="text-yellow-400 text-sm font-medium mb-1">For Creators</p>
          <p className="text-gray-400 text-xs">
            Want to feature your content on Pupa? Visit the Creator Corner or email us directly.
          </p>
        </div>
      </div>
    </div>
  );
}
