import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Moon, Bell, Wifi, Smartphone, Shield, 
  FileText, HelpCircle, ChevronRight, Check
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('pupa_settings') || '{}');
  });

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem('pupa_settings', JSON.stringify(updated));
  };

  const SETTINGS_GROUPS = [
    {
      title: 'Playback',
      items: [
        { 
          id: 'autoplay', 
          label: 'Auto-play next episode', 
          icon: Wifi,
          type: 'toggle'
        },
        { 
          id: 'mobileData', 
          label: 'Use mobile data for streaming', 
          icon: Smartphone,
          type: 'toggle'
        },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          id: 'pushNotifications', 
          label: 'Push notifications', 
          icon: Bell,
          type: 'toggle'
        },
        { 
          id: 'newReleases', 
          label: 'New release alerts', 
          icon: Bell,
          type: 'toggle'
        },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { 
          id: 'darkMode', 
          label: 'Dark mode', 
          icon: Moon,
          type: 'toggle',
          disabled: true,
          value: true
        },
      ]
    },
    {
      title: 'Account',
      items: [
        { 
          id: 'privacy', 
          label: 'Privacy Policy', 
          icon: Shield,
          type: 'link',
          onClick: () => navigate('/privacy')
        },
        { 
          id: 'terms', 
          label: 'Terms & Conditions', 
          icon: FileText,
          type: 'link',
          onClick: () => navigate('/terms')
        },
        { 
          id: 'support', 
          label: 'Help & Support', 
          icon: HelpCircle,
          type: 'link',
          onClick: () => navigate('/support')
        },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <div className="sticky top-0 z-40 bg-[#0a0a1a]/95 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/me')} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">Settings</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="px-4 py-4">
        {SETTINGS_GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  onClick={item.type === 'link' ? item.onClick : undefined}
                  className={`flex items-center gap-3 p-3.5 rounded-xl bg-white/5 ${
                    item.type === 'link' ? 'cursor-pointer hover:bg-white/10' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <item.icon size={18} className={item.disabled ? 'text-gray-600' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.disabled ? 'text-gray-600' : 'text-white'}`}>{item.label}</p>
                  </div>
                  
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => !item.disabled && toggleSetting(item.id)}
                      disabled={item.disabled}
                      className={`w-11 h-6 rounded-full relative transition-colors ${
                        (item.value !== undefined ? item.value : settings[item.id]) 
                          ? 'bg-emerald-500' 
                          : 'bg-white/10'
                      } ${item.disabled ? 'opacity-50' : ''}`}
                    >
                      <div 
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                        style={{ 
                          transform: (item.value !== undefined ? item.value : settings[item.id]) 
                            ? 'translateX(22px)' 
                            : 'translateX(2px)' 
                        }}
                      />
                    </button>
                  )}

                  {item.type === 'link' && (
                    <ChevronRight size={16} className="text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <p className="text-gray-700 text-xs">Pupa Originals v1.0.0</p>
          <p className="text-gray-800 text-[10px]">© 2026 Pupa Originals</p>
        </div>
      </div>
    </div>
  );
}
