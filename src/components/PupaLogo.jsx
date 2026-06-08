import React from 'react';

export default function PupaLogo({ size = 40, showText = true, animate = false }) {
  return (
    <div className={`flex items-center gap-3 ${animate ? 'animate-float' : ''}`}>
      {/* Logo Icon */}
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0d3b23" />
              <stop offset="100%" stopColor="#020e07" />
            </radialGradient>
            <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background rounded square */}
          <rect x="2" y="2" width="96" height="96" rx="22" ry="22" fill="url(#bgGrad)" />

          {/* Gloss overlay */}
          <rect x="2" y="2" width="96" height="40" rx="22" ry="22" fill="rgba(255,255,255,0.04)" />

          {/* Play triangle border */}
          <polygon
            points="28,18 28,70 76,44"
            fill="none"
            stroke="url(#borderGrad)"
            strokeWidth="4"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Play triangle fill */}
          <polygon
            points="32,23 32,65 70,44"
            fill="url(#playGrad)"
          />

          {/* Hanging stem */}
          <line x1="52" y1="70" x2="52" y2="78" stroke="url(#borderGrad)" strokeWidth="2.5" />

          {/* Gold egg/cocoon */}
          <ellipse cx="52" cy="86" rx="9" ry="11" fill="url(#goldGrad)" />
          {/* Cocoon ridges */}
          <line x1="43" y1="84" x2="61" y2="84" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <line x1="43" y1="87" x2="61" y2="87" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <line x1="44" y1="90" x2="60" y2="90" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          {/* Egg highlight */}
          <ellipse cx="49" cy="82" rx="3" ry="2" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>

      {/* Logo Text - More Prominent */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold tracking-wider uppercase"
            style={{
              fontSize: size * 0.45,
              background: 'linear-gradient(135deg, #facc15 0%, #fde68a 40%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px rgba(250,204,21,0.3)',
              letterSpacing: '0.15em',
            }}
          >
            PUPA
          </span>
          <span
            className="font-semibold tracking-[0.4em] uppercase text-gray-300"
            style={{ 
              fontSize: size * 0.22,
              marginTop: '2px',
              background: 'linear-gradient(135deg, #facc15 0%, #fde68a 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ORIGINALS
          </span>
        </div>
      )}
    </div>
  );
}