// PUPA Originals - Content Data
// Replace poster URLs with your Bunny CDN links when ready

export const TEST_VIDEO = {
  id: 'test-1',
  title: 'Pupa Originals Test',
  description: 'This is a test video for PUPA Originals platform.',
  youtubeId: 'dQw4w9WgXcQ', // Replace with your actual test video ID
  poster: 'https://placehold.co/300x450/1a1a2e/FFD700?text=Pupa+Test',
  backdrop: 'https://placehold.co/800x450/1a1a2e/FFD700?text=Pupa+Originals',
  year: '2024',
  genre: ['Drama'],
  rating: 4.8,
  duration: '2:15:00',
  cast: ['Test Actor 1', 'Test Actor 2'],
  director: 'Test Director',
  isNew: true,
  isPupaOriginal: true
};

// Placeholder movies for UI testing - replace with real CDN links
export const ALL_MOVIES = [
  TEST_VIDEO,
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: `Movie ${i + 1}`,
    description: 'Coming soon to PUPA Originals.',
    youtubeId: null,
    poster: `https://placehold.co/300x450/1a1a2e/666666?text=Movie+${i + 1}`,
    backdrop: `https://placehold.co/800x450/1a1a2e/666666?text=Movie+${i + 1}`,
    year: '2024',
    genre: ['Drama'],
    rating: 4.0 + Math.random() * 1.5,
    duration: '2:00:00',
    cast: ['Actor A', 'Actor B'],
    director: 'Director Name',
    isNew: i < 5,
    isPupaOriginal: i === 0
  }))
];

export const TRENDING = ALL_MOVIES.slice(0, 8);
export const PUPA_ORIGINALS = ALL_MOVIES.filter(m => m.isPupaOriginal).slice(0, 8);
export const NEW_RELEASES = ALL_MOVIES.filter(m => m.isNew).slice(0, 8);
export const TOP_RATED = [...ALL_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 8);
export const COMMUNITY_PICKS = ALL_MOVIES.slice(4, 12);

// TV Shows placeholders
export const TV_SHOWS = Array.from({ length: 10 }, (_, i) => ({
  id: `show-${i}`,
  title: `Show ${i + 1}`,
  type: 'series',
  seasons: 2,
  episodes: 12,
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/666666?text=Show+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/666666?text=Show+${i + 1}`,
  year: '2024',
  genre: ['Drama'],
  rating: 4.0 + Math.random() * 1.5,
  isNew: i < 3
}));

// Documentaries placeholders
export const DOCUMENTARIES = Array.from({ length: 8 }, (_, i) => ({
  id: `doc-${i}`,
  title: `Documentary ${i + 1}`,
  type: 'documentary',
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/666666?text=Doc+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/666666?text=Doc+${i + 1}`,
  year: '2024',
  genre: ['Documentary'],
  rating: 4.2 + Math.random() * 1.0,
  duration: '1:30:00'
}));

// Entertainment placeholders
export const ENTERTAINMENT = Array.from({ length: 8 }, (_, i) => ({
  id: `ent-${i}`,
  title: `Entertainment ${i + 1}`,
  type: 'entertainment',
  description: 'Coming soon to PUPA Originals.',
  poster: `https://placehold.co/300x450/1a1a2e/666666?text=Ent+${i + 1}`,
  backdrop: `https://placehold.co/800x450/1a1a2e/666666?text=Ent+${i + 1}`,
  year: '2024',
  genre: ['Entertainment'],
  rating: 4.0 + Math.random() * 1.5,
  duration: '1:00:00'
}));