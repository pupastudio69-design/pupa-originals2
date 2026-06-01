import React, { useEffect, useState } from 'react';
import PupaLogo from './PupaLogo';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter'); // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 800);
    const t2 = setTimeout(() => setPhase('exit'), 2400);
    const t3 = setTimeout(() => onFinish(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, #0d3b23 0%, #041b11 50%, #000 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.6s ease-out' : 'none',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Ambient rings */}
      {phase !== 'enter' && (
        <>
          <div
            className="absolute rounded-full border border-emerald-700/20"
            style={{
              width: 300, height: 300,
              animation: 'ripple 2s ease-out infinite',
            }}
          />
          <div
            className="absolute rounded-full border border-yellow-500/10"
            style={{
              width: 400, height: 400,
              animation: 'ripple 2s ease-out 0.4s infinite',
            }}
          />
          <div
            className="absolute rounded-full border border-emerald-800/10"
            style={{
              width: 520, height: 520,
              animation: 'ripple 2s ease-out 0.8s infinite',
            }}
          />
        </>
      )}

      {/* Logo */}
      <div
        style={{
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'scale(0.7)' : 'scale(1)',
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <PupaLogo size={96} showText={true} />
      </div>

      {/* Tagline */}
      <div
        className="mt-8 text-center"
        style={{
          opacity: phase === 'hold' ? 1 : 0,
          transform: phase === 'hold' ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s ease-out 0.3s',
        }}
      >
        <p className="font-body text-xs tracking-[0.5em] uppercase text-emerald-500/70">
          Premium African Cinema
        </p>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2" style={{ width: 120 }}>
        <div className="h-px bg-emerald-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-yellow-400 rounded-full"
            style={{
              width: phase === 'enter' ? '0%' : phase === 'hold' ? '70%' : '100%',
              transition: phase === 'enter'
                ? 'width 0.8s ease'
                : phase === 'hold'
                ? 'width 1.5s ease'
                : 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
