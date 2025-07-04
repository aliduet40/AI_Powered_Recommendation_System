import React from 'react';
import { Star, Calendar, Eye } from 'lucide-react';
import { TVShow } from '../types/movie';

interface TVShowCardProps {
  show: TVShow;
  onClick?: () => void;
}

const TVShowCard: React.FC<TVShowCardProps> = ({ show, onClick }) => {
  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-slate-800">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={show.poster_path}
            alt={show.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-semibold">{show.vote_average.toFixed(1)}</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Show Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {show.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(show.first_air_date).getFullYear()}</span>
            </div>
            <span>{show.vote_count.toLocaleString()} votes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowCard;