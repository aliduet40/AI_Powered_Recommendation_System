import axios from 'axios';
import { Movie, RecommendationResponse, UserAnalysis } from '../types/movie';

// Configure axios with your Flask backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for image processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Check if backend is available
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await api.get('/api/health');
      console.log('🏥 Backend Health:', response.data);
      return response.data.status === 'healthy';
    } catch (error) {
      console.warn('⚠️ Backend health check failed:', error);
      return false;
    }
  },

  // Upload image and get movie recommendations
  async getRecommendations(imageFile: File): Promise<RecommendationResponse> {
    console.log('📤 Uploading image for recommendations:', imageFile.name, imageFile.size);
    
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post('/api/recommend', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Transform Flask response to match frontend expectations
    return transformFlaskResponse(response.data);
  },

  // Real-time emotion detection for webcam
  async detectEmotionRealtime(imageBlob: Blob): Promise<RecommendationResponse> {
    console.log('📷 Processing webcam capture:', imageBlob.size);
    
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam-capture.jpg');

    const response = await api.post('/api/recommend', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return transformFlaskResponse(response.data);
  },

  // Get live data from webcam feed
  async getLiveData(): Promise<{
    emotion: string | null;
    gender: string | null;
    age: number | null;
    recommendations: any[];
  }> {
    const response = await api.get('/live_data');
    return response.data;
  },

  // Search movies (fallback to mock data for now)
  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
      return response.data.results || [];
    } catch (error) {
      // Fallback to mock search if endpoint doesn't exist
      console.warn('Search endpoint not available, using mock data');
      return [];
    }
  },

  // Get trending movies (fallback to mock data)
  async getTrendingMovies(): Promise<Movie[]> {
    try {
      const response = await api.get('/api/trending/movies');
      return response.data.results || [];
    } catch (error) {
      console.warn('Trending endpoint not available, using mock data');
      return [];
    }
  },

  // Get popular movies (fallback to mock data)
  async getPopularMovies(): Promise<Movie[]> {
    try {
      const response = await api.get('/api/popular/movies');
      return response.data.results || [];
    } catch (error) {
      console.warn('Popular endpoint not available, using mock data');
      return [];
    }
  },

  // Analyze image without recommendations (for testing)
  async analyzeImage(imageFile: File): Promise<UserAnalysis> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post('/api/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Stop camera feed
  async stopCamera(): Promise<void> {
    await api.get('/stop_camera');
  },
};

// Transform Flask response to match frontend expectations
export const transformFlaskResponse = (flaskData: any): RecommendationResponse => {
  console.log('🔄 Transforming Flask response:', flaskData);
  
  // Handle case where Flask returns direct analysis data
  if (flaskData.analysis) {
    // Already in correct format
    const analysis: UserAnalysis = {
      emotion: flaskData.analysis.emotion || 'neutral',
      gender: flaskData.analysis.gender || 'unknown',
      age: flaskData.analysis.age || 25,
      confidence: flaskData.analysis.confidence || 0.85
    };

    const recommendations: Movie[] = (flaskData.recommendations || []).map((movie: any, index: number) => ({
      id: index + 1000,
      title: movie.title || 'Unknown Title',
      overview: movie.overview || 'No overview available.',
      poster_path: movie.poster_url && movie.poster_url !== 'N/A' 
        ? movie.poster_url 
        : `https://images.pexels.com/photos/${7991579 + index}/pexels-photo-${7991579 + index}.jpeg?auto=compress&cs=tinysrgb&w=500`,
      backdrop_path: movie.poster_url && movie.poster_url !== 'N/A'
        ? movie.poster_url.replace('w500', 'w1200')
        : `https://images.pexels.com/photos/${7991579 + index}/pexels-photo-${7991579 + index}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
      release_date: movie.release_date || '2023-01-01',
      vote_average: typeof movie.rating === 'number' ? movie.rating : 7.5,
      vote_count: Math.floor(Math.random() * 5000) + 1000,
      genre_ids: movie.genres ? movie.genres.map(() => Math.floor(Math.random() * 20) + 10) : [18, 35],
      adult: false,
      original_language: 'en',
      original_title: movie.title || 'Unknown Title',
      popularity: Math.random() * 1000 + 500,
      video: false
    }));

    return {
      analysis,
      recommendations,
      message: flaskData.message || 'Analysis complete'
    };
  }

  // Handle case where Flask returns flat data (legacy format)
  const emotionMap: { [key: string]: string } = {
    'angry': 'angry',
    'disgust': 'disgust', 
    'fear': 'fear',
    'happy': 'happy',
    'neutral': 'neutral',
    'sad': 'sad',
    'surprise': 'surprised'
  };

  const analysis: UserAnalysis = {
    emotion: emotionMap[flaskData.emotion?.toLowerCase()] || flaskData.emotion || 'neutral',
    gender: flaskData.gender?.toLowerCase() || 'unknown',
    age: flaskData.age || 25,
    confidence: (flaskData.confidence || flaskData.emotion_confidence || 85) / 100
  };

  // Transform Flask movie recommendations to frontend Movie format
  const recommendations: Movie[] = (flaskData.recommendations || []).map((movie: any, index: number) => ({
    id: index + 1000,
    title: movie.title || 'Unknown Title',
    overview: movie.overview || 'No overview available.',
    poster_path: movie.poster_url && movie.poster_url !== 'N/A' 
      ? movie.poster_url 
      : `https://images.pexels.com/photos/${7991579 + index}/pexels-photo-${7991579 + index}.jpeg?auto=compress&cs=tinysrgb&w=500`,
    backdrop_path: movie.poster_url && movie.poster_url !== 'N/A'
      ? movie.poster_url.replace('w500', 'w1200')
      : `https://images.pexels.com/photos/${7991579 + index}/pexels-photo-${7991579 + index}.jpeg?auto=compress&cs=tinysrgb&w=1200`,
    release_date: movie.release_date || '2023-01-01',
    vote_average: typeof movie.rating === 'number' ? movie.rating : 7.5,
    vote_count: Math.floor(Math.random() * 5000) + 1000,
    genre_ids: movie.genres ? movie.genres.map(() => Math.floor(Math.random() * 20) + 10) : [18, 35],
    adult: false,
    original_language: 'en',
    original_title: movie.title || 'Unknown Title',
    popularity: Math.random() * 1000 + 500,
    video: false
  }));

  return {
    analysis,
    recommendations,
    message: 'Analysis complete'
  };
};

// Error handling utility
export const handleApiError = (error: any): string => {
  console.error('🚨 API Error Details:', error);
  
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.error || error.response.data?.message || 'Server error occurred';
    return `Server Error (${error.response.status}): ${message}`;
  } else if (error.request) {
    // Request was made but no response received
    return 'Unable to connect to Flask backend. Please ensure:\n• Flask server is running on http://localhost:5000\n• CORS is enabled\n• Required model files are present';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};