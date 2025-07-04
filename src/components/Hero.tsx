import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{new Date(movie.release_date).getFullYear()}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{movie.vote_count.toLocaleString()} votes</span>
            </div>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-xl">
              {movie.overview}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" />
                <span>Play Trailer</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-800/80 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700/80 transition-all border border-gray-600">
                <Info className="h-5 w-5" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;