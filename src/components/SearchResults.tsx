import React from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface SearchResultsProps {
  query: string;
  results: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results, onMovieClick }) => {
  if (!query) return null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          Search Results for "{query}" ({results.length} results)
        </h2>
        
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie} 
                onClick={() => onMovieClick?.(movie)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;