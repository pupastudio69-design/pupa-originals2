import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { user } = useAuth();

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

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBack = () => {
    setSelectedMovie(null);
  };

  const handleCategoriesOpen = () => {
    setCategoriesOpen(true);
  };

  const handleCategorySelect = (category) => {
    console.log('Category selected:', category);
  };

  const handleTermsClick = () => {
    setShowTerms(true);
  };

  const handleTermsBack = () => {
    setShowTerms(false);
  };

  if (showTerms) {
    return (
      <div className="relative min-h-screen bg-pupa-bg">
        <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
        <TermsPage onBack={handleTermsBack} />
        <BottomNavbar active={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-pupa-bg noise">
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onMovieSelect={(m) => { setSelectedMovie(m); setSearchOpen(false); }}
        />
      )}

      {categoriesOpen && (
        <CategoriesOverlay
          onClose={() => setCategoriesOpen(false)}
          onCategorySelect={handleCategorySelect}
        />
      )}

      {selectedMovie && !searchOpen && !categoriesOpen && (
        <>
          <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
          <MovieDetailPage movie={selectedMovie} onBack={handleBack} />
          <BottomNavbar active={activeTab} onChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'home') setSelectedMovie(null);
          }} />
        </>
      )}

      {!selectedMovie && !searchOpen && !categoriesOpen && (
        <>
          <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
          <main>
            {activeTab === 'home' && (
              <HomePage 
                onMovieSelect={handleMovieSelect} 
                onCategoriesOpen={handleCategoriesOpen}
              />
            )}
            {activeTab === 'wallet' && <WalletPage />}
            {activeTab === 'downloads' && <DownloadsPage />}
            {activeTab === 'me' && <ProfilePage onTermsClick={handleTermsClick} />}
          </main>
          <BottomNavbar active={activeTab} onChange={setActiveTab} />
        </>
      )}
    </div>
  );
}

function AuthWrapper({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pupa-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
              <AuthWrapper>
                <MainApp />
              </AuthWrapper>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}