import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect your email address, profile information, and viewing history to provide personalized recommendations. We also collect payment information through our secure payment processor (Flutterwave).'
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: 'Your data is encrypted and stored securely using Firebase services. We never share your personal information with third parties for marketing purposes. Payment details are handled directly by Flutterwave and never stored on our servers.'
    },
    {
      icon: Database,
      title: 'Data Usage',
      content: 'We use your data to: provide streaming services, process payments, send important notifications, and improve our platform. We may use anonymized viewing data to improve content recommendations.'
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: 'You have the right to: access your data, request deletion of your account and data, opt out of non-essential communications, and export your viewing history. Contact us to exercise these rights.'
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: 'If you have questions about this privacy policy or your data, contact us at: pupastudio69@gmail.com'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16 pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 mb-6">
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
            <p className="text-gray-500 text-xs">Last updated: June 2025</p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <section.icon size={18} className="text-emerald-400" />
                <h2 className="text-white font-semibold text-sm">{section.title}</h2>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-400 text-xs font-medium mb-1">Your trust matters</p>
          <p className="text-gray-400 text-xs">
            Pupa Originals is committed to protecting your privacy. We only collect what we need to provide you with the best streaming experience.
          </p>
        </div>
      </div>
    </div>
  );
}