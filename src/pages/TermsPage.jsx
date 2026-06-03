import React from 'react';
import { X, Shield, FileText, Cookie, RefreshCw, Mail } from 'lucide-react';

export default function TermsPage({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#041b11] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Terms & Conditions</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">1. Terms of Service</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Welcome to Pupa Originals. By accessing or using our platform, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">2. User Accounts</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality 
              of your account credentials and for all activities that occur under your account. You must be at least 18 years 
              old to use our services.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">3. Content & Streaming</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              All movies, shows, and content on Pupa Originals are curated and uploaded exclusively by our internal team. 
              Users cannot upload content. We reserve the right to add, remove, or modify content at any time. 
              Content is provided for personal, non-commercial viewing only.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Cookie size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">4. Privacy & Data</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              We collect and process personal data in accordance with our Privacy Policy. This includes account information, 
              watch history, and payment details. We use industry-standard security measures to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">5. Subscriptions & Payments</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium subscriptions are billed according to your selected plan. Payments are processed securely through 
              our payment partners. You may cancel your subscription at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">6. Contact Us</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              For questions about these terms, contact us at: support@pupaoriginals.com
            </p>
          </section>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-500 text-xs text-center">
              Last updated: June 2025 · Pupa Originals v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}