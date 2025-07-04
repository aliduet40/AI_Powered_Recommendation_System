import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Upload, Camera, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import WebcamCapture from './WebcamCapture';
import RecommendationResults from './RecommendationResults';
import { apiService, handleApiError } from '../services/api';
import { Movie, UserAnalysis, UploadProgress } from '../types/movie';

interface RecommendationPageProps {
  onBack: () => void;
  onMovieClick?: (movie: Movie) => void;
}

type InputMethod = 'upload' | 'webcam';

const RecommendationPage: React.FC<RecommendationPageProps> = ({ onBack, onMovieClick }) => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('upload');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const [analysis, setAnalysis] = useState<UserAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const isHealthy = await apiService.checkBackendHealth();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

  const handleImageSelect = async (file: File) => {
    await processImage(file);
  };

  const handleWebcamCapture = async (imageBlob: Blob) => {
    // Convert blob to file
    const file = new File([imageBlob], 'webcam-capture.jpg', { type: 'image/jpeg' });
    await processImage(file);
  };

  const processImage = async (file: File) => {
    console.log('🎯 Starting image processing:', file.name, file.size);
    
    setError(null);
    setAnalysis(null);
    setRecommendations([]);
    
    try {
      // Start upload
      setUploadProgress({ progress: 20, status: 'uploading' });
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 15, 60)
        }));
      }, 300);

      // Switch to analyzing after 1.5 seconds
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadProgress({ progress: 70, status: 'analyzing' });
      }, 1500);

      // Make API call to Flask backend
      console.log('📡 Calling Flask API...');
      const response = await apiService.getRecommendations(file);
      
      console.log('✅ Received response:', response);
      
      // Complete
      setUploadProgress({ progress: 100, status: 'complete' });
      setAnalysis(response.analysis);
      setRecommendations(response.recommendations);
      
      console.log('🎉 Processing complete!', {
        emotion: response.analysis.emotion,
        age: response.analysis.age,
        gender: response.analysis.gender,
        movieCount: response.recommendations.length
      });
      
    } catch (err) {
      console.error('💥 Processing failed:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        message: errorMessage 
      });
    }
  };

  const isProcessing = uploadProgress.status === 'uploading' || uploadProgress.status === 'analyzing';

  const getBackendStatusIcon = () => {
    switch (backendStatus) {
      case 'checking':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case 'checking':
        return 'Checking Flask backend connection...';
      case 'connected':
        return 'Connected to Flask AI Backend - Real emotion detection powered by TensorFlow';
      case 'disconnected':
        return 'Flask backend not available - Please start your Flask server on http://localhost:5000';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span>AI Movie Recommendations</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Get personalized movie recommendations based on your emotion, age, and gender
            </p>
          </div>
        </div>

        {/* Backend Status */}
        <div className={`mb-6 p-4 rounded-lg border ${
          backendStatus === 'connected' 
            ? 'bg-green-900/20 border-green-500/30' 
            : backendStatus === 'disconnected'
            ? 'bg-red-900/20 border-red-500/30'
            : 'bg-yellow-900/20 border-yellow-500/30'
        }`}>
          <div className="flex items-center space-x-3">
            {getBackendStatusIcon()}
            <span className={`text-sm ${
              backendStatus === 'connected' 
                ? 'text-green-300' 
                : backendStatus === 'disconnected'
                ? 'text-red-300'
                : 'text-yellow-300'
            }`}>
              {getBackendStatusText()}
            </span>
            {backendStatus === 'disconnected' && (
              <button
                onClick={checkBackendHealth}
                className="ml-auto px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
              >
                Retry Connection
              </button>
            )}
          </div>
          
          {backendStatus === 'disconnected' && (
            <div className="mt-3 text-xs text-red-200 space-y-1">
              <p>• Make sure Flask server is running: <code className="bg-red-800/30 px-1 rounded">python backend/app.py</code></p>
              <p>• Ensure model files are present: <code className="bg-red-800/30 px-1 rounded">facial_emotion_detection_model.h5</code> and <code className="bg-red-800/30 px-1 rounded">model.pkl</code></p>
              <p>• Check TMDB API token in backend/.env file</p>
            </div>
          )}
        </div>

        {/* Input Method Selector */}
        {!analysis && backendStatus === 'connected' && (
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="bg-slate-800 rounded-xl p-1 flex space-x-1">
                <button
                  onClick={() => setInputMethod('upload')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    inputMethod === 'upload'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  onClick={() => setInputMethod('webcam')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                    inputMethod === 'webcam'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Camera className="h-5 w-5" />
                  <span>Live Camera</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        {!analysis && backendStatus === 'connected' && (
          <div className="mb-12">
            {inputMethod === 'upload' ? (
              <ImageUpload
                onImageSelect={handleImageSelect}
                uploadProgress={uploadProgress}
                disabled={isProcessing}
              />
            ) : (
              <WebcamCapture
                onEmotionDetected={handleWebcamCapture}
                uploadProgress={uploadProgress}
                disabled={isProcessing}
              />
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Processing Failed</p>
                    <pre className="text-red-300 text-sm mt-1 whitespace-pre-wrap">{error}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <RecommendationResults
            analysis={analysis}
            recommendations={recommendations}
            onMovieClick={onMovieClick}
          />
        )}

        {/* How it Works - Only show when backend is connected and no analysis */}
        {!analysis && backendStatus === 'connected' && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Capture/Upload</h3>
                <p className="text-gray-400 text-sm">
                  Upload a photo or use live camera to capture your image
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-400 text-sm">
                  TensorFlow models detect your emotion, age, and gender
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Matching</h3>
                <p className="text-gray-400 text-sm">
                  TMDB API matches your profile with suitable movies
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎬</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Get Recommendations</h3>
                <p className="text-gray-400 text-sm">
                  Receive personalized movie suggestions instantly
                </p>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mt-12 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Powered by Advanced AI</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-blue-400 font-semibold mb-2">Emotion Detection</div>
                  <div className="text-gray-400 text-sm">TensorFlow CNN Model</div>
                  <div className="text-gray-500 text-xs">48x48 grayscale facial analysis</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold mb-2">Age & Gender</div>
                  <div className="text-gray-400 text-sm">Pickle ML Model</div>
                  <div className="text-gray-500 text-xs">128x128 feature extraction</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold mb-2">Movie Matching</div>
                  <div className="text-gray-400 text-sm">TMDB API Integration</div>
                  <div className="text-gray-500 text-xs">Genre-based recommendations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backend Setup Instructions - Show when disconnected */}
        {backendStatus === 'disconnected' && (
          <div className="mt-16 bg-slate-800/30 rounded-xl p-8 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <span>Backend Setup Required</span>
            </h3>
            
            <div className="space-y-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">1. Start Flask Backend</h4>
                <div className="bg-black/30 rounded p-3 font-mono text-sm text-green-400">
                  <div>cd backend</div>
                  <div>pip install -r requirements.txt</div>
                  <div>python app.py</div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">2. Required Files</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <code className="bg-slate-600/50 px-1 rounded">facial_emotion_detection_model.h5</code> - TensorFlow emotion model</li>
                  <li>• <code className="bg-slate-600/50 px-1 rounded">model.pkl</code> - Age/Gender prediction model</li>
                  <li>• <code className="bg-slate-600/50 px-1 rounded">.env</code> file with TMDB_BEARER_TOKEN</li>
                </ul>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">3. Environment Setup</h4>
                <div className="bg-black/30 rounded p-3 font-mono text-sm text-blue-400">
                  <div># backend/.env</div>
                  <div>TMDB_BEARER_TOKEN=your_tmdb_token_here</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;