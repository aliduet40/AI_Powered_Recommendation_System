# Movie Recommendation Website with AI

A modern movie discovery platform with AI-powered recommendations based on facial emotion, age, and gender detection using TensorFlow and Flask backend.

## Features

### 🎬 Core Features
- **Movie Discovery**: Browse trending and popular movies
- **TV Shows**: Explore trending TV series
- **Search**: Find movies and shows by title or description
- **Responsive Design**: Works perfectly on all devices
- **User Authentication**: CSV-based login system

### 🤖 AI Recommendations
- **Photo Upload**: Upload your photo for personalized recommendations
- **Live Camera**: Real-time emotion detection via webcam
- **Emotion Detection**: TensorFlow CNN model analyzes facial expressions
- **Demographic Analysis**: Detects age and gender using ML models
- **Smart Recommendations**: TMDB API integration for movie suggestions

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark interface
- **Smooth Animations**: Hover effects and transitions
- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: Focus states and keyboard navigation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **Vite** for development and building

### Backend
- **Flask** with Python
- **TensorFlow** for emotion detection
- **OpenCV** for image processing
- **Scikit-learn** for age/gender prediction
- **TMDB API** for movie data
- **Flask-CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Flask backend server
- TMDB API Bearer Token

### Frontend Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
```
Edit `.env` and set your Flask backend URL:
```
VITE_API_URL=http://localhost:5000
```

3. **Start development server**:
```bash
npm run dev
```

### Backend Installation

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
Create a `.env` file in the backend directory:
```
TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
```

4. **Ensure you have the required model files**:
- `facial_emotion_detection_model.h5` (TensorFlow emotion model)
- `model.pkl` (Age/Gender prediction model)

5. **Start Flask server**:
```bash
python app.py
```

The Flask server will run on `http://localhost:5000`

## API Endpoints

### Frontend Integration Endpoints

#### 1. Get Recommendations
```python
POST /api/recommend
Content-Type: multipart/form-data

# Expects: 'file' parameter with image
# Returns: {
#   "analysis": {
#     "emotion": "happy",
#     "gender": "male", 
#     "age": 25,
#     "confidence": 0.95
#   },
#   "recommendations": [...movies],
#   "message": "Analysis complete"
# }
```

#### 2. Analyze Image Only
```python
POST /api/analyze
Content-Type: multipart/form-data

# Expects: 'file' parameter with image
# Returns: {
#   "emotion": "happy",
#   "gender": "male",
#   "age": 25, 
#   "confidence": 0.95
# }
```

#### 3. Live Camera Data
```python
GET /live_data
# Returns: {
#   "emotion": "happy",
#   "gender": "male",
#   "age": 25,
#   "recommendations": [...movies]
# }
```

#### 4. Health Check
```python
GET /api/health
# Returns: {
#   "status": "healthy",
#   "emotion_model": true,
#   "age_gender_model": true
# }
```

### Movie Object Structure
```python
{
    "title": "Movie Title",
    "rating": 8.5,
    "genres": ["Action", "Adventure"],
    "poster_url": "https://image.tmdb.org/t/p/w500/...",
    "overview": "Movie description..."
}
```

## AI Models

### Emotion Detection
- **Model**: TensorFlow CNN (.h5 format)
- **Input**: 48x48 grayscale facial images
- **Output**: 7 emotions (angry, disgust, fear, happy, neutral, sad, surprise)
- **Preprocessing**: Face detection → Crop → Resize → Normalize

### Age & Gender Prediction
- **Model**: Scikit-learn model (.pkl format)
- **Input**: 128x128 grayscale images
- **Output**: Gender (Male/Female) and Age (numeric)
- **Preprocessing**: Resize → Normalize → Flatten

### Movie Recommendation Logic
1. **Emotion Mapping**: Each emotion maps to specific movie genres
2. **Age Groups**: Child, Teen, Adult, Senior preferences
3. **Gender Preferences**: Genre preferences by gender
4. **TMDB Integration**: Real movie data from The Movie Database

## Project Structure

```
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── services/           # API integration
│   ├── types/              # TypeScript types
│   └── contexts/           # React contexts
├── backend/                # Flask backend
│   ├── app.py             # Main Flask application
│   ├── tmdb_api.py        # TMDB API integration
│   ├── requirements.txt   # Python dependencies
│   └── static/uploads/    # Temporary image storage
└── README.md
```

## Key Features Implementation

### 1. Real-time Emotion Detection
- Live webcam feed processing
- Face detection using OpenCV
- TensorFlow model inference
- Real-time movie recommendations

### 2. Image Upload Analysis
- Drag & drop file upload
- Image preprocessing pipeline
- Batch analysis with progress tracking
- Error handling for invalid files

### 3. TMDB Integration
- Genre-based movie filtering
- Popularity-based sorting
- High-quality movie posters
- Detailed movie information

### 4. User Authentication
- CSV-based user storage
- Local session management
- Form validation
- Secure password handling

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
python app.py        # Start Flask server
# Models are loaded automatically on startup
```

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy 'dist' folder to your hosting service
```

### Backend Deployment
- Ensure model files are included
- Set environment variables
- Install Python dependencies
- Configure CORS for production domain

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
```

## Troubleshooting

### Common Issues

1. **Models not loading**: Ensure `.h5` and `.pkl` files are in backend directory
2. **CORS errors**: Flask-CORS is configured for all origins in development
3. **Camera access**: Requires HTTPS in production for webcam features
4. **TMDB API**: Verify bearer token is valid and has proper permissions

### Performance Tips

1. **Model Loading**: Models are loaded once at startup
2. **Image Processing**: Temporary files are cleaned up automatically
3. **API Caching**: Consider caching TMDB responses for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (both frontend and backend)
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- TensorFlow for emotion detection models
- The Movie Database (TMDB) for movie data
- OpenCV for computer vision capabilities
- React and Flask communities for excellent documentation