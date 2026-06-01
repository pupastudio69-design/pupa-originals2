import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Download, Play, Trash2, Wifi, Lock, LogIn, Film } from 'lucide-react';

const MAX_STORAGE_GB = 10;

export default function DownloadsPage() {
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
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center px-5">
        <div className="text-center">
          <LogIn size={48} className="text-emerald-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-gray-400 text-sm mb-4">Please sign in to access your downloads</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pupa-bg pt-16 pb-24 page-enter">
      <div className="px-5 pt-4">
        <h1 className="font-display text-2xl font-semibold text-white mb-2">Downloads</h1>
        <p className="text-gray-500 text-xs font-body mb-6">
          <Lock size={10} className="inline mr-1" />
          Saved inside Pupa Originals only
        </p>

        {/* Storage indicator */}
        <div className="glass-dark rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-body">Storage Used</span>
            <span className="text-emerald-400 text-xs font-mono">
              {formatStorage(storageUsed)} / {MAX_STORAGE_GB} GB
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
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
            <p className="text-red-400 text-[10px] mt-1">Storage almost full!</p>
          )}
        </div>

        {/* Download list */}
        {downloads.length === 0 ? (
          <div className="text-center py-12">
            <Film size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm mb-2">No downloads yet</p>
            <p className="text-gray-600 text-xs">Movies you download will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {downloads.map(d => (
              <div
                key={d.id}
                className="flex gap-3 p-3 rounded-xl glass-dark"
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 72, height: 104 }}>
                  <img src={d.poster} alt={d.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {d.progress === 100 ? (
                      <Play size={16} className="text-white fill-white" />
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
                  <p className="text-white text-sm font-semibold font-body mb-1 truncate">{d.title}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-[10px] font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {d.quality}
                    </span>
                    <span className="text-gray-500 text-[10px]">{d.size}</span>
                  </div>
                  {d.progress === 100 ? (
                    <p className="text-gray-500 text-[10px] font-body">
                      Expires in {d.expires}
                    </p>
                  ) : (
                    <p className="text-yellow-500 text-[10px] font-body">
                      Downloading... {d.progress}%
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button 
                  onClick={() => handleDeleteDownload(d)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Wifi only toggle */}
        <div className="mt-6 glass-dark rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi size={18} className="text-emerald-400" />
            <div>
              <p className="text-white text-sm font-body">Download on Wi-Fi only</p>
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
      </div>
    </div>
  );
}