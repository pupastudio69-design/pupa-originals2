import React from 'react';
import { ArrowLeft, Shield, FileText, Lock, Eye, Bell, Globe, CreditCard } from 'lucide-react';

export default function TermsPage({ onBack }) {
  const sections = [
    {
      icon: FileText,
      title: "Terms of Service",
      color: "#16a34a",
      content: `Welcome to Pupa Originals. By accessing or using our platform, you agree to these Terms of Service.

1. ELIGIBILITY
You must be at least 18 years old or have parental consent to use Pupa Originals.

2. ACCOUNT REGISTRATION
You are responsible for maintaining the confidentiality of your account credentials.

3. SUBSCRIPTION & PAYMENTS
- Payments are processed securely through our payment partners
- Subscriptions auto-renew unless cancelled
- Refunds are subject to our refund policy
- Prices vary by region (Nigeria, Ghana, UK, US)

4. CONTENT USAGE
All content on Pupa Originals is protected by copyright. You may not:
- Download or distribute content without authorization
- Share your account with others
- Use content for commercial purposes
- Reverse engineer our platform

5. USER CONDUCT
You agree not to:
- Upload harmful or illegal content
- Harass other users
- Attempt to breach security
- Use automated tools to access the platform`
    },
    {
      icon: Lock,
      title: "Privacy Policy",
      color: "#3b82f6",
      content: `Pupa Originals is committed to protecting your privacy.

1. INFORMATION WE COLLECT
- Account information (name, email, phone)
- Payment information (processed securely)
- Watch history and preferences
- Device information

2. HOW WE USE YOUR DATA
- To provide and improve our services
- To personalize content recommendations
- To process payments
- To send notifications (with your consent)

3. DATA SECURITY
- We use industry-standard encryption
- Firebase Authentication for secure login
- Firestore for secure data storage
- Regular security audits

4. YOUR RIGHTS
- Access your personal data
- Request deletion of your account
- Opt-out of marketing communications
- Update your preferences`
    },
    {
      icon: Eye,
      title: "Cookie Policy",
      color: "#f59e0b",
      content: `Pupa Originals uses cookies and similar technologies.

1. TYPES OF COOKIES
- Essential cookies: Required for platform functionality
- Preference cookies: Remember your settings
- Analytics cookies: Help us improve the platform
- Marketing cookies: Used for targeted advertising

2. HOW TO MANAGE COOKIES
You can control cookies through your browser settings. Note that disabling essential cookies may affect platform functionality.

3. THIRD-PARTY COOKIES
We use trusted third-party services (Firebase, Google Analytics) that may set their own cookies.`
    },
    {
      icon: CreditCard,
      title: "Refund Policy",
      color: "#ef4444",
      content: `Pupa Originals refund policy:

1. SUBSCRIPTION REFUNDS
- Full refund within 7 days of purchase if unused
- Partial refund for unused portion (prorated)
- No refund after 30 days of usage

2. GIFT COIN PURCHASES
- Gift coin purchases are non-refundable
- Unused coins remain in your account

3. HOW TO REQUEST A REFUND
Contact support@pupaoriginals.tv with your transaction ID.

4. PROCESSING TIME
Refunds are processed within 5-10 business days to your original payment method.`
    },
    {
      icon: Globe,
      title: "Regional Terms",
      color: "#8b5cf6",
      content: `Pupa Originals operates in multiple regions with specific terms:

NIGERIA (NG)
- Currency: Nigerian Naira (₦)
- Payment: Paystack, Flutterwave
- Content rating: NFVCB guidelines apply

GHANA (GH)
- Currency: Ghana Cedi (₵)
- Payment: Paystack, Mobile Money
- Content rating: GAC guidelines apply

UNITED KINGDOM (UK)
- Currency: British Pound (£)
- Payment: Stripe, PayPal
- Content rating: BBFC guidelines apply

UNITED STATES (US)
- Currency: US Dollar ($)
- Payment: Stripe, PayPal
- Content rating: MPAA guidelines apply`
    },
    {
      icon: Bell,
      title: "Push Notifications",
      color: "#ec4899",
      content: `By using Pupa Originals, you may receive push notifications for:

1. NEW CONTENT ALERTS
- New movie releases
- New episodes of series you follow
- Exclusive Pupa Originals premieres

2. ACCOUNT NOTIFICATIONS
- Payment confirmations
- Subscription renewals
- Security alerts

3. MARKETING (Optional)
- Special offers and promotions
- Personalized recommendations
- Partner offers (with consent)

4. HOW TO MANAGE
You can manage notification preferences in Settings > Notifications. You may also disable push notifications through your device settings.`
    },
  ];

  return (
    <div className="min-h-screen bg-pupa-bg pt-16 pb-24 page-enter">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-center gap-3 border-b border-white/5">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full glass-dark flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <h1 className="font-display font-semibold text-xl text-white">Terms & Conditions</h1>
          <p className="text-gray-500 text-xs">Last updated: June 2025</p>
        </div>
      </div>

      {/* Intro */}
      <div className="px-5 py-4">
        <div className="rounded-xl p-4 bg-emerald-900/20 border border-emerald-800/30 flex items-start gap-3">
          <Shield size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-400 text-sm font-medium mb-1">Your Privacy Matters</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pupa Originals is committed to protecting your data. We use Firebase for secure authentication 
              and Firestore for encrypted data storage. Your information is never sold to third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="p-4 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${section.color}15` }}
                >
                  <Icon size={18} style={{ color: section.color }} />
                </div>
                <h2 className="text-white text-sm font-body font-semibold">{section.title}</h2>
              </div>
              <div className="px-4 pb-4">
                <div className="text-gray-400 text-xs leading-relaxed whitespace-pre-line font-body">
                  {section.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pt-6 pb-4 text-center">
        <p className="text-gray-600 text-xs">
          © 2025 Pupa Media. All rights reserved.
        </p>
        <p className="text-gray-700 text-[10px] mt-1">
          Pupa Originals v1.0.0
        </p>
      </div>
    </div>
  );
}