import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Film } from 'lucide-react';

const MOCK_USERS = {
  'user-1': { name: 'Sarah Johnson', avatar: 'SJ', color: 'from-pink-500 to-rose-500', bio: 'Movie enthusiast | TV series addict', followers: 1240, following: 380 },
  'user-2': { name: 'Mike Chen', avatar: 'MC', color: 'from-blue-500 to-cyan-500', bio: 'Film critic and reviewer', followers: 890, following: 210 },
  'user-3': { name: 'Emma Wilson', avatar: 'EW', color: 'from-purple-500 to-violet-500', bio: 'Drama lover | Rom-com fanatic', followers: 567, following: 450 },
  'user-4': { name: 'David Park', avatar: 'DP', color: 'from-emerald-500 to-teal-500', bio: 'Action movie buff | Sci-fi nerd', followers: 2100, following: 120 },
  'user-5': { name: 'Lisa Kim', avatar: 'LK', color: 'from-orange-500 to-amber-500', bio: 'K-drama fan | Thriller enthusiast', followers: 340, following: 670 },
};

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS[userId] || { name: 'Pupa Member', avatar: 'PM', color: 'from-gray-500 to-gray-600', bio: 'No bio available', followers: 0, following: 0 };

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <div className="flex items-center gap-3 px-4 py-4 pt-16">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">Profile</h1>
      </div>

      <div className="px-5 pb-6">
        <div className="flex flex-col items-center mb-6">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg`}>
            {user.avatar}
          </div>
          <h2 className="font-bold text-xl text-white mb-1">{user.name}</h2>
          <p className="text-gray-400 text-xs text-center max-w-xs">{user.bio}</p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{user.followers}</p>
            <p className="text-gray-500 text-xs">Followers</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">{user.following}</p>
            <p className="text-gray-500 text-xs">Following</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">42</p>
            <p className="text-gray-500 text-xs">Reviews</p>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors mb-6">
          Follow
        </button>

        <div>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Film size={16} className="text-yellow-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Film size={14} className="text-emerald-400" />
                  <p className="text-white text-sm font-medium">Watched Movie {i}</p>
                </div>
                <p className="text-gray-500 text-xs">Rated 4.{i + 5} stars · {i} days ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}