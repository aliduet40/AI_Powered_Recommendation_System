import { User } from '../types/auth';

// Simple CSV-like storage using localStorage
const USERS_KEY = 'moviedb_users';

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
}

// Get all users from localStorage
const getUsers = (): StoredUser[] => {
  try {
    const usersData = localStorage.getItem(USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save user data');
  }
};

// Generate simple ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sign up new user
export const signUp = async (email: string, password: string, fullName: string): Promise<User> => {
  if (!email || !password || !fullName) {
    throw new Error('All fields are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const users = getUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  // Create new user
  const newUser: StoredUser = {
    id: generateId(),
    email: email.toLowerCase(),
    password, // In a real app, this should be hashed
    fullName,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Return user without password
  return {
    id: newUser.id,
    email: newUser.email,
    user_metadata: {
      full_name: newUser.fullName
    },
    created_at: newUser.createdAt
  };
};

// Sign in user
export const signIn = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const users = getUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Return user without password
  return {
    id: user.id,
    email: user.email,
    user_metadata: {
      full_name: user.fullName
    },
    created_at: user.createdAt
  };
};

// Get current user from session
export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Save current user session
export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem('current_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving current user:', error);
  }
};

// Sign out user
export const signOut = (): void => {
  try {
    localStorage.removeItem('current_user');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Export users data as CSV (for debugging/admin purposes)
export const exportUsersAsCSV = (): string => {
  const users = getUsers();
  const headers = ['ID', 'Email', 'Full Name', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      user.id,
      user.email,
      `"${user.fullName}"`,
      user.createdAt
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

// Get user statistics
export const getUserStats = () => {
  const users = getUsers();
  return {
    totalUsers: users.length,
    recentUsers: users.filter(user => {
      const userDate = new Date(user.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return userDate > weekAgo;
    }).length
  };
};