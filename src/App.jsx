import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { auth, app } from './firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import SplashScreen from './components/SplashScreen';
import TopNavbar from './components/TopNavbar';
import BottomNavbar from './components/BottomNavbar';
import SearchOverlay from './components/SearchOverlay';
import CategoriesOverlay from './components/CategoriesOverlay';

// Pages
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVShowsPage';
import DownloadsPage from './pages/DownloadsPage';
import ProfilePage from './pages/ProfilePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import WatchlistPage from './pages/WatchlistPage';
import RewardsPage from './pages/RewardsPage';
import ReferralsPage from './pages/ReferralsPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CategoryPage from './pages/CategoryPage';
import UserProfilePage from './pages/UserProfilePage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import WelcomePage from './pages/WelcomePage';

// Legal
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';

// Initialize Firebase Messaging
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.log('Firebase Messaging not available:', err);
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-400 font-bold mb-2">Something went wrong</p>
            <p className="text-gray-500 text-xs mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-bold"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync active tab with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') setActiveTab('home');
    else if (path === '/tv-shows') setActiveTab('tv-shows');
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
            .then((token) => console.log('Push token:', token))
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
      case 'tv-shows': navigate('/tv-shows'); break;
      case 'downloads': navigate('/downloads'); break;
      case 'me': navigate('/me'); break;
    }
  };

  const handleCategoriesOpen = () => setCategoriesOpen(true);

  // Don't show navbar on certain pages
  const isMoviePage = location.pathname.startsWith('/movie/');
  const isWelcomePage = location.pathname === '/welcome';
  const hideNav = isMoviePage || isWelcomePage;

  return (
    <div className="relative min-h-screen bg-[#0a0a1a]">
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

      {!hideNav && <TopNavbar onSearchOpen={() => setSearchOpen(true)} />}

      <main>
        <Routes>
          <Route path="/" element={<HomePage onCategoriesOpen={handleCategoriesOpen} />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/me" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/referrals" element={<ReferralsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>

      {!hideNav && <BottomNavbar active={activeTab} onChange={handleTabChange} />}
    </div>
  );
}

function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
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
        <SubscriptionProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/welcome" element={
                <AuthGuard>
                  <WelcomePage />
                </AuthGuard>
              } />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <MainLayout />
                  </AuthGuard>
                }
              />
            </Routes>
          </ErrorBoundary>
          <Analytics />
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}