import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import {
  User, Settings, Crown, ChevronRight, LogOut, Camera, Mail,
  Star, Clock, Gift, Download, Wallet, HelpCircle, FileText,
  Shield, Globe, Bell, X
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

export default function ProfilePage({ onTermsClick }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Get subscription status from localStorage
  const getSubscription = () => {
    const sub = localStorage.getItem('pupa_subscription');
    if (!sub) return null;
    try {
      return JSON.parse(sub);
    } catch { return null; }
  };

  const subscription = getSubscription();
  const isPremium = subscription?.plan === 'premium';
  const isTrial = subscription?.status === 'trial';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.photoURL) setProfileImage(user.photoURL);
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

  const getUserName = () => {
    if (!currentUser) return 'Guest';
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'Pupa Member';
  };

  const getAvatarLetter = () => getUserName().charAt(0).toUpperCase();

  // Membership badge component
  const MembershipBadge = () => {
    if (!subscription) return null;
    if (isPremium) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30">
          <Crown size={14} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-bold">GOLD MEMBER</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-500/15 border border-gray-500/30">
        <Star size={14} className="text-gray-400" />
        <span className="text-gray-400 text-xs font-bold">SILVER MEMBER</span>
      </div>
    );
  };

  const MENU_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', sub: 'Name, photo, bio', onClick: () => {} },
        { icon: Mail, label: 'Email', sub: currentUser?.email || 'Not set', onClick: () => {} },
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
      title: 'Future Features',
      items: [
        { icon: Gift, label: 'Rewards', sub: 'Coming Soon', disabled: true, onClick: () => {} },
        { icon: Star, label: 'Referrals', sub: 'Coming Soon', disabled: true, onClick: () => {} },
        { icon: Wallet, label: 'Wallet', sub: 'Coming Soon', disabled: true, onClick: () => {} },
        { icon: Download, label: 'Downloads', sub: 'Coming Soon', disabled: true, onClick: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Feedback & Suggestions', sub: 'Help us improve', onClick: () => {} },
        { icon: HelpCircle, label: 'Help & Support', sub: 'Get assistance', onClick: () => {} },
        { icon: FileText, label: 'Privacy Policy', sub: 'How we protect your data', onClick: () => {} },
        { icon: FileText, label: 'Terms & Conditions', sub: 'Legal information', onClick: () => onTermsClick?.() },
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
      {activeOverlay === 'settings' && <SettingsOverlay onClose={() => setActiveOverlay(null)} />}

      <div className="px-5 pt-4">
        {/* Profile Header */}
        <div className="rounded-2xl p-5 mb-6 bg-gradient-to-br from-emerald-900/30 to-[#0a0a1a] border border-emerald-500/20">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40"
                />
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
              <h2 className="font-semibold text-xl text-white mb-1">{getUserName()}</h2>
              <div className="mb-2">
                <MembershipBadge />
              </div>
              <p className="text-gray-400 text-xs">{currentUser?.email || 'Not signed in'}</p>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">
                  {isPremium ? 'Premium Active' : isTrial ? 'Free Trial (1 Day)' : 'Basic Plan'}
                </p>
                <p className="text-gray-500 text-xs">
                  {isPremium ? 'Unlimited access' : isTrial ? 'Expires in 24 hours' : 'Limited access'}
                </p>
              </div>
              {!isPremium && (
                <button 
                  onClick={() => navigate('/welcome')}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-xs font-bold"
                >
                  Upgrade
                </button>
              )}
            </div>
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