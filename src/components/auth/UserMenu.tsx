// import React, { useState, useRef, useEffect } from 'react';
// import { User, LogOut, Settings, Heart, History, ChevronDown } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// const UserMenu: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const { user, signOut } = useAuth();

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       setIsOpen(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   if (!user) return null;

//   const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
//   const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

//   return (
//     <div className="relative" ref={menuRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 rounded-full px-3 py-2 transition-colors"
//       >
//         <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
//           {initials}
//         </div>
//         <span className="text-white text-sm font-medium hidden sm:block">{displayName}</span>
//         <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50">
//           {/* User info */}
//           <div className="px-4 py-3 border-b border-slate-700">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 {initials}
//               </div>
//               <div>
//                 <p className="text-white font-medium">{displayName}</p>
//                 <p className="text-gray-400 text-sm">{user.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Menu items */}
//           <div className="py-2">
//             <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
//               <User className="h-4 w-4" />
//               <span>Profile</span>
//             </button>
//             <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
//               <Heart className="h-4 w-4" />
//               <span>Favorites</span>
//             </button>
//             <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
//               <History className="h-4 w-4" />
//               <span>Watch History</span>
//             </button>
//             <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
//               <Settings className="h-4 w-4" />
//               <span>Settings</span>
//             </button>
//           </div>

//           {/* Sign out */}
//           <div className="border-t border-slate-700 pt-2">
//             <button
//               onClick={handleSignOut}
//               className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
//             >
//               <LogOut className="h-4 w-4" />
//               <span>Sign Out</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMenu;             




import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Heart, History, ChevronDown, BarChart3, Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  onProfileClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 rounded-full px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">{displayName}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <div>
                <p className="text-white font-medium">{displayName}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <button 
              onClick={() => handleMenuItemClick(() => onProfileClick?.())}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>View Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Bookmark className="h-4 w-4" />
              <span>My Watchlist</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <History className="h-4 w-4" />
              <span>Watch History</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Statistics</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-700 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;