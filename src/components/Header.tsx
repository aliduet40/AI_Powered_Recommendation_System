// import React, { useState } from 'react';
// import { Search, Menu, X, Film, Tv, Star, Sparkles } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import UserMenu from './auth/UserMenu';

// interface HeaderProps {
//   onSearch: (query: string) => void;
//   onRecommendationClick: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ onSearch, onRecommendationClick }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const { user } = useAuth();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch(searchQuery);
//   };

//   return (
//     <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <Film className="h-8 w-8 text-blue-400" />
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               MovieDB
//             </span>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
//               <Film className="h-4 w-4" />
//               <span>Movies</span>
//             </a>
//             <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
//               <Tv className="h-4 w-4" />
//               <span>TV Shows</span>
//             </a>
//             <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
//               <Star className="h-4 w-4" />
//               <span>Popular</span>
//             </a>
//             <button 
//               onClick={onRecommendationClick}
//               className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
//             >
//               <Sparkles className="h-4 w-4" />
//               <span>AI Recommendations</span>
//             </button>
//           </nav>

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="hidden md:flex items-center">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search movies, TV shows..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-slate-800 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-700 transition-all"
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//             </div>
//           </form>

//           {/* User Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user && <UserMenu />}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-md hover:bg-slate-800 transition-colors"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-slate-700">
//             <div className="space-y-4">
//               <form onSubmit={handleSearch} className="mb-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search movies, TV shows..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="bg-slate-800 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-700 transition-all"
//                   />
//                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
//                 </div>
//               </form>
              
//               <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
//                 <Film className="h-4 w-4" />
//                 <span>Movies</span>
//               </a>
//               <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
//                 <Tv className="h-4 w-4" />
//                 <span>TV Shows</span>
//               </a>
//               <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
//                 <Star className="h-4 w-4" />
//                 <span>Popular</span>
//               </a>
//               <button 
//                 onClick={onRecommendationClick}
//                 className="flex items-center space-x-2 py-2 text-purple-400 hover:text-purple-300 transition-colors"
//               >
//                 <Sparkles className="h-4 w-4" />
//                 <span>AI Recommendations</span>
//               </button>

//               {/* Mobile User Menu */}
//               {user && (
//                 <div className="pt-4 border-t border-slate-700">
//                   <UserMenu />
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;











import React, { useState } from 'react';
import { Search, Menu, X, Film, Tv, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './auth/UserMenu';

interface HeaderProps {
  onSearch: (query: string) => void;
  onRecommendationClick: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onRecommendationClick, onProfileClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MovieDB
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <Film className="h-4 w-4" />
              <span>Movies</span>
            </a>
            <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <Tv className="h-4 w-4" />
              <span>TV Shows</span>
            </a>
            <a href="#" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
              <Star className="h-4 w-4" />
              <span>Popular</span>
            </a>
            <button 
              onClick={onRecommendationClick}
              className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Recommendations</span>
            </button>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-700 transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && <UserMenu onProfileClick={onProfileClick} />}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies, TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800 text-white placeholder-slate-400 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-slate-700 transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </form>
              
              <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
                <Film className="h-4 w-4" />
                <span>Movies</span>
              </a>
              <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
                <Tv className="h-4 w-4" />
                <span>TV Shows</span>
              </a>
              <a href="#" className="flex items-center space-x-2 py-2 hover:text-blue-400 transition-colors">
                <Star className="h-4 w-4" />
                <span>Popular</span>
              </a>
              <button 
                onClick={onRecommendationClick}
                className="flex items-center space-x-2 py-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>AI Recommendations</span>
              </button>

              {/* Mobile User Menu */}
              {user && (
                <div className="pt-4 border-t border-slate-700">
                  <UserMenu onProfileClick={onProfileClick} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;