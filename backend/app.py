
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import pickle
from dotenv import load_dotenv
import tempfile
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# TMDB Configuration
TMDB_BEARER_TOKEN = os.getenv('TMDB_BEARER_TOKEN')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# Global variables for models
emotion_model = None
age_gender_model = None

def load_models():
    global emotion_model, age_gender_model
    try:
        if os.path.exists('facial_emotion_detection_model.h5'):
            emotion_model = load_model('facial_emotion_detection_model.h5')
            logger.info("✅ Emotion detection model loaded successfully")
        else:
            logger.warning("⚠️ Emotion model file not found: facial_emotion_detection_model.h5")

        if os.path.exists('model.pkl'):
            with open('model.pkl', 'rb') as f:
                age_gender_model = pickle.load(f)
            logger.info("✅ Age/Gender model loaded successfully")
        else:
            logger.warning("⚠️ Age/Gender model file not found: model.pkl")

    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")

def detect_face_and_emotion(image_path):
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image file")

        cv2.imwrite("debug_input.jpg", img)  # Save image for debugging

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            logger.warning("⚠️ No face detected in image")
            return {
                'emotion': 'unknown',
                'age': 0,
                'gender': 'unknown',
                'confidence': 0.0
            }

        face = max(faces, key=lambda x: x[2] * x[3])
        x, y, w, h = face
        face_img = gray[y:y + h, x:x + w]

        results = {
            'emotion': 'neutral',
            'age': 25,
            'gender': 'unknown',
            'confidence': 0.85
        }

        if emotion_model is not None:
            try:
                emotion_face = cv2.resize(face_img, (48, 48))
                emotion_face = emotion_face.astype('float32') / 255.0
                emotion_face = np.expand_dims(emotion_face, axis=0)
                emotion_face = np.expand_dims(emotion_face, axis=-1)
                emotion_pred = emotion_model.predict(emotion_face)
                emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
                emotion_idx = np.argmax(emotion_pred[0])
                results['emotion'] = emotions[emotion_idx]
                results['confidence'] = float(emotion_pred[0][emotion_idx])
                logger.info(f"🎭 Detected emotion: {results['emotion']} (confidence: {results['confidence']:.2f})")
            except Exception as e:
                logger.error(f"❌ Emotion prediction error: {str(e)}")

        if age_gender_model is not None:
            try:
                ag_face = cv2.resize(face_img, (128, 128))
                ag_face = ag_face.astype('float32') / 255.0
                ag_face = ag_face.reshape(1, 128, 128, 1)
                prediction = age_gender_model.predict(ag_face)
                gender = 'female' if round(prediction[0][0][0]) == 1 else 'male'
                age = int(round(prediction[1][0][0]))
                results['gender'] = gender
                results['age'] = age
                logger.info(f"👤 Detected: {gender}, age {age}")
            except Exception as e:
                logger.error(f"❌ Age/Gender prediction error: {str(e)}")

        return results

    except Exception as e:
        logger.error(f"❌ Face detection error: {str(e)}")
        return {
            'emotion': 'unknown',
            'age': 0,
            'gender': 'unknown',
            'confidence': 0.0
        }

def get_movie_recommendations(emotion, age, gender):
    emotion_genres = {
        'happy': [35, 10751, 16],
        'sad': [18, 10749],
        'angry': [28, 53, 80],
        'fear': [27, 9648],
        'surprise': [12, 878],
        'disgust': [99, 36],
        'neutral': [18, 35, 28]
    }

    if age < 13:
        genres = [16, 10751]
    elif age < 18:
        genres = [12, 16, 35, 10751]
    elif age < 30:
        genres = emotion_genres.get(emotion, [28, 35, 878])
    else:
        genres = emotion_genres.get(emotion, [18, 53, 36])

    headers = {
        'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
        'Content-Type': 'application/json'
    }

    movies = []

    for genre_id in genres[:2]:
        try:
            response = requests.get(
                f'{TMDB_BASE_URL}/discover/movie',
                headers=headers,
                params={
                    'with_genres': genre_id,
                    'sort_by': 'popularity.desc',
                    'page': 1
                },
                timeout=10
            )
            logger.info(f"TMDB response for genre {genre_id}: {response.status_code}")
            data = response.json()
            for movie in data.get('results', [])[:5]:
                movies.append({
                    'title': movie.get('title', 'Unknown'),
                    'overview': movie.get('overview', 'No description available'),
                    'rating': movie.get('vote_average', 7.0),
                    'release_date': movie.get('release_date', '2023-01-01'),
                    'poster_url': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if movie.get('poster_path') else None,
                    'genres': [genre_id]
                })
        except Exception as e:
            logger.error(f"❌ Error fetching genre {genre_id}: {str(e)}")

    logger.info(f"✅ Sending {len(movies)} recommendations")

    return movies[:10] if movies else []

@app.route('/api/recommend', methods=['POST'])
def recommend_movies():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
            file.save(tmp_file.name)
            temp_path = tmp_file.name

        try:
            analysis = detect_face_and_emotion(temp_path)
            recommendations = get_movie_recommendations(
                analysis['emotion'], analysis['age'], analysis['gender']
            )
            response = {
                'analysis': analysis,
                'recommendations': recommendations,
                'message': 'Analysis complete'
            }
            return jsonify(response)
        finally:
            try:
                os.unlink(temp_path)
            except:
                pass

    except Exception as e:
        logger.error(f"❌ Recommendation error: {str(e)}")
        return jsonify({'error': str(e), 'message': 'Failed to process image'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'emotion_model': emotion_model is not None,
        'age_gender_model': age_gender_model is not None,
        'tmdb_token': TMDB_BEARER_TOKEN is not None
    })

@app.route('/')
def index():
    return jsonify({'message': '✅ Flask backend is running.'})

if __name__ == '__main__':
    logger.info("🚀 Starting Flask server...")
    load_models()
    if TMDB_BEARER_TOKEN:
        logger.info("✅ TMDB Bearer Token configured")
    else:
        logger.warning("⚠️ TMDB Bearer Token not found")
    app.run(host='127.0.0.1', port=5000, debug=True)
