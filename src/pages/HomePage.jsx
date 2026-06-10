import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Bell, Play, Clock, Star, Calendar } from 'lucide-react';
import {
  TRENDING,
  PUPA_ORIGINALS,
  NEW_RELEASES,
  TOP_RATED,
  TV_SHOWS,
  UPCOMING,
  FOR_YOU,
  CATEGORIES
} from '../data/movies.js';

// Hero Banner with Auto-Slide
function HeroBanner() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      id: 'hero-1',
      title: 'Pupa Originals',
      subtitle: 'Exclusive Content',
      description: 'Watch the latest original series and movies only on Pupa.',
      backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
      rating: 4.9,
      year: '2024',
      duration: '2:15:00'
    },
    {
      id: 'hero-2',
      title: 'The Last Stand',
      subtitle: 'New Release',
      description: 'An epic action thriller that will keep you on the edge of your seat.',
      backdrop: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
      rating: 4.7,
      year: '2024',
      duration: '1:58:00'
    },
    {
      id: 'hero-3',
      title: 'Dark Waters',
      subtitle: 'Trending Now',
      description: 'A mysterious journey into the unknown depths of the ocean.',
      backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=450&fit=crop',
      rating: 4.5,
      year: '2024',
      duration: '2:05:00'
    },
    {
      id: 'hero-4',
      title: 'City Lights',
      subtitle: 'Pupa Original',
      description: 'A romantic drama set in the heart of the city.',
      backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=450&fit=crop',
      rating: 4.8,
      year: '2024',
      duration: '1:45:00'
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  const slide = heroSlides[currentSlide];

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{ height: '55vh', minHeight: '320px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
        >
          <img src={s.backdrop} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/80 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 pb-8">
        <div className="max-w-md">
          <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase mb-2 block">
            {slide.subtitle}
          </span>
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{slide.title}</h1>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{slide.description}</p>
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {slide.rating}
            </span>
            <span>{slide.year}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{slide.duration}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/movie/${slide.id}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
            >
              <Play size={16} fill="black" /> Watch Now
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Bell size={16} /> Remind Me
            </button>
          </div>
        </div>
      </div>

      <button onClick={goToPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60">
        <ChevronLeftIcon />
      </button>
      <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60">
        <ChevronRightIcon />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: index === currentSlide ? 24 : 6,
              height: 6,
              backgroundColor: index === currentSlide ? '#facc15' : 'rgba(255,255,255,0.4)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Categories Row
function CategoriesRow({ onCategoriesOpen }) {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-sm">Categories</h2>
        <button 
          onClick={onCategoriesOpen}
          className="text-emerald-400 text-xs flex items-center gap-1 hover:text-yellow-400 transition-colors"
        >
          See All <ChevronRight size={14} />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 bg-white/5 text-gray-300 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Sticky Search Bar
function StickySearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 60);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div 
      ref={searchRef}
      className={`px-4 py-3 transition-all duration-300 ${
        isSticky ? 'sticky top-[60px] z-40 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <form onSubmit={handleSearch} className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, shows, actors..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all"
        />
      </form>
    </div>
  );
}

// Movie Card (2:3 portrait)
function MovieCard({ movie }) {
  const navigate = useNavigate();
  if (!movie) return null;
  return (
    <button onClick={() => navigate(`/movie/${movie.id}`)} className="flex-shrink-0 group relative" style={{ width: 130 }}>
      <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title || 'Movie'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {movie.isNew && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">NEW</span>}
        {movie.isPupaOriginal && <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-bold rounded-md">PUPA</span>}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 rounded-full bg-yellow-400/90 flex items-center justify-center">
            <Play size={18} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
      </div>
      <p className="text-white text-xs font-medium mt-1.5 truncate text-left">{movie.title || 'Untitled'}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Star size={10} className="text-yellow-400 fill-yellow-400" />
        <span className="text-gray-500 text-[10px]">{movie.rating?.toFixed(1) || '0.0'}</span>
      </div>
    </button>
  );
}

// TV Show Card (16:9 landscape)
function TVShowCard({ show }) {
  const navigate = useNavigate();
  if (!show) return null;
  return (
    <button onClick={() => navigate(`/movie/${show.id}`)} className="flex-shrink-0 group relative" style={{ width: 200 }}>
      <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src={show.backdrop || show.poster || 'https://via.placeholder.com/400x225'} alt={show.title || 'Show'} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {show.isNew && <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">NEW</span>}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium truncate">{show.title || 'Untitled'}</p>
          <p className="text-gray-400 text-[10px]">{show.seasons || 1} Season{(show.seasons || 1) > 1 ? 's' : ''} · {show.episodes || 0} Episodes</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="w-10 h-10 rounded-full bg-yellow-400/90 flex items-center justify-center">
            <Play size={18} fill="black" className="text-black ml-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
}

// Content Row
function ContentRow({ title, items = [], CardComponent = MovieCard, seeAllLink }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-white font-bold text-base">{title}</h2>
        {seeAllLink && (
          <button onClick={() => navigate(seeAllLink)} className="flex items-center gap-1 text-gray-400 text-xs hover:text-yellow-400 transition-colors">
            See All <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          {items.map((item) => (
            <CardComponent key={item?.id || Math.random()} movie={item} show={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Upcoming Calendar Row
function UpcomingRow() {
  const [reminders, setReminders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pupa_reminders') || '[]');
    } catch {
      return [];
    }
  });

  const toggleReminder = (id) => {
    const newReminders = reminders.includes(id) ? reminders.filter(r => r !== id) : [...reminders, id];
    setReminders(newReminders);
    try {
      localStorage.setItem('pupa_reminders', JSON.stringify(newReminders));
    } catch (e) {
      console.error('Failed to save reminder:', e);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays <= 7) return `${diffDays} days`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Soon';
    }
  };

  if (!UPCOMING || UPCOMING.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-yellow-400" />
          <h2 className="text-white font-bold text-base">Upcoming</h2>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
        {UPCOMING.map((item) => (
          <div key={item?.id || Math.random()} className="flex-shrink-0 relative rounded-xl overflow-hidden" style={{ width: 160, aspectRatio: '2/3' }}>
            <img src={item?.poster || 'https://via.placeholder.com/300x450'} alt={item?.title || 'Upcoming'} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 left-2 right-2">
              <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-[10px] font-bold rounded-md backdrop-blur-sm">
                {formatDate(item?.releaseDate)}
              </span>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs font-medium truncate">{item?.title || 'Untitled'}</p>
              <p className="text-gray-400 text-[10px]">{item?.type === 'tv' ? 'TV Series' : 'Movie'}</p>
              <button
                onClick={(e) => { e.stopPropagation(); toggleReminder(item?.id); }}
                className={`mt-1.5 w-full py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  reminders.includes(item?.id) ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {reminders.includes(item?.id) ? 'Reminded' : 'Remind Me'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// For You Row
function ForYouRow() {
  let forYouItems = [];
  try {
    forYouItems = FOR_YOU() || [];
  } catch (e) {
    console.error('FOR_YOU failed:', e);
  }
  return <ContentRow title="For You" items={forYouItems} seeAllLink="/for-you" />;
}

export default function HomePage({ onCategoriesOpen }) {
  return (
    <div className="min-h-screen bg-[#0a0a1a] pb-24">
      <HeroBanner />
      <CategoriesRow onCategoriesOpen={onCategoriesOpen} />
      <StickySearchBar />
      <ForYouRow />
      <ContentRow title="TV Shows" items={TV_SHOWS} CardComponent={TVShowCard} seeAllLink="/tv-shows" />
      <ContentRow title="Trending Now" items={TRENDING} seeAllLink="/trending" />
      <ContentRow title="Pupa Originals" items={PUPA_ORIGINALS} seeAllLink="/originals" />
      <ContentRow title="New Releases" items={NEW_RELEASES} seeAllLink="/new" />
      <UpcomingRow />
      <ContentRow title="Top Rated" items={TOP_RATED} seeAllLink="/top-rated" />
    </div>
  );
}