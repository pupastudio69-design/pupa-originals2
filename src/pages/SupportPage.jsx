import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, MessageSquare, Mail, Phone, Check, AlertTriangle } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I start my free trial?',
      a: 'Sign up and select any plan on the Welcome page. Your 1-day free trial starts immediately. No payment required.'
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, you can cancel anytime. Go to Profile > Membership > Cancel Subscription. You will keep access until your current period ends.'
    },
    {
      q: 'What is included in Premium?',
      a: 'Premium includes: 4K streaming, unlimited movie library, no ads, immediate new releases, Gold PUPA badge, and priority support.'
    },
    {
      q: 'Why can not I download movies?',
      a: 'Downloads are coming soon. Click "Notify Me" on the Downloads tab and we will let you know when it is available.'
    },
    {
      q: 'How do I change my profile name?',
      a: 'Go to Profile > Edit Profile. You can change your display name and upload a profile photo.'
    },
    {
      q: 'What are PUPA badges?',
      a: 'PUPA badges show your membership status. Silver = Basic plan. Gold = Premium plan. These are not verification badges.'
    }
  ];

  const handleSubmit = () => {
    if (!issue.trim()) return;
    console.log('Support issue:', issue);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setIssue(''); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16 pb-24">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 mb-6">
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Help & Support</h1>
            <p className="text-gray-500 text-xs">We are here to help</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a href="mailto:pupastudio69@gmail.com" className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
            <Mail className="w-5 h-5 text-emerald-400" />
            <span className="text-white text-xs font-medium">Email Us</span>
            <span className="text-gray-500 text-[10px]">pupastudio69@gmail.com</span>
          </a>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <span className="text-white text-xs font-medium">WhatsApp</span>
            <span className="text-gray-500 text-[10px]">Coming Soon</span>
          </div>
        </div>

        {/* FAQs */}
        <h2 className="text-white font-semibold text-sm mb-3">Frequently Asked Questions</h2>
        <div className="space-y-2 mb-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Submit Issue */}
        <h2 className="text-white font-semibold text-sm mb-3">Report an Issue</h2>
        {!submitted ? (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe your issue or question..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500 resize-none mb-3"
              rows={4}
            />
            <button
              onClick={handleSubmit}
              disabled={!issue.trim()}
              className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} />
              Submit Ticket
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm">Ticket Submitted!</p>
            <p className="text-gray-400 text-xs">We will get back to you soon.</p>
          </div>
        )}

        <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-400 text-xs font-medium">Response Time</p>
          </div>
          <p className="text-gray-400 text-xs">
            We typically respond within 24-48 hours. Premium members get priority support.
          </p>
        </div>
      </div>
    </div>
  );
}