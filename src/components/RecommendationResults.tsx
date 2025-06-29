import React from 'react';
import { User, Heart, Calendar, Star, Sparkles, TrendingUp, Award } from 'lucide-react';
import { UserAnalysis, Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface RecommendationResultsProps {
  analysis: UserAnalysis;
  recommendations: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  analysis,
  recommendations,
  onMovieClick
}) => {
  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
      sad: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      angry: 'text-red-400 bg-red-400/10 border-red-400/30',
      surprised: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      neutral: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
      fear: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
      disgust: 'text-green-400 bg-green-400/10 border-green-400/30'
    };
    return colors[emotion.toLowerCase()] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      surprised: '😲',
      neutral: '😐',
      fear: '😨',
      disgust: '🤢'
    };
    return emojis[emotion.toLowerCase()] || '🎭';
  };

  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === 'male' ? '👨' : '👩';
  };

  return (
    <div className="space-y-12">
      {/* Analysis Results */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-600/50 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Your AI Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-xl p-6 text-center border ${getEmotionColor(analysis.emotion)}`}>
            <div className="text-4xl mb-3">{getEmotionEmoji(analysis.emotion)}</div>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Detected Emotion</div>
            <div className={`font-bold text-lg capitalize ${getEmotionColor(analysis.emotion).split(' ')[0]}`}>
              {analysis.emotion}
            </div>
          </div>
          
          <div className="bg-blue-400/10 border border-blue-400/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">{getGenderIcon(analysis.gender)}</div>
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Gender</div>
            <div className="font-bold text-lg text-blue-400 capitalize">
              {analysis.gender}
            </div>
          </div>
          
          <div className="bg-green-400/10 border border-green-400/30 rounded-xl p-6 text-center">
            <Calendar className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Estimated Age</div>
            <div className="font-bold text-lg text-green-400">
              {analysis.age} years
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-700/50 rounded-full px-4 py-2">
            <Award className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-300">
              Analysis Confidence: <span className="text-white font-semibold">{(analysis.confidence * 100).toFixed(1)}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Heart className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white">
            Movies Picked Just for You
          </h3>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Based on your {analysis.emotion} mood and profile, here are movies that will resonate with you
        </p>
      </div>

      {/* Movie Recommendations Grid */}
      {recommendations.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎬</div>
          <div className="text-gray-400 text-xl mb-2">
            No recommendations found
          </div>
          <div className="text-gray-500">
            Try uploading a different photo for better results
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {recommendations.map((movie, index) => (
            <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick?.(movie)}
                size="medium"
              />
            </div>
          ))}
        </div>
      )}

      {/* Recommendation Stats */}
      {recommendations.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span className="text-white font-semibold">Recommendation Stats</span>
            </div>
            <div className="text-gray-400 text-sm">
              {recommendations.length} movies found
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {recommendations.length}
              </div>
              <div className="text-xs text-gray-400">Total Movies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {(recommendations.reduce((sum, movie) => sum + movie.vote_average, 0) / recommendations.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-400">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.max(...recommendations.map(movie => new Date(movie.release_date).getFullYear()))}
              </div>
              <div className="text-xs text-gray-400">Latest Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {(analysis.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">Match Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Explanation */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/30">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <span>Why These Movies?</span>
        </h4>
        <div className="text-gray-300 space-y-3 leading-relaxed">
          <p>
            Our AI detected that you're feeling <span className={`font-semibold ${getEmotionColor(analysis.emotion).split(' ')[0]}`}>
              {analysis.emotion}
            </span>, so we've curated movies that complement your current emotional state.
          </p>
          <p>
            Based on your demographic profile ({analysis.gender}, {analysis.age} years old) and emotional analysis, 
            these films have been selected from our database of movies that resonate well with viewers sharing similar characteristics.
          </p>
          <p className="text-sm text-gray-400 italic">
            Our recommendation engine uses advanced facial analysis combined with collaborative filtering 
            to suggest movies you're most likely to enjoy right now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;