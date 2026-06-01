import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import {
  User, Settings, Crown, Bell, Shield, ChevronRight,
  LogOut, Star, Zap, Globe, Mail
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get real user data from Firebase Auth
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

  // Get user's display name or email prefix
  const getUserName = () => {
    if (!currentUser) return 'Guest';
    if (currentUser.displayName) return currentUser.displayName;
    if (currentUser.email) return currentUser.email.split('@')[0];
    return 'Pupa Member';
  };

  // Get user's email
  const getUserEmail = () => {
    if (!currentUser) return 'Not signed in';
    return currentUser.email || 'No email provided';
  };

  // Get first letter for avatar
  const getAvatarLetter = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  // Check if email is verified
  const isEmailVerified = currentUser?.emailVerified || false;

  const MENU_ITEMS = [
    { icon: Crown, label: 'Premium Membership', sub: 'Free plan · Upgrade for more', color: '#facc15', badge: null },
    { icon: Bell, label: 'Notifications', sub: 'Manage your alerts', color: '#a78bfa' },
    { icon: Globe, label: 'Region & Language', sub: 'Nigeria (NG) · English', color: '#38bdf8' },
    { icon: Shield, label: 'Privacy & Security', sub: 'Account protection', color: '#34d399' },
    { icon: Settings, label: 'Settings', sub: 'App preferences', color: '#94a3b8' },
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
            {/* Avatar */}
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
                  <span className="text-yellow-400 text-[10px]">Verify email</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats - Real data or placeholders */}
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
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2">
          {MENU_ITEMS.map(({ icon: Icon, label, sub, color, badge }) => (
            <button
              key={label}
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