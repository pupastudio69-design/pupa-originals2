import React from 'react';
import { Home, Compass, Download, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'downloads', label: 'Downloads', Icon: Download, badge: 'Soon' },
  { id: 'profile', label: 'Profile', Icon: User },
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
        {NAV_ITEMS.map(({ id, label, Icon, badge }) => {
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

              <div className="relative">
                <Icon
                  size={20}
                  className="transition-all duration-300"
                  style={{
                    color: isActive ? '#facc15' : '#6b7280',
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(250,204,21,0.5))' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                {/* Coming Soon badge */}
                {badge && (
                  <span className="absolute -top-1.5 -right-3 text-[6px] font-bold px-1 py-0 rounded-full bg-emerald-500 text-white">
                    {badge}
                  </span>
                )}
              </div>
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