import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import {
  User, Settings, Crown, ChevronRight, LogOut, Camera, Mail,
  Star, Clock, Gift, Download, Wallet, HelpCircle, FileText,
  Shield, Bell, X, Edit3, Check, MessageSquare, ThumbsUp, AlertTriangle
} from 'lucide-react';

// Settings Overlay
function SettingsOverlay({ onClose }) {
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-semibold">Settings</h2>
        <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-6">
          <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Playback</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-white text-sm">Auto-play next movie</span>
              <button onClick={() => setAutoPlay(!autoPlay)} className="w-11 h-6 rounded-full bg-emerald-500 relative">
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: autoPlay ? 'translateX(20px)' : 'translateX(2px)' }} />
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Appearance</h3>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-gray-400 text-sm">Dark mode is always on for the best viewing experience</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Notifications</h3>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span className="text-white text-sm">Push notifications</span>
            <button onClick={() => setNotifications(!notifications)} className="w-11 h-6 rounded-full bg-emerald-500 relative">
              <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: notifications ? 'translateX(20px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-gray-400 text-sm">Pupa v1.0.0</p>
          <p className="text-gray-600 text-xs mt-1">© 2025 Pupa Originals</p>
        </div>
      </div>
    </div>
  );
}

// Edit Profile Overlay
function EditProfileOverlay({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name.trim() });
      onUpdate(name.trim());
      onClose();
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-semibold">Edit Profile</h2>
        <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4">
          <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Bio (Coming Soon)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            disabled
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm resize-none opacity-50"
            rows={3}
          />
          <p className="text-gray-600 text-xs mt-1">Bio editing will be available in a future update</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Feedback Overlay
function FeedbackOverlay({ onClose }) {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    // In production: save to Firestore
    console.log('Feedback submitted:', feedback);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-semibold">Feedback & Suggestions</h2>
        <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!submitted ? (
          <>
            <p className="text-gray-400 text-sm mb-4">Help us improve Pupa Originals. Your feedback matters.</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you like? What should we improve?"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none mb-4"
              rows={6}
            />
            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50"
            >
              Submit Feedback
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <ThumbsUp className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-bold">Thank you!</p>
            <p className="text-gray-400 text-sm">Your feedback has been received.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Help Overlay
function HelpOverlay({ onClose }) {
  const faqs = [
    { q: 'How do I start my free trial?', a: 'Sign up and select any plan. Your 1-day free trial starts immediately.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your Profile > Membership.' },
    { q: 'What is included in Premium?', a: '4K streaming, unlimited downloads, no ads, and exclusive content.' },
    { q: 'How do I download movies?', a: 'Downloads are coming soon. We will notify you when available.' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-semibold">Help & Support</h2>
        <button onClick={onClose}><X size={24} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5">
              <p className="text-white text-sm font-medium mb-1">{faq.q}</p>
              <p className="text-gray-400 text-xs">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-400 text-sm font-medium mb-1">Need more help?</p>
          <p className="text-gray-400 text-xs">Contact us at support@pupaoriginals.com</p>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ onTermsClick }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Get subscription status
  const getSubscription = () => {
    const sub = localStorage.getItem('pupa_subscription');
    if (!sub) return null;
    try { return JSON.parse(sub); } catch { return null; }
  };

  const subscription = getSubscription();
  const isPremium = subscription?.plan === 'premium';
  const isTrial = subscription?.status === 'trial';
  const isBasic = subscription?.plan === 'basic' && !isTrial;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.photoURL) setProfileImage(user.photoURL);
      if (user?.displayName) setDisplayName(user.displayName);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `profiles/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(currentUser, { photoURL: url });
      setProfileImage(url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('pupa_subscription');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getUserName = () => displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pupa Member';
  const getAvatarLetter = () => getUserName().charAt(0).toUpperCase();

  // Rewards and referral data
  const points = parseInt(localStorage.getItem('pupa_points') || '0');
  const referrals = parseInt(localStorage.getItem('pupa_referral_count') || '0');
  const tier = points >= 1000 ? 'Platinum' : points >= 500 ? 'Gold' : points >= 200 ? 'Silver' : 'Bronze';

  // Small checkmark badge next to name like X/Twitter verification
  const MembershipBadge = () => {
    if (!subscription) return null;
    if (isPremium || isTrial) {
      return (
        <span className="inline-flex items-center ml-1" title="Gold Member">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
            <path d="M8 12l3 3 5-6" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center ml-1" title="Silver Member">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M8 12l3 3 5-6" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </span>
    );
  };

  const MENU_SECTIONS = [
    {
      title: 'Account',
      items: [
        { 
          icon: User, 
          label: 'Edit Profile', 
          sub: 'Name, photo, bio', 
          onClick: () => setActiveOverlay('editProfile')
        },
        { 
          icon: Mail, 
          label: 'Email', 
          sub: currentUser?.email || 'Not set', 
          onClick: () => {}
        },
      ]
    },
    {
      title: 'Membership',
      items: [
        { 
          icon: Crown, 
          label: 'Current Plan', 
          sub: isPremium ? 'Premium (Active)' : isTrial ? 'Free Trial' : 'Basic (Free)',
          onClick: () => navigate('/welcome')
        },
        { 
          icon: Star, 
          label: 'Upgrade Plan', 
          sub: 'Get Premium benefits',
          onClick: () => navigate('/welcome')
        },
        { 
          icon: Shield, 
          label: 'Billing Information', 
          sub: 'Manage payment methods',
          onClick: () => {}
        },
      ]
    },
    {
      title: 'Rewards & Referrals',
      items: [
        { 
          icon: Gift, 
          label: 'Rewards', 
          sub: `${points} points · ${tier} tier`, 
          onClick: () => navigate('/rewards')
        },
        { 
          icon: Star, 
          label: 'Referrals', 
          sub: `${referrals} friends invited`, 
          onClick: () => navigate('/referrals')
        },
        { 
          icon: Wallet, 
          label: 'Wallet', 
          sub: 'Coming Soon', 
          disabled: true, 
          onClick: () => {} 
        },
        { 
          icon: Download, 
          label: 'Downloads', 
          sub: 'Manage offline content', 
          onClick: () => navigate('/downloads')
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: MessageSquare, 
          label: 'Feedback & Suggestions', 
          sub: 'Help us improve', 
          onClick: () => setActiveOverlay('feedback')
        },
        { 
          icon: HelpCircle, 
          label: 'Help & Support', 
          sub: 'Get assistance', 
          onClick: () => navigate('/support')
        },
        { 
          icon: FileText, 
          label: 'Privacy Policy', 
          sub: 'How we protect your data', 
          onClick: () => navigate('/privacy')
        },
        { 
          icon: FileText, 
          label: 'Terms & Conditions', 
          sub: 'Legal information', 
          onClick: () => onTermsClick?.()
        },
      ]
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-16 pb-24">
      {/* Overlays */}
      {activeOverlay === 'settings' && <SettingsOverlay onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'editProfile' && (
        <EditProfileOverlay 
          user={currentUser} 
          onClose={() => setActiveOverlay(null)} 
          onUpdate={(name) => setDisplayName(name)}
        />
      )}
      {activeOverlay === 'feedback' && <FeedbackOverlay onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'help' && <HelpOverlay onClose={() => setActiveOverlay(null)} />}

      <div className="px-5 pt-4">
        {/* Profile Header */}
        <div className="rounded-2xl p-5 mb-6 bg-gradient-to-br from-emerald-900/30 to-[#0a0a1a] border border-emerald-500/20">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40" />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl text-white bg-gradient-to-br from-emerald-500 to-emerald-800">
                  {getAvatarLetter()}
                </div>
              )}
              <label className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}>
                <Camera size={14} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>

            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="font-semibold text-xl text-white">{getUserName()}</h2>
                <MembershipBadge />
              </div>
              <p className="text-gray-400 text-xs">{currentUser?.email || 'Not signed in'}</p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">
                  {isPremium ? 'Premium Active' : isTrial ? 'Free Trial (1 Day)' : 'Basic Plan'}
                </p>
                <p className="text-gray-500 text-xs">
                  {isPremium ? 'Unlimited access to all content' : isTrial ? 'Full access for 24 hours' : 'Limited access - Upgrade for more'}
                </p>
              </div>
              {!isPremium && (
                <button 
                  onClick={() => navigate('/welcome')}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold"
                >
                  {isTrial ? 'Upgrade' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>

          {/* Upcoming Features Notice */}
          <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-blue-400 text-xs">
              <span className="font-bold">Coming Soon:</span> Comments, downloads, wallet, and rewards. Stay tuned!
            </p>
          </div>
        </div>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-1">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${
                    item.disabled 
                      ? 'bg-white/5 opacity-50 cursor-not-allowed' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className={item.disabled ? 'text-gray-500' : 'text-emerald-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.disabled ? 'text-gray-500' : 'text-white'}`}>{item.label}</p>
                    <p className="text-gray-500 text-xs">{item.sub}</p>
                  </div>
                  {!item.disabled && <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Settings Button */}
        <button
          onClick={() => setActiveOverlay('settings')}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all mb-4"
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Settings size={18} className="text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Settings</p>
            <p className="text-gray-500 text-xs">App preferences</p>
          </div>
          <ChevronRight size={16} className="text-gray-600" />
        </button>

        {/* Log out */}
        <button
          onClick={handleLogout}
          className="w-full p-3.5 rounded-xl border border-red-500/20 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <p className="text-center text-gray-700 text-xs mt-6">
          Pupa Originals v1.0.0
        </p>
      </div>
    </div>
  );
}