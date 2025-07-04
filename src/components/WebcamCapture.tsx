




















import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { UploadProgress } from '../types/movie';

interface WebcamCaptureProps {
  onEmotionDetected: (imageBlob: Blob) => void;
  uploadProgress: UploadProgress;
  disabled?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onEmotionDetected,
  uploadProgress,
  disabled
}) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [lastCaptureTime, setLastCaptureTime] = useState<number>(0);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.onloadedmetadata = () => {
          setVideoReady(true);
          videoRef.current?.play();
        };
      }

      setIsWebcamActive(true);
      setError(null);
    } catch (err: any) {
      setError('Failed to access webcam. Please allow permissions.');
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsWebcamActive(false);
    setVideoReady(false);
    setCountdown(null);
    setIsCapturing(false);
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing || !videoReady) return;
    const now = Date.now();
    if (now - lastCaptureTime < 3000) return;

    setIsCapturing(true);
    setLastCaptureTime(now);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip canvas back to match mirrored preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) onEmotionDetected(blob);
      setIsCapturing(false);
    }, 'image/jpeg', 0.8);
  };

  const startAutoCapture = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        captureFrame();
      }
    }, 1000);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-bold">🎥 Live Emotion Detection</h2>
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              disabled={disabled}
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopWebcam}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Stop Camera
            </button>
          )}
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover"
            style={{ minHeight: '240px', transform: 'scaleX(-1)' }} // Flip preview only
          />
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-6xl font-bold">
              {countdown}
            </div>
          )}
          {isCapturing && (
            <div className="absolute top-4 right-4 bg-red-500 rounded-full p-2 animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {isWebcamActive && (
          <div className="flex gap-4 mb-4">
            <button
              onClick={captureFrame}
              disabled={disabled || isCapturing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full"
            >
              {isCapturing ? 'Capturing...' : '📸 Capture Now'}
            </button>
            <button
              onClick={startAutoCapture}
              disabled={disabled || isCapturing || countdown !== null}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg w-full"
            >
              ⏱️ Auto Capture (3s)
            </button>
          </div>
        )}

        {uploadProgress.status !== 'idle' && (
          <div className="text-center text-sm text-white">
            <div className="flex justify-center items-center space-x-2">
              {uploadProgress.status === 'uploading' && (
                <Loader2 className="animate-spin text-blue-400" />
              )}
              {uploadProgress.status === 'analyzing' && (
                <Loader2 className="animate-spin text-purple-400" />
              )}
              {uploadProgress.status === 'complete' && (
                <CheckCircle className="text-green-400" />
              )}
              {uploadProgress.status === 'error' && (
                <AlertCircle className="text-red-400" />
              )}
              <span>{uploadProgress.message || 'Processing...'}</span>
            </div>
            {(uploadProgress.status === 'uploading' ||
              uploadProgress.status === 'analyzing') && (
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
