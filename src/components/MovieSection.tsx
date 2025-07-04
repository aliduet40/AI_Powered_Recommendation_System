import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, movies, onMovieClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-48">
              <MovieCard 
                movie={movie} 
                onClick={() => onMovieClick?.(movie)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieSection;