// import React, { useState } from 'react';
// import { useAuth } from './contexts/AuthContext';
// import { AuthProvider } from './contexts/AuthContext';
// import Header from './components/Header';
// import Hero from './components/Hero';
// import MovieSection from './components/MovieSection';
// import TVSection from './components/TVSection';
// import SearchResults from './components/SearchResults';
// import RecommendationPage from './components/RecommendationPage';
// import Footer from './components/Footer';
// import LoginScreen from './components/auth/LoginScreen';
// import { trendingMovies, popularMovies, trendingTVShows } from './data/mockData';
// import { Movie, TVShow } from './types/movie';

// type AppView = 'home' | 'search' | 'recommendations';

// function AppContent() {
//   const { user, loading } = useAuth();
//   const [currentView, setCurrentView] = useState<AppView>('home');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<Movie[]>([]);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     if (query.trim()) {
//       // Simple search simulation - in a real app, this would be an API call
//       const results = [...trendingMovies, ...popularMovies].filter(movie =>
//         movie.title.toLowerCase().includes(query.toLowerCase()) ||
//         movie.overview.toLowerCase().includes(query.toLowerCase())
//       );
//       setSearchResults(results);
//       setCurrentView('search');
//     } else {
//       setSearchResults([]);
//       setCurrentView('home');
//     }
//   };

//   const handleMovieClick = (movie: Movie) => {
//     console.log('Movie clicked:', movie);
//     // In a real app, this would navigate to a movie detail page
//   };

//   const handleShowClick = (show: TVShow) => {
//     console.log('TV Show clicked:', show);
//     // In a real app, this would navigate to a TV show detail page
//   };

//   const handleRecommendationClick = () => {
//     setCurrentView('recommendations');
//   };

//   const handleBackToHome = () => {
//     setCurrentView('home');
//     setSearchQuery('');
//     setSearchResults([]);
//   };

//   // Show loading screen while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading MovieDB...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show login screen if user is not authenticated
//   if (!user) {
//     return <LoginScreen />;
//   }

//   const featuredMovie = trendingMovies[0];

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <Header 
//         onSearch={handleSearch} 
//         onRecommendationClick={handleRecommendationClick}
//       />
      
//       {currentView === 'recommendations' ? (
//         <RecommendationPage 
//           onBack={handleBackToHome}
//           onMovieClick={handleMovieClick}
//         />
//       ) : currentView === 'search' ? (
//         <SearchResults 
//           query={searchQuery}
//           results={searchResults}
//           onMovieClick={handleMovieClick}
//         />
//       ) : (
//         <>
//           <Hero movie={featuredMovie} />
          
//           <div className="space-y-8">
//             <MovieSection 
//               title="Trending Movies"
//               movies={trendingMovies}
//               onMovieClick={handleMovieClick}
//             />
            
//             <TVSection 
//               title="Trending TV Shows"
//               shows={trendingTVShows}
//               onShowClick={handleShowClick}
//             />
            
//             <MovieSection 
//               title="Popular Movies"
//               movies={popularMovies}
//               onMovieClick={handleMovieClick}
//             />
//           </div>
//         </>
//       )}
      
//       <Footer />
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;






























import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieSection from './components/MovieSection';
import TVSection from './components/TVSection';
import SearchResults from './components/SearchResults';
import RecommendationPage from './components/RecommendationPage';
import UserProfile from './components/auth/UserProfile';
import Footer from './components/Footer';
import LoginScreen from './components/auth/LoginScreen';
import { trendingMovies, popularMovies, trendingTVShows } from './data/mockData';
import { Movie, TVShow } from './types/movie';

type AppView = 'home' | 'search' | 'recommendations' | 'profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Simple search simulation - in a real app, this would be an API call
      const results = [...trendingMovies, ...popularMovies].filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentView('search');
    } else {
      setSearchResults([]);
      setCurrentView('home');
    }
  };

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie);
    // In a real app, this would navigate to a movie detail page
  };

  const handleShowClick = (show: TVShow) => {
    console.log('TV Show clicked:', show);
    // In a real app, this would navigate to a TV show detail page
  };

  const handleRecommendationClick = () => {
    setCurrentView('recommendations');
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading MovieDB...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  const featuredMovie = trendingMovies[0];

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        onSearch={handleSearch} 
        onRecommendationClick={handleRecommendationClick}
        onProfileClick={handleProfileClick}
      />
      
      {currentView === 'profile' ? (
        <UserProfile />
      ) : currentView === 'recommendations' ? (
        <RecommendationPage 
          onBack={handleBackToHome}
          onMovieClick={handleMovieClick}
        />
      ) : currentView === 'search' ? (
        <SearchResults 
          query={searchQuery}
          results={searchResults}
          onMovieClick={handleMovieClick}
        />
      ) : (
        <>
          <Hero movie={featuredMovie} />
          
          <div className="space-y-8">
            <MovieSection 
              title="Trending Movies"
              movies={trendingMovies}
              onMovieClick={handleMovieClick}
            />
            
            <TVSection 
              title="Trending TV Shows"
              shows={trendingTVShows}
              onShowClick={handleShowClick}
            />
            
            <MovieSection 
              title="Popular Movies"
              movies={popularMovies}
              onMovieClick={handleMovieClick}
            />
          </div>
        </>
      )}
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;