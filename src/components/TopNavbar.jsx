import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import PupaLogo from './PupaLogo';

export default function TopNavbar({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(4, 27, 17, 0.92)'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(22,163,74,0.1)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <PupaLogo size={32} showText={true} />

        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-emerald-900/40 transition-colors"
          >
            <Search size={17} className="text-gray-300" />
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-emerald-900/40 transition-colors relative">
            <Bell size={17} className="text-gray-300" />
            {hasNotif && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400 border border-pupa-bg" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
