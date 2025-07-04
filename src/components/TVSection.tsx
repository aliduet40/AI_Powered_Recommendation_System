import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TVShow } from '../types/movie';
import TVShowCard from './TVShowCard';

interface TVSectionProps {
  title: string;
  shows: TVShow[];
  onShowClick?: (show: TVShow) => void;
}

const TVSection: React.FC<TVSectionProps> = ({ title, shows, onShowClick }) => {
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
          {shows.map((show) => (
            <div key={show.id} className="flex-none w-48">
              <TVShowCard 
                show={show} 
                onClick={() => onShowClick?.(show)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TVSection;