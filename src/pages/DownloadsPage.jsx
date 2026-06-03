import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Download, Play, Trash2, Wifi, Lock, LogIn, Film, ArrowLeft, HardDrive, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MAX_STORAGE_GB = 10;

export default function DownloadsPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState([]);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        loadDownloads(user.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadDownloads = (uid) => {
    const unsub = onSnapshot(doc(db, 'users', uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDownloads(data.downloads || []);
        setStorageUsed(data.storageUsed || 0);
        setWifiOnly(data.wifiOnly !== false);
      }
    });
    return unsub;
  };

  const handleDeleteDownload = async (download) => {
    if (!currentUser) return;
    if (!confirm(`Delete "${download.title}"?`)) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        downloads: arrayRemove(download),
        storageUsed: Math.max(0, storageUsed - parseFloat(download.sizeGB || 0))
      });
    } catch (err) {
      console.error('Error deleting download:', err);
    }
  };

  const toggleWifiOnly = async () => {
    if (!currentUser) return;
    const newValue = !wifiOnly;
    setWifiOnly(newValue);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        wifiOnly: newValue
      });
    } catch (err) {
      console.error('Error updating wifi setting:', err);
    }
  };

  const formatStorage = (gb) => {
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    return `${(gb * 1024).toFixed(0)} MB`;
  };

  const storagePercent = Math.min((storageUsed / MAX_STORAGE_GB) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm mb-6">Please sign in to access your downloads</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-[#050505] pt-12 pb-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Downloads</h1>
            <p className="text-gray-400 text-xs">Manage your offline content</p>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-bold text-sm">Storage</span>
            </div>
            <span className="text-emerald-400 text-xs font-mono">
              {formatStorage(storageUsed)} / {MAX_STORAGE_GB} GB
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${storagePercent}%`,
                background: storagePercent > 90 
                  ? 'linear-gradient(90deg, #ef4444, #f97316)' 
                  : 'linear-gradient(90deg, #16a34a, #facc15)',
              }}
            />
          </div>
          {storagePercent > 90 && (
            <p className="text-red-400 text-[10px]">Storage almost full! Delete some downloads.</p>
          )}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* Download list */}
        {downloads.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Film size={40} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm mb-1 font-bold">No downloads yet</p>
            <p className="text-gray-600 text-xs">Movies you download will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map(d => (
              <div
                key={d.id}
                className="flex gap-3 p-3 rounded-xl bg-[#1a1a2e] border border-white/5 hover:border-emerald-500/20 transition-colors"
              >
                {/* Thumbnail */}
                <div 
                  className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                  style={{ width: 80, height: 110 }}
                  onClick={() => navigate(`/movie/${d.movieId}`)}
                >
                  <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {d.progress === 100 ? (
                      <Play size={18} className="text-white fill-white" />
                    ) : (
                      <div className="text-center">
                        <Download size={14} className="text-yellow-400 mx-auto mb-1" />
                        <span className="text-yellow-400 text-[9px] font-mono">{d.progress}%</span>
                      </div>
                    )}
                  </div>
                  {/* Progress bar for downloading */}
                  {d.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1">
                      <div
                        className="h-full"
                        style={{
                          width: `${d.progress}%`,
                          background: 'linear-gradient(90deg, #16a34a, #facc15)',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-white text-sm font-bold font-body mb-1 truncate cursor-pointer hover:text-emerald-400 transition-colors"
                    onClick={() => navigate(`/movie/${d.movieId}`)}
                  >
                    {d.title}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-[10px] font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {d.quality || 'HD'}
                    </span>
                    <span className="text-gray-500 text-[10px]">{d.size || '1.2 GB'}</span>
                  </div>
                  {d.progress === 100 ? (
                    <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                      <Clock size={10} />
                      <span>Expires in {d.expires || '7 days'}</span>
                    </div>
                  ) : (
                    <p className="text-yellow-500 text-[10px] font-body">
                      Downloading... {d.progress}%
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button 
                  onClick={() => handleDeleteDownload(d)}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors self-center"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Wifi only toggle */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Wifi size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Download on Wi-Fi only</p>
              <p className="text-gray-500 text-xs">Save mobile data</p>
            </div>
          </div>
          <button 
            onClick={toggleWifiOnly}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
              wifiOnly ? 'bg-emerald-600' : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
              wifiOnly ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock size={14} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white text-sm font-bold mb-1">Offline Viewing</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Downloaded movies are encrypted and can only be played within the Pupa Originals app. 
                Downloads expire after 30 days and will need to be renewed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}