import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-slate-900 rounded-2xl px-8 py-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Form content */}
          <div className="mt-4">
            {mode === 'login' ? (
              <LoginForm 
                onSwitchToSignup={() => setMode('signup')}
                onClose={onClose}
              />
            ) : (
              <SignupForm 
                onSwitchToLogin={() => setMode('login')}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;