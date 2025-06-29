 import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Heart, 
  History, 
  Settings, 
  Star, 
  Film, 
  Tv, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Eye,
  Bookmark,
  Download,
  Share2,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Movie } from '../../types/movie';

interface UserStats {
  totalWatched: number;
  favoriteGenres: string[];
  avgRating: number;
  totalRecommendations: number;
  joinDate: string;
  lastActive: string;
}

interface UserPreferences {
  favoriteGenres: string[];
  preferredLanguages: string[];
  contentRating: string;
  autoplay: boolean;
  notifications: {
    newReleases: boolean;
    recommendations: boolean;
    watchlistUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showWatchHistory: boolean;
    showRatings: boolean;
  };
  theme: 'dark' | 'light' | 'auto';
}

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'watchlist' | 'history' | 'preferences' | 'stats'>('overview');
  const [userStats, setUserStats] = useState<UserStats>({
    totalWatched: 127,
    favoriteGenres: ['Action', 'Sci-Fi', 'Drama'],
    avgRating: 4.2,
    totalRecommendations: 45,
    joinDate: '2024-01-15',
    lastActive: new Date().toISOString()
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: ['Action', 'Drama', 'Comedy'],
    preferredLanguages: ['English', 'Spanish'],
    contentRating: 'PG-13',
    autoplay: true,
    notifications: {
      newReleases: true,
      recommendations: true,
      watchlistUpdates: false
    },
    privacy: {
      profileVisibility: 'public',
      showWatchHistory: true,
      showRatings: true
    },
    theme: 'dark'
  });

  const [editForm, setEditForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    bio: '',
    location: '',
    website: ''
  });

  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watchHistory, setWatchHistory] = useState<Movie[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    loadUserData();
  }, [user]);

  const loadUserData = () => {
    if (!user) return;
    
    const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    const savedWatchlist = localStorage.getItem(`watchlist_${user.id}`);
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    const savedHistory = localStorage.getItem(`history_${user.id}`);
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory));
    }
  };

  const saveUserData = () => {
    if (!user) return;
    
    localStorage.setItem(`preferences_${user.id}`, JSON.stringify(preferences));
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(watchlist));
    localStorage.setItem(`history_${user.id}`, JSON.stringify(watchHistory));
  };

  const handleSaveProfile = () => {
    // Save profile changes
    saveUserData();
    setIsEditing(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Japanese', 'Korean', 'Chinese', 'Hindi', 'Arabic', 'Russian'
  ];

  const contentRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

  if (!user) return null;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {initials}
              </div>
              <button className="absolute bottom-2 right-2 bg-slate-700 hover:bg-slate-600 rounded-full p-2 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-slate-700 text-white rounded-lg px-4 py-2 w-full max-w-md"
                    placeholder="Full Name"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-slate-700 text-white rounded-lg px-4 py-2 w-full max-w-md h-20 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-slate-700 text-white rounded-lg px-4 py-2 w-full max-w-md"
                    placeholder="Location"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{displayName}</h1>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <p className="text-gray-300 mb-4">Movie enthusiast • Joined {new Date(userStats.joinDate).toLocaleDateString()}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Film className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300">{userStats.totalWatched} watched</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-300">{userStats.avgRating}/5 avg rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-gray-300">{watchlist.length} in watchlist</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
            { id: 'history', label: 'History', icon: History },
            { id: 'stats', label: 'Statistics', icon: TrendingUp },
            { id: 'preferences', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                      <div className="w-12 h-12 bg-slate-600 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Watched "Movie Title {i}"</p>
                        <p className="text-gray-400 text-sm">2 hours ago</p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <Download className="h-4 w-4 text-blue-400" />
                    <span className="text-white">Export Data</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <Share2 className="h-4 w-4 text-green-400" />
                    <span className="text-white">Share Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <Bell className="h-4 w-4 text-yellow-400" />
                    <span className="text-white">Notifications</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Watchlist Tab */}
          {activeTab === 'watchlist' && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Bookmark className="h-5 w-5 text-blue-400" />
                <span>My Watchlist ({watchlist.length})</span>
              </h3>
              {watchlist.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your watchlist is empty</p>
                  <p className="text-gray-500">Add movies you want to watch later</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Watchlist items would go here */}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <History className="h-5 w-5 text-blue-400" />
                <span>Watch History</span>
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                    <div className="w-16 h-24 bg-slate-600 rounded-lg"></div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">Movie Title {i}</h4>
                      <p className="text-gray-400 text-sm">Watched on {new Date().toLocaleDateString()}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">2h 15m</p>
                      <p className="text-green-400 text-sm">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Viewing Stats */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Viewing Stats</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Movies</span>
                    <span className="text-white font-semibold">{userStats.totalWatched}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Average Rating</span>
                    <span className="text-white font-semibold">{userStats.avgRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Hours</span>
                    <span className="text-white font-semibold">254h</span>
                  </div>
                </div>
              </div>

              {/* Favorite Genres */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span>Top Genres</span>
                </h3>
                <div className="space-y-3">
                  {userStats.favoriteGenres.map((genre, index) => (
                    <div key={genre} className="flex items-center justify-between">
                      <span className="text-gray-300">{genre}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full" 
                            style={{ width: `${100 - (index * 20)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-sm">{100 - (index * 20)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span>This Month</span>
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">12</div>
                    <div className="text-gray-400 text-sm">Movies Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">28h</div>
                    <div className="text-gray-400 text-sm">Total Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Content Preferences */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Film className="h-5 w-5 text-blue-400" />
                  <span>Content Preferences</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Favorite Genres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Favorite Genres</label>
                    <div className="grid grid-cols-2 gap-2">
                      {genres.map(genre => (
                        <label key={genre} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={preferences.favoriteGenres.includes(genre)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences(prev => ({
                                  ...prev,
                                  favoriteGenres: [...prev.favoriteGenres, genre]
                                }));
                              } else {
                                setPreferences(prev => ({
                                  ...prev,
                                  favoriteGenres: prev.favoriteGenres.filter(g => g !== genre)
                                }));
                              }
                            }}
                            className="rounded border-gray-600 bg-slate-700 text-blue-600"
                          />
                          <span className="text-gray-300 text-sm">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Languages</label>
                    <div className="space-y-2">
                      {languages.slice(0, 6).map(language => (
                        <label key={language} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={preferences.preferredLanguages.includes(language)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPreferences(prev => ({
                                  ...prev,
                                  preferredLanguages: [...prev.preferredLanguages, language]
                                }));
                              } else {
                                setPreferences(prev => ({
                                  ...prev,
                                  preferredLanguages: prev.preferredLanguages.filter(l => l !== language)
                                }));
                              }
                            }}
                            className="rounded border-gray-600 bg-slate-700 text-blue-600"
                          />
                          <span className="text-gray-300">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Rating */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Maximum Content Rating</label>
                  <select
                    value={preferences.contentRating}
                    onChange={(e) => handlePreferenceChange('contentRating', e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2"
                  >
                    {contentRatings.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  <span>Notifications</span>
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(preferences.notifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="rounded border-gray-600 bg-slate-700 text-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Privacy Settings</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
                    <select
                      value={preferences.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Show Watch History</span>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showWatchHistory}
                      onChange={(e) => handlePrivacyChange('showWatchHistory', e.target.checked)}
                      className="rounded border-gray-600 bg-slate-700 text-blue-600"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Show Ratings</span>
                    <input
                      type="checkbox"
                      checked={preferences.privacy.showRatings}
                      onChange={(e) => handlePrivacyChange('showRatings', e.target.checked)}
                      className="rounded border-gray-600 bg-slate-700 text-blue-600"
                    />
                  </label>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-purple-400" />
                  <span>Appearance</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-gray-300">Autoplay Videos</span>
                    <input
                      type="checkbox"
                      checked={preferences.autoplay}
                      onChange={(e) => handlePreferenceChange('autoplay', e.target.checked)}
                      className="rounded border-gray-600 bg-slate-700 text-blue-600"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center space-x-2">
                  <Trash2 className="h-5 w-5" />
                  <span>Danger Zone</span>
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Clear All Watch History
                  </button>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={saveUserData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;