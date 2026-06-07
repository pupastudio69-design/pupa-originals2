import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, CreditCard, Users, Ban, RotateCcw, Mail } from 'lucide-react';

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
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="mb-3">
              By accessing or using Pupa Originals, you agree to be bound by these Terms and Conditions. 
              If you do not agree to all terms, please do not use our services.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued use after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">2. Subscription & Billing</h2>
            </div>
            <p className="mb-3">
              Pupa Originals offers the following subscription plans:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-400">
              <li>Basic Plan: ₦2,500/month — Standard streaming, limited downloads</li>
              <li>Premium Plan: ₦4,000/month — 4K streaming, unlimited downloads, no ads</li>
            </ul>
            <p className="mb-3">
              Payments are processed securely through Monnify. All subscriptions auto-renew unless cancelled.
            </p>
            <p>
              A 1-day free trial is available for new users. The trial converts to a paid subscription 
              unless cancelled before expiry.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">3. Content & Copyright</h2>
            </div>
            <p className="mb-3">
              All content on Pupa Originals is protected by copyright and other intellectual property laws.
            </p>
            <p className="mb-3">
              Users may not download, copy, reproduce, distribute, or create derivative works from 
              any content without explicit written permission.
            </p>
            <p>
              We partner with content creators and rights holders to provide legal streaming services.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">4. User Conduct</h2>
            </div>
            <p className="mb-3">Users agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-400">
              <li>Share account credentials with others</li>
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Use automated tools, bots, or scrapers</li>
              <li>Circumvent security measures or access controls</li>
              <li>Engage in fraudulent payment activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Ban size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">5. Account Termination</h2>
            </div>
            <p className="mb-3">
              We reserve the right to suspend or terminate accounts that violate these terms, 
              without prior notice or refund.
            </p>
            <p>
              Users may delete their account at any time by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">6. Refunds</h2>
            </div>
            <p className="mb-3">
              Refund requests are processed on a case-by-case basis.
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-400">
              <li>Contact support within 7 days of billing for refund requests</li>
              <li>No refunds for partial months or unused trial periods</li>
              <li>Technical issues must be reported within 48 hours</li>
            </ul>
          </section>

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={18} className="text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">7. Contact Information</h2>
            </div>
            <p className="mb-3">
              For questions about these terms, contact us:
            </p>
            <p className="text-yellow-400">pupastudio69@gmail.com</p>
            <p className="text-gray-400 mt-2">Enugu, Nigeria</p>
          </section>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-gray-400 text-xs">
              By using Pupa Originals, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}