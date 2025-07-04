import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadProgress } from '../types/movie';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  uploadProgress: UploadProgress;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, uploadProgress, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onImageSelect(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (uploadProgress.status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-400" />;
      case 'analyzing':
        return <Loader2 className="h-5 w-5 animate-spin text-purple-400" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (uploadProgress.status) {
      case 'uploading':
        return 'Uploading image...';
      case 'analyzing':
        return 'Analyzing your photo...';
      case 'complete':
        return 'Analysis complete!';
      case 'error':
        return uploadProgress.message || 'An error occurred';
      default:
        return uploadProgress.message || '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-400/10'
            : selectedImage
            ? 'border-green-400 bg-green-400/5'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-w-full max-h-64 rounded-lg shadow-lg"
              />
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {uploadProgress.status !== 'idle' && (
              <div className="flex items-center justify-center space-x-2 text-sm">
                {getStatusIcon()}
                <span className="text-gray-300">{getStatusMessage()}</span>
              </div>
            )}

            {uploadProgress.status === 'uploading' || uploadProgress.status === 'analyzing' ? (
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-slate-700 rounded-full">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Your Photo
              </h3>
              <p className="text-gray-400 mb-4">
                Upload a clear photo of yourself to get personalized movie recommendations
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Camera className="h-4 w-4" />
                  <span>JPG, PNG, WebP</span>
                </div>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Your photo is processed securely and not stored on our servers
      </div>
    </div>
  );
};

export default ImageUpload;