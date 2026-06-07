import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, Trash2, Play, WifiOff, AlertCircle, 
  Check, X, ArrowLeft, Clock
} from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

// Simple in-memory download manager using IndexedDB
const DB_NAME = 'PupaDownloads';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const saveVideo = async (id, blob, metadata) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ id, blob, metadata, downloadedAt: Date.now() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getVideo = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteVideo = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getAllVideos = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Test video for downloading (small file for testing)
const TEST_DOWNLOAD_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; // 10MB test video

export default function DownloadsPage() {
  const navigate = useNavigate();
  const { isPremium, isSubscribed } = useSubscription();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);

  // Load saved downloads
  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      const videos = await getAllVideos();
      setDownloads(videos);
    } catch (err) {
      console.error('Failed to load downloads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check storage quota
  const checkStorage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = (estimate.usage || 0) / (1024 * 1024);
      const total = (estimate.quota || 0) / (1024 * 1024);
      return { used: used.toFixed(1), total: total.toFixed(1), available: ((total - used) / 1024).toFixed(2) };
    }
    return null;
  };

  const handleDownload = async () => {
    if (!isSubscribed()) {
      setError('Subscribe to download content');
      return;
    }

    // Basic plan: max 5 downloads
    if (!isPremium() && downloads.length >= 5) {
      setError('Basic plan: max 5 downloads. Upgrade to Premium for unlimited.');
      return;
    }

    setDownloading('test-video');
    setProgress(0);
    setError('');

    try {
      // Fetch with progress tracking
      const response = await fetch(TEST_DOWNLOAD_URL);
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10);

      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) {
          setProgress(Math.round((received / total) * 100));
        }
      }

      // Combine chunks into blob
      const blob = new Blob(chunks);
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(1);

      // Save to IndexedDB
      await saveVideo('test-video', blob, {
        title: 'Big Buck Bunny (Test)',
        duration: '10:34',
        size: `${sizeMB} MB`,
        poster: 'https://placehold.co/300x450/1a1a2e/FFD700?text=Test+Video',
        type: 'test'
      });

      await loadDownloads();
      setDownloading(null);
      setProgress(0);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Download failed. Check your connection and storage space.');
      setDownloading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      setDownloads(prev => prev.filter(d => d.id !== id));
      if (playingVideo === id) setPlayingVideo(null);
    } catch (err) {
      setError('Failed to delete download');
    }
  };

  const handlePlay = async (id) => {
    try {
      const video = await getVideo(id);
      if (!video) return;
      
      const url = URL.createObjectURL(video.blob);
      setPlayingVideo(url);
    } catch (err) {
      setError('Failed to play video');
    }
  };

  const handleClosePlayer = () => {
    if (playingVideo) {
      URL.revokeObjectURL(playingVideo);
      setPlayingVideo(null);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Downloads</h1>
          <div className="w-5" />
        </div>
      </div>

      {/* Storage Info */}
      <div className="px-4 py-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Storage Used</span>
            <span className="text-white text-xs font-medium">
              {downloads.length} {downloads.length === 1 ? 'video' : 'videos'}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(downloads.length * 20, 100)}%` }}
            />
          </div>
          <p className="text-gray-500 text-[10px] mt-1">
            {isPremium() ? 'Premium: Unlimited downloads' : 'Basic: 5 downloads max'}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* Download Test Button */}
      <div className="px-4 mb-4">
        <button
          onClick={handleDownload}
          disabled={downloading === 'test-video'}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {downloading === 'test-video' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Downloading... {progress}%
            </>
          ) : (
            <>
              <Download size={18} />
              Download Test Video
            </>
          )}
        </button>
      </div>

      {/* Downloads List */}
      <div className="px-4">
        {downloads.length === 0 ? (
          <div className="text-center py-12">
            <WifiOff size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-sm font-medium mb-1">No Downloads</h3>
            <p className="text-gray-500 text-xs">Download videos to watch offline</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloads.map((item) => (
              <div 
                key={item.id}
                className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3"
              >
                <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                  <img 
                    src={item.metadata?.poster || 'https://placehold.co/300x450/1a1a2e/666666?text=No+Poster'} 
                    alt={item.metadata?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">{item.metadata?.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-[10px]">{item.metadata?.size}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-[10px]">{item.metadata?.duration}</span>
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1">
                    Downloaded {formatDate(item.downloadedAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePlay(item.id)}
                    className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30"
                  >
                    <Play size={14} className="text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <button onClick={handleClosePlayer} className="text-white">
              <X size={24} />
            </button>
            <span className="text-white text-sm font-medium">Offline Playback</span>
            <div className="w-6" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <video
              src={playingVideo}
              controls
              autoPlay
              className="w-full max-h-[70vh]"
              playsInline
            />
          </div>
          <div className="p-4 text-center">
            <p className="text-gray-400 text-xs flex items-center justify-center gap-2">
              <WifiOff size={14} />
              Playing from offline storage
            </p>
          </div>
        </div>
      )}
    </div>
  );
}