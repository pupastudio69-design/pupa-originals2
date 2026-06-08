// PUPA Originals - Content Data
// Replace poster URLs with your Bunny CDN links when ready

const COLORS = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9', 'FF8C94', 'A8E6CF'];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const TEST_VIDEO = {
  id: 'test-1',
  title: 'Pupa Originals Test',
  description: 'This is a test video for PUPA Originals platform.',
  youtubeId: 'dQw4w9WgXcQ',
  poster: 'https://placehold.co/300x450/1a1a2e/FFD700?text=Pupa+Test',
  backdrop: 'https://placehold.co/800x450/1a1a2e/FFD700?text=Pupa+Originals',
  year: '2024',
  genre: ['Drama'],
  rating: 4.8,
  duration: '2:15:00',
  cast: ['Test Actor 1', 'Test Actor 2'],
  director: 'Test Director',
  isNew: true,
  isPupaOriginal: true,
  type: 'movie'
};

export const ALL_MOVIES = [
  TEST_VIDEO,
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: `Movie ${i + 1}`,
    description: 'Coming soon to PUPA Originals.',
    youtubeId: null,
    poster: `https://placehold.co/300x450/1a1a2e/${getRandomColor()}?text=Movie+${i + 1}`,
    backdrop: `https://placehold.co/800x450/1a1a2e/${getRandomColor()}?text=Movie+${i + 1}`,
    year: '2024',
    genre: ['Drama'],
    rating: 4.0 + Math.random() * 1.5,
    duration: '2:00:00',
    cast: ['Actor A', 'Actor B'],
    director: 'Director Name',
    isNew: i < 5,
    isPupaOriginal: i === 0,
    type: 'movie'
  }))
];

export const TRENDING = ALL_MOVIES.slice(0, 8);
export const PUPA_ORIGINALS = ALL_MOVIES.filter(m => m.isPupaOriginal).slice(0, 8);
export const NEW_RELEASES = ALL_MOVIES.filter(m => m.isNew).slice(0, 8);
export const TOP_RATED = [...ALL_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 8);
export const COMMUNITY_PICKS = ALL_MOVIES.slice(4, 12);

// For You - based on user preferences (default to trending)
export const FOR_YOU = (userHistory = []) => {
  if (userHistory.length === 0) return TRENDING.slice(0, 8);
  return ALL_MOVIES.filter(m => userHistory.some(h => m.genre.includes(h))).slice(0, 8);
};

// TV Shows with episodes and file sizes
export const TV_SHOWS = Array.from({ length: 12 }, (_, i) => ({
  id: `show-${i}`,
  title: `TV Show ${i + 1}`,
  type: 'tv',
  seasons: 2,
  totalEpisodes: 12,
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/${getRandomColor()}?text=Show+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/${getRandomColor()}?text=Show+${i + 1}`,
  year: '2024',
  genre: ['Drama'],
  rating: 4.0 + Math.random() * 1.5,
  isNew: i < 3,
  isPupaOriginal: i === 0,
  episodes: [
    { number: 1, title: 'Pilot', size: '176.8MB', duration: '45:00' },
    { number: 2, title: 'The Next Day', size: '169.6MB', duration: '42:00' },
    { number: 3, title: 'New Beginnings', size: '182.3MB', duration: '48:00' },
    { number: 4, title: 'The Truth', size: '175.1MB', duration: '46:00' },
    { number: 5, title: 'Crossroads', size: '168.9MB', duration: '44:00' },
    { number: 6, title: 'Revelations', size: '190.2MB', duration: '50:00' },
    { number: 7, title: 'The Plan', size: '171.4MB', duration: '43:00' },
    { number: 8, title: 'Dark Night', size: '185.7MB', duration: '47:00' },
    { number: 9, title: 'Allies', size: '164.3MB', duration: '41:00' },
    { number: 10, title: 'Betrayal', size: '178.5MB', duration: '45:00' },
    { number: 11, title: 'The Escape', size: '173.2MB', duration: '44:00' },
    { number: 12, title: 'Finale', size: '195.8MB', duration: '52:00' }
  ]
}));

export const DOCUMENTARIES = Array.from({ length: 8 }, (_, i) => ({
  id: `doc-${i}`,
  title: `Documentary ${i + 1}`,
  type: 'documentary',
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/${getRandomColor()}?text=Doc+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/${getRandomColor()}?text=Doc+${i + 1}`,
  year: '2024',
  genre: ['Documentary'],
  rating: 4.2 + Math.random() * 1.0,
  duration: '1:30:00'
}));

export const ENTERTAINMENT = Array.from({ length: 8 }, (_, i) => ({
  id: `ent-${i}`,
  title: `Entertainment ${i + 1}`,
  type: 'entertainment',
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/${getRandomColor()}?text=Ent+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/${getRandomColor()}?text=Ent+${i + 1}`,
  year: '2024',
  genre: ['Entertainment'],
  rating: 4.0 + Math.random() * 1.5,
  duration: '1:00:00'
}));

// Upcoming Calendar - placeholder data
export const UPCOMING = [
  { id: 'up-1', title: 'Lagos Nights', type: 'movie', releaseDate: '2026-06-15', poster: 'https://placehold.co/300x450/1a1a2e/FF6B6B?text=Lagos+Nights' },
  { id: 'up-2', title: 'Queen of Benin', type: 'tv', releaseDate: '2026-06-20', poster: 'https://placehold.co/300x450/1a1a2e/4ECDC4?text=Queen+of+Benin' },
  { id: 'up-3', title: 'Afrobeats Rising', type: 'movie', releaseDate: '2026-06-25', poster: 'https://placehold.co/300x450/1a1a2e/FFEAA7?text=Afrobeats' },
  { id: 'up-4', title: 'The Last Warrior', type: 'tv', releaseDate: '2026-07-01', poster: 'https://placehold.co/300x450/1a1a2e/DDA0DD?text=Last+Warrior' },
  { id: 'up-5', title: 'Nollywood Dreams', type: 'movie', releaseDate: '2026-07-05', poster: 'https://placehold.co/300x450/1a1a2e/96CEB4?text=Nollywood' },
  { id: 'up-6', title: 'Island Life', type: 'tv', releaseDate: '2026-07-10', poster: 'https://placehold.co/300x450/1a1a2e/85C1E9?text=Island+Life' }
];

export const getMovieById = (id) => {
  const allContent = [...ALL_MOVIES, ...TV_SHOWS, ...DOCUMENTARIES, ...ENTERTAINMENT, ...UPCOMING];
  return allContent.find(item => item.id === id);
};