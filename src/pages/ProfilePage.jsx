import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import {
  User, Settings, Crown, Bell, Shield, ChevronRight,
  LogOut, Star, Zap, Globe, Mail, CheckCircle, X
} from 'lucide-react';

// Settings Overlay Component
function SettingsOverlay({ onClose }) {
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState('HD');
  const [notifications, setNotifications] = useState(true);

  const settingsGroups = [
    {
      title: 'Playback',
      items: [
        { label: 'Auto-play next episode', value: autoPlay, onChange: setAutoPlay },
        { label: 'Download quality', value: downloadQuality, options: ['SD', 'HD', '4K'], onChange: setDownloadQuality },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { label: 'Dark mode', value: darkMode, onChange: setDarkMode },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { label: 'Push notifications', value: notifications, onChange: setNotifications },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#041b11] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Settings</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {settingsGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-3">{group.title}</h3>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-white text-sm font-body">{item.label}</span>
                  {item.options ? (
                    <div className="flex gap-1">
                      {item.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => item.onChange(opt)}
                          className="px-2 py-1 rounded text-xs font-mono"
                          style={{
                            background: item.value === opt ? 'rgba(22,163,74,0.3)' : 'transparent',
                            color: item.value === opt ? '#22c55e' : '#6b7280',
                            border: `1px solid ${item.value === opt ? 'rgba(22,163,74,0.4)' : 'rgba(255,255,255,0.1)'}`
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => item.onChange(!item.value)}
                      className="w-11 h-6 rounded-full transition-colors relative"
                      style={{
                        background: item.value ? '#16a34a' : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{ transform: item.value ? 'translateX(20px)' : 'translateX(2px)' }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <h3 className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-3">About</h3>
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-gray-400 text-sm">Pupa Originals v1.0.0</p>
            <p className="text-gray-600 text-xs mt-1">© 2025 Pupa Media</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications Overlay
function NotificationsOverlay({ onClose }) {
  const notifications = [
    { id: 1, title: 'New movie added', message: '"The Last Obi" is now streaming', time: '2h ago', read: false },
    { id: 2, title: 'Gift received', message: 'Someone sent you a Bronze coin', time: '5h ago', read: false },
    { id: 3, title: 'Subscription reminder', message: 'Your Premium plan expires in 3 days', time: '1d ago', read: true },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#041b11] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Notifications</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-xl ${n.read ? 'bg-white/5' : 'bg-emerald-900/20 border border-emerald-800/30'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-gray-600' : 'bg-emerald-400'}`} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{n.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{n.message}</p>
                    <p className="text-gray-600 text-[10px] mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Region Overlay
function RegionOverlay({ onClose, currentRegion, onRegionChange }) {
  const regions = [
    { code: 'NG', name: 'Nigeria', currency: '₦', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: '₵', flag: '🇬🇭' },
    { code: 'UK', name: 'United Kingdom', currency: '£', flag: '🇬🇧' },
    { code: 'US', name: 'United States', currency: '$', flag: '🇺🇸' },
    { code: 'ZA', name: 'South Africa', currency: 'R', flag: '🇿🇦' },
    { code: 'KE', name: 'Kenya', currency: 'KSh', flag: '🇰🇪' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#041b11] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Region & Language</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-gray-500 text-xs mb-4">Select your region for pricing and content</p>
        <div className="space-y-2">
          {regions.map((region) => (
            <button
              key={region.code}
              onClick={() => {
                onRegionChange(region.code);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <span className="text-2xl">{region.flag}</span>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{region.name}</p>
                <p className="text-gray-500 text-xs">Currency: {region.currency}</p>
              </div>
              {currentRegion === region.code && (
                <CheckCircle size={18} className="text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Privacy Overlay
function PrivacyOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#041b11] flex flex-col">
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5">
        <h2 className="text-white text-lg font-display font-semibold">Privacy & Security</h2>
        <button onClick={onClose}>
          <X size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="text-white text-sm font-medium mb-2">Data Usage</h3>
            <p className="text-gray-400 text-xs">Manage how your data is collected and used</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs">Manage Data</button>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="text-white text-sm font-medium mb-2">Change Password</h3>
            <p className="text-gray-400 text-xs">Update your account password</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs">Change Password</button>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <h3 className="text-white text-sm font-medium mb-2">Two-Factor Authentication</h3>
            <p className="text-gray-400 text-xs">Add an extra layer of security</p>
            <button className="mt-3 px-4 py-2 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs">Enable 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [region, setRegion] = useState('NG');
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleResendVerification = async () => {
    if (currentUser && !currentUser.emailVerified) {
      try {
        await sendEmailVerification(currentUser);
        setVerificationSent(true);
        setTimeout(() => setVerificationSent(false), 5000);
      } catch (err) {
        console.error('Verification error:', err);
      }
    }
  };

  const getUserName = () => {
    if (!currentUser) return 'Guest';
    if (currentUser.displayName) return currentUser.displayName;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'Pupa Member';
  };

  const getUserEmail = () => {
    if (!currentUser) return 'Not signed in';
    return currentUser.email || 'No email provided';
  };

  const getAvatarLetter = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const isEmailVerified = currentUser?.emailVerified || false;

  const MENU_ITEMS = [
    { 
      icon: Crown, 
      label: 'Premium Membership', 
      sub: 'Free plan · Upgrade for more', 
      color: '#facc15', 
      badge: null,
      onClick: () => navigate('/wallet')
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      sub: 'Manage your alerts', 
      color: '#a78bfa',
      onClick: () => setActiveOverlay('notifications')
    },
    { 
      icon: Globe, 
      label: 'Region & Language', 
      sub: 'Nigeria (NG) · English', 
      color: '#38bdf8',
      onClick: () => setActiveOverlay('region')
    },
    { 
      icon: Shield, 
      label: 'Privacy & Security', 
      sub: 'Account protection', 
      color: '#34d399',
      onClick: () => setActiveOverlay('privacy')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      sub: 'App preferences', 
      color: '#94a3b8',
      onClick: () => setActiveOverlay('settings')
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pupa-bg pt-16 pb-24 page-enter">
      {/* Overlays */}
      {activeOverlay === 'settings' && <SettingsOverlay onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'notifications' && <NotificationsOverlay onClose={() => setActiveOverlay(null)} />}
      {activeOverlay === 'region' && <RegionOverlay onClose={() => setActiveOverlay(null)} currentRegion={region} onRegionChange={setRegion} />}
      {activeOverlay === 'privacy' && <PrivacyOverlay onClose={() => setActiveOverlay(null)} />}

      <div className="px-5 pt-4">
        {/* Profile header */}
        <div
          className="relative rounded-2xl p-5 mb-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #064e2a 0%, #041b11 100%)',
            border: '1px solid rgba(22,163,74,0.2)',
          }}
        >
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-emerald-500/5" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-3xl text-white"
                style={{
                  background: 'linear-gradient(135deg, #16a34a, #064e2a)',
                  border: '3px solid rgba(22,163,74,0.4)',
                  boxShadow: '0 0 20px rgba(22,163,74,0.2)',
                }}
              >
                {getAvatarLetter()}
              </div>
              {isEmailVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Star size={12} className="text-white fill-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="font-display font-semibold text-xl text-white mb-0.5">
                {getUserName()}
              </h2>
              <p className="text-gray-400 text-xs font-body mb-2 flex items-center gap-1">
                <Mail size={10} />
                {getUserEmail()}
              </p>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25">
                  <User size={10} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[10px] font-mono tracking-wide">
                    {isEmailVerified ? 'VERIFIED' : 'FREE'}
                  </span>
                </div>
                {!isEmailVerified && currentUser && (
                  <button 
                    onClick={handleResendVerification}
                    className="text-yellow-400 text-[10px] hover:text-yellow-300 transition-colors"
                  >
                    {verificationSent ? 'Sent!' : 'Verify email'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
            {[
              { label: 'Watched', value: '0', icon: Star },
              { label: 'Points', value: '0', icon: Zap },
              { label: 'Referrals', value: '0', icon: User },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <p className="font-display font-semibold text-lg text-white">{value}</p>
                <p className="text-gray-500 text-[10px] font-body">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email verification banner */}
        {!isEmailVerified && currentUser && (
          <div
            className="rounded-xl p-4 mb-6"
            style={{
              background: 'rgba(250,204,21,0.05)',
              border: '1px solid rgba(250,204,21,0.15)',
            }}
          >
            <p className="text-yellow-400 text-sm font-semibold mb-1 font-body">Verify Your Email</p>
            <p className="text-gray-400 text-xs mb-3">
              Check your inbox at {getUserEmail()} and click the verification link.
            </p>
            <button 
              onClick={handleResendVerification}
              className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs hover:bg-yellow-500/20 transition-colors"
            >
              {verificationSent ? 'Verification email sent!' : 'Resend verification email'}
            </button>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2">
          {MENU_ITEMS.map(({ icon: Icon, label, sub, color, badge, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="w-full flex items-center gap-3 p-4 rounded-xl glass-dark hover:border-emerald-800/50 transition-colors text-left"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-body font-medium">{label}</p>
                <p className="text-gray-500 text-xs font-body">{sub}</p>
              </div>
              {badge && (
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full mr-1"
                  style={{ background: `${color}20`, color }}
                >
                  {badge}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Log out */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 p-4 rounded-xl border border-red-500/20 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors text-sm font-body"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <p className="text-center text-gray-700 text-[10px] font-mono mt-6">
          Pupa Originals v1.0.0 · © 2025 Pupa Media
        </p>
      </div>
    </div>
  );
}