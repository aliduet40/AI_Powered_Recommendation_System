import React from 'react';
import { Star, Calendar, Eye, Play } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-40',
    medium: 'w-48',
    large: 'w-56'
  };

  const aspectRatios = {
    small: 'aspect-[2/3]',
    medium: 'aspect-[2/3]',
    large: 'aspect-[2/3]'
  };

  return (
    <div 
      className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${sizeClasses[size]}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl bg-slate-800 border border-slate-700/50">
        {/* Poster Image */}
        <div className={`relative ${aspectRatios[size]} overflow-hidden`}>
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 border border-yellow-400/30">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-bold">{movie.vote_average.toFixed(1)}</span>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-8 w-8 text-white fill-current" />
            </div>
          </div>

          {/* Hover Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="text-white space-y-2">
              <h3 className="font-bold text-sm leading-tight line-clamp-2">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{(movie.vote_count / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Info - Always Visible */}
        <div className="p-4 bg-gradient-to-b from-slate-800 to-slate-900">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-yellow-400 font-medium">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          {/* Overview Preview */}
          <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;