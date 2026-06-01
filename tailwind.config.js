/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pupa: {
          bg: '#041b11',
          black: '#000000',
          emerald: '#16a34a',
          'emerald-light': '#22c55e',
          gold: '#facc15',
          'gold-dark': '#d97706',
          white: '#f3f4f6',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'pupa-radial': 'radial-gradient(ellipse at center, #0d3b23 0%, #041b11 60%, #000000 100%)',
        'gold-shine': 'linear-gradient(135deg, #facc15 0%, #d97706 50%, #facc15 100%)',
        'emerald-glow': 'linear-gradient(135deg, #16a34a 0%, #064e2a 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(250, 204, 21, 0.3), 0 0 60px rgba(250, 204, 21, 0.1)',
        'emerald-glow': '0 0 20px rgba(22, 163, 74, 0.4), 0 0 60px rgba(22, 163, 74, 0.15)',
        'card': '0 8px 32px rgba(0,0,0,0.6)',
        'cinematic': '0 20px 60px rgba(0,0,0,0.8)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(250,204,21,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(250,204,21,0.6), 0 0 80px rgba(250,204,21,0.2)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
