import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth, app } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import SearchOverlay from './components/SearchOverlay';
import CategoriesOverlay from './components/CategoriesOverlay';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WalletPage from './pages/WalletPage';
import DownloadsPage from './pages/DownloadsPage';
import ProfilePage from './pages/ProfilePage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

// Initialize Firebase Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.log('Firebase Messaging not available:', err);
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync active tab with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') setActiveTab('home');
    else if (path === '/wallet') setActiveTab('wallet');
    else if (path === '/downloads') setActiveTab('downloads');
    else if (path === '/me') setActiveTab('me');
  }, [location.pathname]);

  // Request push notification permission
  useEffect(() => {
    if (messaging && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getToken(messaging, { 
            vapidKey: 'BBuCrYyn4gFgcFJUgdX7SYq1OID0UxJehqa4NRk47etntA4-oQOHIdpu0QDptCqum7jLLu5Tvqqdl3nEPXiR-Y0' 
          })
            .then((token) => {
              console.log('Push notification token:', token);
            })
            .catch((err) => console.log('Token error:', err));
        }
      });

      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/pupa-icon.png',
          });
        }
      });
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'wallet': navigate('/wallet'); break;
      case 'downloads': navigate('/downloads'); break;
      case 'me': navigate('/me'); break;
    }
  };

  const handleCategoriesOpen = () => {
    setCategoriesOpen(true);
  };

  const handleTermsClick = () => {
    setShowTerms(true);
  };

  const handleTermsBack = () => {
    setShowTerms(false);
  };

  // Don't show navbar on movie detail pages
  const isMoviePage = location.pathname.startsWith('/movie/');

  if (showTerms) {
    return (
      <div className="relative min-h-screen bg-pupa-bg">
        <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
        <TermsPage onBack={handleTermsBack} />
        <BottomNavbar active={activeTab} onChange={handleTabChange} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-pupa-bg noise">
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onMovieSelect={(m) => { 
            setSearchOpen(false); 
            navigate(`/movie/${m.id}`);
          }}
        />
      )}

      {categoriesOpen && (
        <CategoriesOverlay
          onClose={() => setCategoriesOpen(false)}
          onCategorySelect={(cat) => {
            setCategoriesOpen(false);
            navigate(`/category/${cat.id}`);
          }}
        />
      )}

      {!isMoviePage && <TopNavbar onSearchOpen={() => setSearchOpen(true)} />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage onCategoriesOpen={handleCategoriesOpen} />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/me" element={<ProfilePage onTermsClick={handleTermsClick} />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/category/:id" element={<div className="pt-20 text-white text-center">Category Page Coming Soon</div>} />
        </Routes>
      </main>

      {!isMoviePage && <BottomNavbar active={activeTab} onChange={handleTabChange} />}
    </div>
  );
}

function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          />
        </Routes>
        <Analytics />
      </AuthProvider>
    </BrowserRouter>
  );
}