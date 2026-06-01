import React from 'react';
import { Download, Play, Trash2, Wifi, Lock } from 'lucide-react';

const DOWNLOADS = [
  {
    id: 1,
    title: 'Blood of the Sahara',
    poster: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&q=80',
    size: '1.4 GB',
    quality: '4K',
    expires: '12 days',
    progress: 100,
  },
  {
    id: 2,
    title: 'Afrobeats Rising',
    poster: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
    size: '820 MB',
    quality: 'HD',
    expires: '7 days',
    progress: 100,
  },
  {
    id: 3,
    title: 'Lagos After Dark',
    poster: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80',
    size: '1.1 GB',
    quality: '4K',
    expires: '3 days',
    progress: 68,
  },
];

export default function DownloadsPage() {
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
            <span className="text-emerald-400 text-xs font-mono">3.3 GB / 10 GB</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: '33%',
                background: 'linear-gradient(90deg, #16a34a, #facc15)',
              }}
            />
          </div>
        </div>

        {/* Download list */}
        <div className="space-y-4">
          {DOWNLOADS.map(d => (
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
              <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Wifi only toggle */}
        <div className="mt-6 glass-dark rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi size={18} className="text-emerald-400" />
            <div>
              <p className="text-white text-sm font-body">Download on Wi-Fi only</p>
              <p className="text-gray-500 text-xs">Save mobile data</p>
            </div>
          </div>
          <div className="w-12 h-6 rounded-full bg-emerald-600 relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow" />
          </div>
        </div>
      </div>
    </div>
  );
}
