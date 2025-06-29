export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
}

// New interfaces for recommendation system
export interface UserAnalysis {
  emotion: string;
  gender: string;
  age: number;
  confidence: number;
}

export interface RecommendationRequest {
  image: File;
}

export interface RecommendationResponse {
  analysis: UserAnalysis;
  recommendations: Movie[];
  message: string;
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  message?: string;
}