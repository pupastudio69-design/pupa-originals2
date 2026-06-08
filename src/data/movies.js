// PUPA Originals - Content Data

const COLORS = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9', 'FF8C94', 'A8E6CF'];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// Random images from Unsplash
const MOVIE_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop',
];

const BACKDROP_IMAGES = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop',
];

const TV_IMAGES = [
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=225&fit=crop',
];

export const TEST_VIDEO = {
  id: 'test-1',
  title: 'Pupa Originals Test',
  description: 'This is a test video for PUPA Originals platform.',
  youtubeId: 'dQw4w9WgXcQ',
  poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
  backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop',
  year: '2024',
  genre: ['Drama'],
  rating: 4.8,
  duration: '2:15:00',
  cast: ['Test Actor 1', 'Test Actor 2'],
  director: 'Test Director',
  isNew: true,
  isPupaOriginal: true,
  type: 'movie',
  category: 'hollywood',
  likes: 1200
};

export const ALL_MOVIES = [
  TEST_VIDEO,
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `movie-${i}`,
    title: `Movie ${i + 1}`,
    description: 'Coming soon to PUPA Originals.',
    youtubeId: null,
    poster: MOVIE_POSTERS[i % MOVIE_POSTERS.length],
    backdrop: BACKDROP_IMAGES[i % BACKDROP_IMAGES.length],
    year: '2024',
    genre: ['Drama'],
    rating: 4.0 + Math.random() * 1.5,
    duration: '2:00:00',
    cast: ['Actor A', 'Actor B'],
    director: 'Director Name',
    isNew: i < 5,
    isPupaOriginal: i === 0,
    type: 'movie',
    category: ['action', 'drama', 'comedy', 'romance', 'thriller'][i % 5],
    likes: Math.floor(Math.random() * 2000)
  }))
];

export const TRENDING = ALL_MOVIES.slice(0, 8);
export const PUPA_ORIGINALS = ALL_MOVIES.filter(m => m.isPupaOriginal).slice(0, 8);
export const NEW_RELEASES = ALL_MOVIES.filter(m => m.isNew).slice(0, 8);
export const TOP_RATED = [...ALL_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 8);
export const COMMUNITY_PICKS = ALL_MOVIES.slice(4, 12);

// For You
export const FOR_YOU = (userHistory = []) => {
  if (userHistory.length === 0) return TRENDING.slice(0, 8);
  return ALL_MOVIES.filter(m => userHistory.some(h => m.genre.includes(h))).slice(0, 8);
};

// TV Shows with episodes
export const TV_SHOWS = Array.from({ length: 10 }, (_, i) => ({
  id: `show-${i}`,
  title: `Show ${i + 1}`,
  type: 'tv',
  seasons: 2,
  episodes: 12,
  description: 'Coming soon to PUPA Originals.',
  poster: TV_IMAGES[i % TV_IMAGES.length],
  backdrop: TV_IMAGES[i % TV_IMAGES.length],
  year: '2024',
  genre: ['Drama'],
  rating: 4.0 + Math.random() * 1.5,
  isNew: i < 3,
  category: ['drama', 'action', 'thriller'][i % 3],
  likes: Math.floor(Math.random() * 1500),
  episodeList: [
    { number: 1, title: 'Pilot', size: '176.8MB', duration: '45:00' },
    { number: 2, title: 'The Next Day', size: '169.6MB', duration: '42:00' },
    { number: 3, title: 'New Beginnings', size: '182.3MB', duration: '48:00' },
    { number: 4, title: 'Dark Secrets', size: '175.1MB', duration: '44:00' },
    { number: 5, title: 'The Truth', size: '190.5MB', duration: '50:00' },
    { number: 6, title: 'Revelations', size: '168.9MB', duration: '41:00' },
  ]
}));

// Upcoming releases
export const UPCOMING = Array.from({ length: 6 }, (_, i) => ({
  id: `upcoming-${i}`,
  title: `Upcoming ${i + 1}`,
  type: i % 2 === 0 ? 'movie' : 'tv',
  releaseDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  poster: i % 2 === 0 ? MOVIE_POSTERS[i % MOVIE_POSTERS.length] : TV_IMAGES[i % TV_IMAGES.length],
  backdrop: BACKDROP_IMAGES[i % BACKDROP_IMAGES.length],
  description: 'Coming soon to PUPA Originals.',
  genre: ['Drama'],
  rating: 4.2 + Math.random(),
  isNew: true
}));

// Categories for overlay
export const CATEGORIES = [
  { id: 'action', name: 'Action', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop' },
  { id: 'drama', name: 'Drama', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop' },
  { id: 'comedy', name: 'Comedy', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop' },
  { id: 'romance', name: 'Romance', image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=200&fit=crop' },
  { id: 'thriller', name: 'Thriller', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=200&fit=crop' },
  { id: 'horror', name: 'Horror', image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=200&fit=crop' },
  { id: 'documentary', name: 'Documentary', image: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&h=200&fit=crop' },
  { id: 'nollywood', name: 'Nollywood', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=200&fit=crop' },
  { id: 'hollywood', name: 'Hollywood', image: 'https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=300&h=200&fit=crop' },
];

// Sections for CategoriesGrid
export const ACTION = ALL_MOVIES.filter(m => m.category === 'action').slice(0, 8);
export const DRAMA = ALL_MOVIES.filter(m => m.category === 'drama').slice(0, 8);
export const COMEDY = ALL_MOVIES.filter(m => m.category === 'comedy').slice(0, 8);
export const ROMANCE = ALL_MOVIES.filter(m => m.category === 'romance').slice(0, 8);
export const THRILLER = ALL_MOVIES.filter(m => m.category === 'thriller').slice(0, 8);
export const CLASSIC = ALL_MOVIES.slice(0, 8);
export const DOCUMENTARY = ALL_MOVIES.slice(8, 16);
export const TOP_10 = [...ALL_MOVIES].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);

export const getMovieById = (id) => {
  const allContent = [...ALL_MOVIES, ...TV_SHOWS, ...UPCOMING];
  return allContent.find(item => item.id === id);
};

export const getContentByCategory = (categoryId) => {
  if (categoryId === 'all') return [...ALL_MOVIES, ...TV_SHOWS];
  return [...ALL_MOVIES, ...TV_SHOWS].filter(item => item.category === categoryId);
};