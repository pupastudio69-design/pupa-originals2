import React from 'react';
import { Home, Wallet, Download, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'wallet', label: 'Wallet', Icon: Wallet },
  { id: 'downloads', label: 'Downloads', Icon: Download },
  { id: 'me', label: 'Me', Icon: User },
];

export default function BottomNavbar({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(2, 10, 5, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(22, 163, 74, 0.15)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1 pb-safe">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 px-4 py-2 relative group"
            >
              {/* Active indicator */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 24 : 0,
                  background: isActive
                    ? 'linear-gradient(90deg, #16a34a, #facc15)'
                    : 'transparent',
                }}
              />

              <Icon
                size={20}
                className="transition-all duration-300"
                style={{
                  color: isActive ? '#facc15' : '#6b7280',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(250,204,21,0.5))' : 'none',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              <span
                className="text-[10px] font-body font-medium tracking-wide transition-colors duration-300"
                style={{ color: isActive ? '#facc15' : '#6b7280' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
