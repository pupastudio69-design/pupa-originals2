import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import SplashScreen from './components/SplashScreen';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import SearchOverlay from './components/SearchOverlay';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WalletPage from './pages/WalletPage';
import DownloadsPage from './pages/DownloadsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

// Main app with tabs (your existing layout)
function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBack = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="relative min-h-screen bg-pupa-bg noise">
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onMovieSelect={(m) => { setSelectedMovie(m); setSearchOpen(false); }}
        />
      )}

      {selectedMovie && !searchOpen && (
        <>
          <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
          <MovieDetailPage movie={selectedMovie} onBack={handleBack} />
          <BottomNavbar active={activeTab} onChange={setActiveTab} />
        </>
      )}

      {!selectedMovie && !searchOpen && (
        <>
          <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
          <main>
            {activeTab === 'home' && <HomePage onMovieSelect={handleMovieSelect} />}
            {activeTab === 'wallet' && <WalletPage />}
            {activeTab === 'downloads' && <DownloadsPage />}
            {activeTab === 'me' && <ProfilePage />}
          </main>
          <BottomNavbar active={activeTab} onChange={setActiveTab} />
        </>
      )}
    </div>
  );
}

// Auth wrapper to protect routes
function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    </BrowserRouter>
  );
}