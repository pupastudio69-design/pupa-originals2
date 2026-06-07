import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '../firebase';
import {
  User, Settings, Crown, ChevronRight, LogOut, Camera, Mail,
  Star, Clock, Gift, Download, Wallet, HelpCircle, FileText,
  Shield, Bell, X, Edit3, Check, MessageSquare, ThumbsUp, 
  Users, Heart, Film, Bookmark
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity'); // activity, watchlist, liked
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState(() => localStorage.getItem('pupa_bio') || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');

  // Friend system
  const [followers, setFollowers] = useState(() => {
    return parseInt(localStorage.getItem('pupa_followers') || '0');
  });
  const [following, setFollowing] = useState(() => {
    return parseInt(localStorage.getItem('pupa_following') || '0');
  });

  // Get subscription status
  const getSubscription = () => {
    const sub = localStorage.getItem('pupa_subscription');
    if (!sub) return null;
    try { return JSON.parse(sub); } catch { return null; }
  };

  const subscription = getSubscription();
  const isPremium = subscription?.plan === 'premium';
  const isTrial = subscription?.status === 'trial';

  // Rewards data
  const points = parseInt(localStorage.getItem('pupa_points') || '0');
  const referrals = parseInt(localStorage.getItem('pupa_referral_count') || '0');
  const tier = points >= 1000 ? 'Platinum' : points >= 500 ? 'Gold' : points >= 200 ? 'Silver' : 'Bronze';

  // User's comments on movies
  const [userComments, setUserComments] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_user_comments') || '[]');
  });

  // Watchlist
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_watchlist') || '[]');
  });

  // Liked movies
  const [likedMovies, setLikedMovies] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_liked_movies') || '[]');
  });

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

  const handleSaveBio = () => {
    localStorage.setItem('pupa_bio', tempBio);
    setBio(tempBio);
    setIsEditingBio(false);
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

  const MembershipBadge = () => {
    if (!subscription) return null;
    if (isPremium || isTrial) {
      return (
        <span className="inline-flex items-center ml-1" title="Gold Member">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5"/>
            <path d="M8 12l3 3 5-6" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center ml-1" title="Silver Member">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
          <path d="M8 12l3 3 5-6" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-b from-emerald-900/20 to-[#0a0a1a] px-5 pt-16 pb-6">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/40" />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-4xl text-white bg-gradient-to-br from-emerald-500 to-emerald-800">
                {getAvatarLetter()}
              </div>
            )}
            <label className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center cursor-pointer ${uploadingImage ? 'opacity-50' : ''}`}>
              <Camera size={16} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center">
              <h2 className="font-bold text-xl text-white">{getUserName()}</h2>
              <MembershipBadge />
            </div>
            <p className="text-gray-400 text-xs mt-1">{currentUser?.email || 'Not signed in'}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{followers}</p>
            <p className="text-gray-500 text-xs">Followers</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">{following}</p>
            <p className="text-gray-500 text-xs">Following</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">{points}</p>
            <p className="text-gray-500 text-xs">Points</p>
          </div>
        </div>

        {/* Bio */}
        <div className="text-center mb-4">
          {isEditingBio ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Write a bio..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-emerald-500"
                maxLength={100}
              />
              <button onClick={handleSaveBio} className="p-2 rounded-lg bg-emerald-600 text-white">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-400 text-sm">{bio || 'No bio yet'}</p>
              <button onClick={() => { setTempBio(bio); setIsEditingBio(true); }} className="text-gray-600 hover:text-gray-400">
                <Edit3 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Subscription Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isPremium ? 'bg-yellow-400/20 text-yellow-400' : 
            isTrial ? 'bg-emerald-400/20 text-emerald-400' : 
            'bg-gray-700 text-gray-400'
          }`}>
            {isPremium ? 'Premium' : isTrial ? 'Free Trial' : 'Basic'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-gray-400 text-xs">
            {tier} Tier
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/settings')}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10"
          >
            Edit Profile
          </button>
          <button 
            onClick={() => navigate('/welcome')}
            className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300"
          >
            {isPremium ? 'Manage Plan' : 'Upgrade'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-4">
        {[
          { id: 'activity', label: 'Activity', icon: Film },
          { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
          { id: 'liked', label: 'Liked', icon: Heart },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-yellow-400 text-yellow-400' 
                : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 py-4">
        {/* Activity Tab - Shows comments user made on movies */}
        {activeTab === 'activity' && (
          <div>
            {userComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No activity yet</p>
                <p className="text-gray-600 text-xs">Comment on movies to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userComments.map((comment, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Film size={14} className="text-emerald-400" />
                      <p className="text-white text-sm font-medium">{comment.movieTitle}</p>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                    <p className="text-gray-600 text-xs mt-2">{comment.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Watchlist is empty</p>
                <button 
                  onClick={() => navigate('/tv-shows')}
                  className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs"
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {watchlist.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => navigate(`/movie/${item.id}`)}
                    className="text-left"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-1">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white text-[10px] truncate">{item.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liked Movies Tab */}
        {activeTab === 'liked' && (
          <div>
            {likedMovies.length === 0 ? (
              <div className="text-center py-8">
                <Heart size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No liked movies yet</p>
                <p className="text-gray-600 text-xs">Like movies to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {likedMovies.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => navigate(`/movie/${item.id}`)}
                    className="text-left"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-1">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white text-[10px] truncate">{item.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Sections */}
      <div className="px-5 mt-4">
        {/* Rewards & Referrals */}
        <div className="mb-6">
          <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-1">Rewards & Referrals</h3>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/rewards')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Gift size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Rewards</p>
                <p className="text-gray-500 text-xs">{points} points · {tier} tier</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/referrals')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Users size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Referrals</p>
                <p className="text-gray-500 text-xs">{referrals} friends invited</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/downloads')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Download size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Downloads</p>
                <p className="text-gray-500 text-xs">Manage offline content</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="mb-6">
          <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3 px-1">Support</h3>
          <div className="space-y-1">
            <button
              onClick={() => navigate('/support')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <HelpCircle size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Help & Support</p>
                <p className="text-gray-500 text-xs">Get assistance</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Shield size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Privacy Policy</p>
                <p className="text-gray-500 text-xs">How we protect your data</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <FileText size={18} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Terms & Conditions</p>
                <p className="text-gray-500 text-xs">Legal information</p>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Settings & Logout */}
        <button
          onClick={() => navigate('/settings')}
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

        <button
          onClick={handleLogout}
          className="w-full p-3.5 rounded-xl border border-red-500/20 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>

        <p className="text-center text-gray-700 text-xs mt-6 mb-4">
          Pupa Originals v1.0.0
        </p>
      </div>
    </div>
  );
}