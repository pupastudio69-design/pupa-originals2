# 🎬 Pupa Originals

**Premium African Streaming Platform**

A production-ready React + Vite streaming app with cinematic design, built for publishing.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 📁 Project Structure

```
pupa-originals/
├── src/
│   ├── components/
│   │   ├── PupaLogo.jsx        ← SVG logo component
│   │   ├── SplashScreen.jsx    ← Animated splash with logo
│   │   ├── TopNavbar.jsx       ← Fixed top nav with search & notifications
│   │   ├── BottomNavbar.jsx    ← Bottom tab navigation
│   │   ├── HeroBanner.jsx      ← Auto-sliding cinematic hero
│   │   ├── MovieCard.jsx       ← Reusable glossy movie card
│   │   ├── ContentRow.jsx      ← Horizontal scrollable content row
│   │   ├── Top10Row.jsx        ← Top 10 with giant rank numbers
│   │   ├── CategoriesGrid.jsx  ← 2-column category grid
│   │   └── SearchOverlay.jsx   ← Full-screen search
│   ├── pages/
│   │   ├── HomePage.jsx        ← Main streaming homepage
│   │   ├── MovieDetailPage.jsx ← Full movie detail with comments
│   │   ├── WalletPage.jsx      ← Subscriptions, gifting, referrals
│   │   ├── DownloadsPage.jsx   ← Offline downloads manager
│   │   └── ProfilePage.jsx     ← User profile & settings
│   ├── data/
│   │   └── movies.js           ← Mock data (replace with Firebase)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#041b11` |
| Emerald | `#16a34a` |
| Gold | `#facc15` |
| White | `#f3f4f6` |
| Font Display | Cormorant Garamond |
| Font Body | DM Sans |

---

## ✅ Features Included

- [x] Animated Pupa logo splash screen
- [x] Auto-sliding cinematic hero banner
- [x] Horizontal scroll content rows (6 sections)
- [x] Top 10 with giant rank numbers
- [x] Categories grid (8 genres)
- [x] Movie detail page with comments & reactions
- [x] Full-screen search overlay
- [x] Wallet with regional pricing (NG/GH/UK/US)
- [x] Referral system with progress tracking
- [x] Downloads page with progress bars
- [x] Profile page with premium status
- [x] Bottom navigation (Home/Wallet/Downloads/Me)
- [x] Glassmorphism & cinematic gradients
- [x] Smooth hover animations

---

## 🔥 Next Steps (Firebase Integration)

1. Add Firebase config to `src/firebase.js`
2. Replace mock data in `src/data/movies.js` with Firestore queries
3. Add Firebase Auth for login/signup
4. Add Firebase Storage for movie thumbnails
5. Set up Firebase Functions for payment processing

---

## 📱 Publishing to App Stores

For React Native / Capacitor conversion:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Pupa Originals" "tv.pupaoriginals.app"
npx cap add android
npx cap add ios
npm run build && npx cap sync
```

---

**© 2025 Pupa Media · All Rights Reserved**
