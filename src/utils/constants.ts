// API endpoints
export const API_ENDPOINTS = {
  RECOMMEND: '/api/recommend',
  ANALYZE: '/api/analyze',
  MOVIES: '/api/movies',
  SEARCH: '/api/search',
  TRENDING: '/api/trending',
  POPULAR: '/api/popular',
} as const;

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  TIMEOUT: 30000, // 30 seconds
} as const;

// Emotion mappings
export const EMOTION_CONFIG = {
  COLORS: {
    happy: 'text-yellow-400',
    sad: 'text-blue-400',
    angry: 'text-red-400',
    surprised: 'text-purple-400',
    neutral: 'text-gray-400',
    fear: 'text-orange-400',
    disgust: 'text-green-400',
  },
  EMOJIS: {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    fear: '😨',
    disgust: '🤢',
  },
} as const;