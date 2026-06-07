import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Terms & Conditions</h1>
          <div className="w-5" />
        </div>
      </div>
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
            <FileText size={24} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-white font-bold">Pupa Originals</p>
            <p className="text-gray-500 text-xs">Last updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Pupa Originals, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">2. Subscription Plans</h2>
            <p>We offer Basic and Premium subscription plans. Payments are processed securely through Monnify. All subscriptions auto-renew unless cancelled.</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Basic: ₦2,500/month — Standard quality, limited downloads</li>
              <li>Premium: ₦4,000/month — 4K quality, unlimited downloads, no ads</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">3. Free Trial</h2>
            <p>New users may receive a 1-day free trial. The trial automatically converts to a paid subscription unless cancelled before expiry.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">4. Content & Copyright</h2>
            <p>All content on Pupa Originals is protected by copyright. Users may not download, copy, or distribute content without permission. We partner with creators and rights holders to provide legal content.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">5. User Conduct</h2>
            <p>Users agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Share account credentials</li>
              <li>Upload illegal or harmful content</li>
              <li>Harass other users in comments or reviews</li>
              <li>Use automated tools to access the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">6. Refunds</h2>
            <p>Refunds are processed on a case-by-case basis. Contact support within 7 days of billing for refund requests.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">7. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold mb-2">8. Contact</h2>
            <p>For questions about these terms, contact us at:</p>
            <p className="text-yellow-400 mt-1">pupastudio69@gmail.com</p>
          </section>
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