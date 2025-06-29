#!/usr/bin/env python3
"""
Flask Backend Startup Script for MovieDB AI Recommendations
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def check_backend_directory():
    """Check if backend directory exists"""
    if not os.path.exists('backend'):
        print("❌ Backend directory not found")
        print("Please run this script from the project root directory")
        return False
    print("✅ Backend directory found")
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([
            sys.executable, '-m', 'pip', 'install', '-r', 'backend/requirements.txt'
        ], check=True, cwd='.')
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def check_model_files():
    """Check if required model files exist"""
    model_files = [
        'backend/facial_emotion_detection_model.h5',
        'backend/model.pkl'
    ]
    
    missing_files = []
    for file_path in model_files:
        if os.path.exists(file_path):
            print(f"✅ Found: {file_path}")
        else:
            print(f"⚠️  Missing: {file_path}")
            missing_files.append(file_path)
    
    if missing_files:
        print("\n📝 Note: Some AI model files are missing.")
        print("The backend will still run but AI features will be limited.")
        print("To get full AI functionality, please add these files:")
        for file in missing_files:
            print(f"  - {file}")
        print()
    
    return True

def check_env_file():
    """Check if .env file exists"""
    env_path = 'backend/.env'
    if os.path.exists(env_path):
        print("✅ Environment file found")
        return True
    else:
        print("⚠️  Environment file not found")
        print("Creating .env file with default values...")
        
        # Create .env file with default values
        env_content = """TMDB_API_KEY=31e3c0d8cbece50f8d259ab577324d57
TMDB_BEARER_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWUzYzBkOGNiZWNlNTBmOGQyNTlhYjU3NzMyNGQ1NyIsIm5iZiI6MTc0OTQ5Mjc3NC4wMjQsInN1YiI6IjY4NDcyNDI2Y2IxM2U0YzYxN2RlNzQ5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zZw-5uemO7k990b623V4y8E-40FeUIeDP-o15vE0370
SECRET_KEY=FINALYEARPROJECT2025"""
        
        try:
            with open(env_path, 'w') as f:
                f.write(env_content)
            print("✅ Environment file created")
            return True
        except Exception as e:
            print(f"❌ Failed to create .env file: {e}")
            return False

def start_flask_server():
    """Start the Flask server"""
    print("\n🚀 Starting Flask backend server...")
    print("Server will be available at: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        # Change to backend directory and run app.py
        os.chdir('backend')
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}")
        return False
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🎬 MovieDB AI Backend Startup")
    print("=" * 40)
    
    # Run all checks
    checks = [
        check_python_version,
        check_backend_directory,
        check_env_file,
        check_model_files,
        install_dependencies
    ]
    
    for check in checks:
        if not check():
            print("\n❌ Startup failed. Please fix the issues above and try again.")
            return False
        print()
    
    print("🎉 All checks passed! Starting server...")
    print()
    
    # Start the server
    return start_flask_server()

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)