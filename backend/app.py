# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import requests
# import os
# import cv2
# import numpy as np
# from tensorflow.keras.models import load_model
# import pickle
# from dotenv import load_dotenv
# import tempfile
# import logging

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # TMDB Configuration
# TMDB_BEARER_TOKEN = os.getenv('TMDB_BEARER_TOKEN')
# TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# # Global variables for models
# emotion_model = None
# age_gender_model = None

# def load_models():
#     """Load AI models on startup"""
#     global emotion_model, age_gender_model
    
#     try:
#         # Load emotion detection model
#         if os.path.exists('facial_emotion_detection_model.h5'):
#             emotion_model = load_model('facial_emotion_detection_model.h5')
#             logger.info("✅ Emotion detection model loaded successfully")
#         else:
#             logger.warning("⚠️ Emotion model file not found: facial_emotion_detection_model.h5")
        
#         # Load age/gender model
#         if os.path.exists('model.pkl'):
#             with open('model.pkl', 'rb') as f:
#                 age_gender_model = pickle.load(f)
#             logger.info("✅ Age/Gender model loaded successfully")
#         else:
#             logger.warning("⚠️ Age/Gender model file not found: model.pkl")
            
#     except Exception as e:
#         logger.error(f"❌ Error loading models: {str(e)}")

# def detect_face_and_emotion(image_path):
#     """Detect face and predict emotion, age, gender"""
#     try:
#         # Read image
#         img = cv2.imread(image_path)
#         if img is None:
#             raise ValueError("Could not read image file")
        
#         # Convert to RGB
#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
#         # Load face cascade
#         face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
#         # Detect faces
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
#         if len(faces) == 0:
#             raise ValueError("No face detected in the image")
        
#         # Use the largest face
#         face = max(faces, key=lambda x: x[2] * x[3])
#         x, y, w, h = face
        
#         # Extract face region
#         face_img = gray[y:y+h, x:x+w]
        
#         results = {
#             'emotion': 'neutral',
#             'age': 25,
#             'gender': 'unknown',
#             'confidence': 0.85
#         }
        
#         # Emotion prediction
#         if emotion_model is not None:
#             try:
#                 # Resize for emotion model (48x48)
#                 emotion_face = cv2.resize(face_img, (48, 48))
#                 emotion_face = emotion_face.astype('float32') / 255.0
#                 emotion_face = np.expand_dims(emotion_face, axis=0)
#                 emotion_face = np.expand_dims(emotion_face, axis=-1)
                
#                 # Predict emotion
#                 emotion_pred = emotion_model.predict(emotion_face)
#                 emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
#                 emotion_idx = np.argmax(emotion_pred[0])
#                 results['emotion'] = emotions[emotion_idx]
#                 results['confidence'] = float(emotion_pred[0][emotion_idx])
                
#                 logger.info(f"🎭 Detected emotion: {results['emotion']} (confidence: {results['confidence']:.2f})")
                
#             except Exception as e:
#                 logger.error(f"❌ Emotion prediction error: {str(e)}")
        
#         # Age/Gender prediction
#         if age_gender_model is not None:
#             try:
#                 # Resize for age/gender model (128x128)
#                 ag_face = cv2.resize(face_img, (128, 128))
#                 ag_face = ag_face.astype('float32') / 255.0
#                 ag_face = ag_face.flatten().reshape(1, -1)
                
#                 # Predict age and gender
#                 prediction = age_gender_model.predict(ag_face)
                
#                 # Assuming the model returns [age, gender_prob]
#                 if len(prediction[0]) >= 2:
#                     results['age'] = int(prediction[0][0])
#                     results['gender'] = 'male' if prediction[0][1] > 0.5 else 'female'
                
#                 logger.info(f"👤 Detected: {results['gender']}, age {results['age']}")
                
#             except Exception as e:
#                 logger.error(f"❌ Age/Gender prediction error: {str(e)}")
        
#         return results
        
#     except Exception as e:
#         logger.error(f"❌ Face detection error: {str(e)}")
#         raise

# def get_movie_recommendations(emotion, age, gender):
#     """Get movie recommendations based on analysis"""
#     try:
#         # Emotion to genre mapping
#         emotion_genres = {
#             'happy': [35, 10751, 16],  # Comedy, Family, Animation
#             'sad': [18, 10749],        # Drama, Romance
#             'angry': [28, 53, 80],     # Action, Thriller, Crime
#             'fear': [27, 9648],        # Horror, Mystery
#             'surprise': [12, 878],     # Adventure, Sci-Fi
#             'disgust': [99, 36],       # Documentary, History
#             'neutral': [18, 35, 28]    # Drama, Comedy, Action
#         }
        
#         # Age-based preferences
#         if age < 13:
#             genres = [16, 10751]  # Animation, Family
#         elif age < 18:
#             genres = [12, 16, 35, 10751]  # Adventure, Animation, Comedy, Family
#         elif age < 30:
#             genres = emotion_genres.get(emotion, [28, 35, 878])
#         else:
#             genres = emotion_genres.get(emotion, [18, 53, 36])
        
#         # Get movies from TMDB
#         headers = {
#             'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
#             'Content-Type': 'application/json'
#         }
        
#         movies = []
        
#         # Try to get movies by genre
#         for genre_id in genres[:2]:  # Limit to 2 genres
#             try:
#                 response = requests.get(
#                     f'{TMDB_BASE_URL}/discover/movie',
#                     headers=headers,
#                     params={
#                         'with_genres': genre_id,
#                         'sort_by': 'popularity.desc',
#                         'page': 1
#                     },
#                     timeout=10
#                 )
                
#                 if response.status_code == 200:
#                     data = response.json()
#                     for movie in data.get('results', [])[:5]:  # Get top 5 from each genre
#                         movies.append({
#                             'title': movie.get('title', 'Unknown'),
#                             'overview': movie.get('overview', 'No description available'),
#                             'rating': movie.get('vote_average', 7.0),
#                             'release_date': movie.get('release_date', '2023-01-01'),
#                             'poster_url': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if movie.get('poster_path') else None,
#                             'genres': [genre_id]
#                         })
                        
#             except Exception as e:
#                 logger.error(f"❌ Error fetching genre {genre_id}: {str(e)}")
        
#         # If no movies found, return some popular defaults
#         if not movies:
#             movies = [
#                 {
#                     'title': 'The Shawshank Redemption',
#                     'overview': 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
#                     'rating': 9.3,
#                     'release_date': '1994-09-23',
#                     'poster_url': None,
#                     'genres': [18]
#                 },
#                 {
#                     'title': 'The Godfather',
#                     'overview': 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
#                     'rating': 9.2,
#                     'release_date': '1972-03-24',
#                     'poster_url': None,
#                     'genres': [18, 80]
#                 }
#             ]
        
#         logger.info(f"🎬 Found {len(movies)} movie recommendations")
#         return movies[:10]  # Return top 10
        
#     except Exception as e:
#         logger.error(f"❌ Error getting recommendations: {str(e)}")
#         return []

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     """Health check endpoint"""
#     return jsonify({
#         'status': 'healthy',
#         'emotion_model': emotion_model is not None,
#         'age_gender_model': age_gender_model is not None,
#         'tmdb_token': TMDB_BEARER_TOKEN is not None
#     })

# @app.route('/api/recommend', methods=['POST'])
# def recommend_movies():
#     """Main recommendation endpoint"""
#     try:
#         # Check if file was uploaded
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400
        
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400
        
#         # Save uploaded file temporarily
#         with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
#             file.save(tmp_file.name)
#             temp_path = tmp_file.name
        
#         try:
#             # Analyze the image
#             logger.info("🔍 Starting image analysis...")
#             analysis = detect_face_and_emotion(temp_path)
            
#             # Get movie recommendations
#             logger.info("🎬 Getting movie recommendations...")
#             recommendations = get_movie_recommendations(
#                 analysis['emotion'], 
#                 analysis['age'], 
#                 analysis['gender']
#             )
            
#             response = {
#                 'analysis': analysis,
#                 'recommendations': recommendations,
#                 'message': 'Analysis complete'
#             }
            
#             logger.info(f"✅ Analysis complete: {analysis['emotion']}, {analysis['gender']}, age {analysis['age']}")
#             return jsonify(response)
            
#         finally:
#             # Clean up temporary file
#             try:
#                 os.unlink(temp_path)
#             except:
#                 pass
                
#     except Exception as e:
#         logger.error(f"❌ Recommendation error: {str(e)}")
#         return jsonify({
#             'error': str(e),
#             'message': 'Failed to process image'
#         }), 500

# @app.route('/api/analyze', methods=['POST'])
# def analyze_only():
#     """Analyze image without recommendations"""
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400
        
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400
        
#         # Save uploaded file temporarily
#         with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
#             file.save(tmp_file.name)
#             temp_path = tmp_file.name
        
#         try:
#             # Analyze the image
#             analysis = detect_face_and_emotion(temp_path)
#             return jsonify(analysis)
            
#         finally:
#             # Clean up temporary file
#             try:
#                 os.unlink(temp_path)
#             except:
#                 pass
                
#     except Exception as e:
#         logger.error(f"❌ Analysis error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/live_data', methods=['GET'])
# def get_live_data():
#     """Get live camera data (placeholder)"""
#     return jsonify({
#         'emotion': None,
#         'gender': None,
#         'age': None,
#         'recommendations': []
#     })

# @app.route('/stop_camera', methods=['GET'])
# def stop_camera():
#     """Stop camera feed (placeholder)"""
#     return jsonify({'status': 'camera stopped'})

# # TMDB API endpoints
# @app.route('/api/search', methods=['GET'])
# def search_movies():
#     """Search movies via TMDB"""
#     query = request.args.get('q', '')
#     if not query:
#         return jsonify({'error': 'Query parameter is required'}), 400
    
#     if not TMDB_BEARER_TOKEN:
#         return jsonify({'error': 'TMDB token not configured'}), 500
    
#     headers = {
#         'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
#         'Content-Type': 'application/json'
#     }
    
#     try:
#         response = requests.get(
#             f'{TMDB_BASE_URL}/search/movie',
#             headers=headers,
#             params={'query': query},
#             timeout=10
#         )
#         response.raise_for_status()
#         return jsonify(response.json())
#     except requests.exceptions.RequestException as e:
#         logger.error(f"❌ TMDB search error: {str(e)}")
#         return jsonify({'error': 'Search service unavailable'}), 503

# @app.route('/api/trending/movies', methods=['GET'])
# def get_trending_movies():
#     """Get trending movies"""
#     if not TMDB_BEARER_TOKEN:
#         return jsonify({'results': []})
    
#     headers = {
#         'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
#         'Content-Type': 'application/json'
#     }
    
#     try:
#         response = requests.get(
#             f'{TMDB_BASE_URL}/trending/movie/week',
#             headers=headers,
#             timeout=10
#         )
#         response.raise_for_status()
#         return jsonify(response.json())
#     except requests.exceptions.RequestException as e:
#         logger.error(f"❌ TMDB trending error: {str(e)}")
#         return jsonify({'results': []})

# @app.route('/api/popular/movies', methods=['GET'])
# def get_popular_movies():
#     """Get popular movies"""
#     if not TMDB_BEARER_TOKEN:
#         return jsonify({'results': []})
    
#     headers = {
#         'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
#         'Content-Type': 'application/json'
#     }
    
#     try:
#         response = requests.get(
#             f'{TMDB_BASE_URL}/movie/popular',
#             headers=headers,
#             timeout=10
#         )
#         response.raise_for_status()
#         return jsonify(response.json())
#     except requests.exceptions.RequestException as e:
#         logger.error(f"❌ TMDB popular error: {str(e)}")
#         return jsonify({'results': []})
# @app.route('/')
# def index():
#     return jsonify({
#         'message': '✅ Flask backend is running. Use /api endpoints to interact.'
#     })

# if __name__ == '__main__':
#     logger.info("🚀 Starting Flask server...")
    
#     # Load AI models
#     load_models()
    
#     # Check TMDB token
#     if TMDB_BEARER_TOKEN:
#         logger.info("✅ TMDB Bearer Token configured")
#     else:
#         logger.warning("⚠️ TMDB Bearer Token not found - movie data will be limited")
    
#     # Start server
#     port = int(os.environ.get('PORT', 5000))
#     logger.info(f"🌐 Server starting on http://127.0.0.1:{port}")
#     app.run(host='127.0.0.1', port=port, debug=True)















































































































# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import requests
# import os
# import cv2
# import numpy as np
# from tensorflow.keras.models import load_model
# import pickle
# from dotenv import load_dotenv
# import tempfile
# import logging

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # TMDB Configuration
# TMDB_BEARER_TOKEN = os.getenv('TMDB_BEARER_TOKEN')
# TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# # Global variables for models
# emotion_model = None
# age_gender_model = None


# def load_models():
#     global emotion_model, age_gender_model
#     try:
#         if os.path.exists('facial_emotion_detection_model.h5'):
#             emotion_model = load_model('facial_emotion_detection_model.h5')
#             logger.info("✅ Emotion detection model loaded successfully")
#         else:
#             logger.warning("⚠️ Emotion model file not found: facial_emotion_detection_model.h5")

#         if os.path.exists('model.pkl'):
#             with open('model.pkl', 'rb') as f:
#                 age_gender_model = pickle.load(f)
#             logger.info("✅ Age/Gender model loaded successfully")
#         else:
#             logger.warning("⚠️ Age/Gender model file not found: model.pkl")

#     except Exception as e:
#         logger.error(f"❌ Error loading models: {str(e)}")


# def detect_face_and_emotion(image_path):
#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             raise ValueError("Could not read image file")

#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#         if len(faces) == 0:
#             raise ValueError("No face detected in the image")

#         face = max(faces, key=lambda x: x[2] * x[3])
#         x, y, w, h = face
#         face_img = gray[y:y + h, x:x + w]

#         results = {
#             'emotion': 'neutral',
#             'age': 25,
#             'gender': 'unknown',
#             'confidence': 0.85
#         }

#         if emotion_model is not None:
#             try:
#                 emotion_face = cv2.resize(face_img, (48, 48))
#                 emotion_face = emotion_face.astype('float32') / 255.0
#                 emotion_face = np.expand_dims(emotion_face, axis=0)
#                 emotion_face = np.expand_dims(emotion_face, axis=-1)
#                 emotion_pred = emotion_model.predict(emotion_face)
#                 emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
#                 emotion_idx = np.argmax(emotion_pred[0])
#                 results['emotion'] = emotions[emotion_idx]
#                 results['confidence'] = float(emotion_pred[0][emotion_idx])
#                 logger.info(f"🎭 Detected emotion: {results['emotion']} (confidence: {results['confidence']:.2f})")
#             except Exception as e:
#                 logger.error(f"❌ Emotion prediction error: {str(e)}")

#         if age_gender_model is not None:
#             try:
#                 ag_face = cv2.resize(face_img, (128, 128))
#                 ag_face = ag_face.astype('float32') / 255.0
#                 ag_face = ag_face.reshape(1, 128, 128, 1)
#                 prediction = age_gender_model.predict(ag_face)
#                 gender = 'female' if round(prediction[0][0][0]) == 1 else 'male'
#                 age = int(round(prediction[1][0][0]))
#                 results['gender'] = gender
#                 results['age'] = age
#                 logger.info(f"👤 Detected: {gender}, age {age}")
#             except Exception as e:
#                 logger.error(f"❌ Age/Gender prediction error: {str(e)}")

#         return results

#     except Exception as e:
#         logger.error(f"❌ Face detection error: {str(e)}")
#         raise


# @app.route('/api/recommend', methods=['POST'])
# def recommend_movies():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400

#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400

#         with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
#             file.save(tmp_file.name)
#             temp_path = tmp_file.name

#         try:
#             analysis = detect_face_and_emotion(temp_path)
#             response = {
#                 'analysis': analysis,
#                 'message': 'Analysis complete'
#             }
#             return jsonify(response)
#         finally:
#             try:
#                 os.unlink(temp_path)
#             except:
#                 pass

#     except Exception as e:
#         logger.error(f"❌ Recommendation error: {str(e)}")
#         return jsonify({'error': str(e), 'message': 'Failed to process image'}), 500


# @app.route('/')
# def index():
#     return jsonify({'message': '✅ Flask backend is running.'})


# if __name__ == '__main__':
#     logger.info("🚀 Starting Flask server...")
#     load_models()
#     if TMDB_BEARER_TOKEN:
#         logger.info("✅ TMDB Bearer Token configured")
#     else:
#         logger.warning("⚠️ TMDB Bearer Token not found")
#     app.run(host='127.0.0.1', port=5000, debug=True)












































# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import requests
# import os
# import cv2
# import numpy as np
# from tensorflow.keras.models import load_model
# import pickle
# from dotenv import load_dotenv
# import tempfile
# import logging

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # TMDB Configuration
# TMDB_BEARER_TOKEN = os.getenv('TMDB_BEARER_TOKEN')
# TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# # Global variables for models
# emotion_model = None
# age_gender_model = None


# def load_models():
#     global emotion_model, age_gender_model
#     try:
#         if os.path.exists('facial_emotion_detection_model.h5'):
#             emotion_model = load_model('facial_emotion_detection_model.h5')
#             logger.info("✅ Emotion detection model loaded successfully")
#         else:
#             logger.warning("⚠️ Emotion model file not found: facial_emotion_detection_model.h5")

#         if os.path.exists('model.pkl'):
#             with open('model.pkl', 'rb') as f:
#                 age_gender_model = pickle.load(f)
#             logger.info("✅ Age/Gender model loaded successfully")
#         else:
#             logger.warning("⚠️ Age/Gender model file not found: model.pkl")

#     except Exception as e:
#         logger.error(f"❌ Error loading models: {str(e)}")


# def detect_face_and_emotion(image_path):
#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             raise ValueError("Could not read image file")

#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#         if len(faces) == 0:
#             raise ValueError("No face detected in the image")

#         face = max(faces, key=lambda x: x[2] * x[3])
#         x, y, w, h = face
#         face_img = gray[y:y + h, x:x + w]

#         results = {
#             'emotion': 'neutral',
#             'age': 25,
#             'gender': 'unknown',
#             'confidence': 0.85
#         }

#         if emotion_model is not None:
#             try:
#                 emotion_face = cv2.resize(face_img, (48, 48))
#                 emotion_face = emotion_face.astype('float32') / 255.0
#                 emotion_face = np.expand_dims(emotion_face, axis=0)
#                 emotion_face = np.expand_dims(emotion_face, axis=-1)
#                 emotion_pred = emotion_model.predict(emotion_face)
#                 emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
#                 emotion_idx = np.argmax(emotion_pred[0])
#                 results['emotion'] = emotions[emotion_idx]
#                 results['confidence'] = float(emotion_pred[0][emotion_idx])
#                 logger.info(f"🎭 Detected emotion: {results['emotion']} (confidence: {results['confidence']:.2f})")
#             except Exception as e:
#                 logger.error(f"❌ Emotion prediction error: {str(e)}")

#         if age_gender_model is not None:
#             try:
#                 ag_face = cv2.resize(face_img, (128, 128))
#                 ag_face = ag_face.astype('float32') / 255.0
#                 ag_face = ag_face.reshape(1, 128, 128, 1)
#                 prediction = age_gender_model.predict(ag_face)
#                 gender = 'female' if round(prediction[0][0][0]) == 1 else 'male'
#                 age = int(round(prediction[1][0][0]))
#                 results['gender'] = gender
#                 results['age'] = age
#                 logger.info(f"👤 Detected: {gender}, age {age}")
#             except Exception as e:
#                 logger.error(f"❌ Age/Gender prediction error: {str(e)}")

#         return results

#     except Exception as e:
#         logger.error(f"❌ Face detection error: {str(e)}")
#         raise


# @app.route('/api/recommend', methods=['POST'])
# def recommend_movies():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400

#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400

#         with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
#             file.save(tmp_file.name)
#             temp_path = tmp_file.name

#         try:
#             analysis = detect_face_and_emotion(temp_path)
#             response = {
#                 'analysis': analysis,
#                 'message': 'Analysis complete'
#             }
#             return jsonify(response)
#         finally:
#             try:
#                 os.unlink(temp_path)
#             except:
#                 pass

#     except Exception as e:
#         logger.error(f"❌ Recommendation error: {str(e)}")
#         return jsonify({'error': str(e), 'message': 'Failed to process image'}), 500


# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status': 'healthy',
#         'emotion_model': emotion_model is not None,
#         'age_gender_model': age_gender_model is not None,
#         'tmdb_token': TMDB_BEARER_TOKEN is not None
#     })


# @app.route('/')
# def index():
#     return jsonify({'message': '✅ Flask backend is running.'})


# if __name__ == '__main__':
#     logger.info("🚀 Starting Flask server...")
#     load_models()
#     if TMDB_BEARER_TOKEN:
#         logger.info("✅ TMDB Bearer Token configured")
#     else:
#         logger.warning("⚠️ TMDB Bearer Token not found")
#     app.run(host='127.0.0.1', port=5000, debug=True)












#working code finish


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# import os
# import cv2
# import numpy as np
# from tensorflow.keras.models import load_model
# import pickle
# from dotenv import load_dotenv
# import tempfile
# import logging

# # Load environment variables
# load_dotenv()

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # TMDB Configuration
# TMDB_BEARER_TOKEN = os.getenv('TMDB_BEARER_TOKEN')
# TMDB_BASE_URL = 'https://api.themoviedb.org/3'

# # Global variables for models
# emotion_model = None
# age_gender_model = None

# def load_models():
#     global emotion_model, age_gender_model
#     try:
#         if os.path.exists('facial_emotion_detection_model.h5'):
#             emotion_model = load_model('facial_emotion_detection_model.h5')
#             logger.info("✅ Emotion detection model loaded successfully")
#         else:
#             logger.warning("⚠️ Emotion model file not found: facial_emotion_detection_model.h5")

#         if os.path.exists('model.pkl'):
#             with open('model.pkl', 'rb') as f:
#                 age_gender_model = pickle.load(f)
#             logger.info("✅ Age/Gender model loaded successfully")
#         else:
#             logger.warning("⚠️ Age/Gender model file not found: model.pkl")

#     except Exception as e:
#         logger.error(f"❌ Error loading models: {str(e)}")

# def detect_face_and_emotion(image_path):
#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             raise ValueError("Could not read image file")

#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#         if len(faces) == 0:
#             raise ValueError("No face detected in the image")

#         face = max(faces, key=lambda x: x[2] * x[3])
#         x, y, w, h = face
#         face_img = gray[y:y + h, x:x + w]

#         results = {
#             'emotion': 'neutral',
#             'age': 25,
#             'gender': 'unknown',
#             'confidence': 0.85
#         }

#         if emotion_model is not None:
#             try:
#                 emotion_face = cv2.resize(face_img, (48, 48))
#                 emotion_face = emotion_face.astype('float32') / 255.0
#                 emotion_face = np.expand_dims(emotion_face, axis=0)
#                 emotion_face = np.expand_dims(emotion_face, axis=-1)
#                 emotion_pred = emotion_model.predict(emotion_face)
#                 emotions = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
#                 emotion_idx = np.argmax(emotion_pred[0])
#                 results['emotion'] = emotions[emotion_idx]
#                 results['confidence'] = float(emotion_pred[0][emotion_idx])
#                 logger.info(f"🎭 Detected emotion: {results['emotion']} (confidence: {results['confidence']:.2f})")
#             except Exception as e:
#                 logger.error(f"❌ Emotion prediction error: {str(e)}")

#         if age_gender_model is not None:
#             try:
#                 ag_face = cv2.resize(face_img, (128, 128))
#                 ag_face = ag_face.astype('float32') / 255.0
#                 ag_face = ag_face.reshape(1, 128, 128, 1)
#                 prediction = age_gender_model.predict(ag_face)
#                 gender = 'female' if round(prediction[0][0][0]) == 1 else 'male'
#                 age = int(round(prediction[1][0][0]))
#                 results['gender'] = gender
#                 results['age'] = age
#                 logger.info(f"👤 Detected: {gender}, age {age}")
#             except Exception as e:
#                 logger.error(f"❌ Age/Gender prediction error: {str(e)}")

#         return results

#     except Exception as e:
#         logger.error(f"❌ Face detection error: {str(e)}")
#         raise

# def get_movie_recommendations(emotion, age, gender):
#     emotion_genres = {
#         'happy': [35, 10751, 16],
#         'sad': [18, 10749],
#         'angry': [28, 53, 80],
#         'fear': [27, 9648],
#         'surprise': [12, 878],
#         'disgust': [99, 36],
#         'neutral': [18, 35, 28]
#     }

#     if age < 13:
#         genres = [16, 10751]
#     elif age < 18:
#         genres = [12, 16, 35, 10751]
#     elif age < 30:
#         genres = emotion_genres.get(emotion, [28, 35, 878])
#     else:
#         genres = emotion_genres.get(emotion, [18, 53, 36])

#     headers = {
#         'Authorization': f'Bearer {TMDB_BEARER_TOKEN}',
#         'Content-Type': 'application/json'
#     }

#     movies = []

#     for genre_id in genres[:2]:
#         try:
#             response = requests.get(
#                 f'{TMDB_BASE_URL}/discover/movie',
#                 headers=headers,
#                 params={
#                     'with_genres': genre_id,
#                     'sort_by': 'popularity.desc',
#                     'page': 1
#                 },
#                 timeout=10
#             )
#             logger.info(f"TMDB response for genre {genre_id}: {response.status_code}")
#             data = response.json()
#             for movie in data.get('results', [])[:5]:
#                 movies.append({
#                     'title': movie.get('title', 'Unknown'),
#                     'overview': movie.get('overview', 'No description available'),
#                     'rating': movie.get('vote_average', 7.0),
#                     'release_date': movie.get('release_date', '2023-01-01'),
#                     'poster_url': f"https://image.tmdb.org/t/p/w500{movie.get('poster_path', '')}" if movie.get('poster_path') else None,
#                     'genres': [genre_id]
#                 })
#         except Exception as e:
#             logger.error(f"❌ Error fetching genre {genre_id}: {str(e)}")

#     logger.info(f"✅ Sending {len(movies)} recommendations")

#     return movies[:10] if movies else []

# @app.route('/api/recommend', methods=['POST'])
# def recommend_movies():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400

#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400

#         with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
#             file.save(tmp_file.name)
#             temp_path = tmp_file.name

#         try:
#             analysis = detect_face_and_emotion(temp_path)
#             recommendations = get_movie_recommendations(
#                 analysis['emotion'], analysis['age'], analysis['gender']
#             )
#             response = {
#                 'analysis': analysis,
#                 'recommendations': recommendations,
#                 'message': 'Analysis complete'
#             }
#             return jsonify(response)
#         finally:
#             try:
#                 os.unlink(temp_path)
#             except:
#                 pass

#     except Exception as e:
#         logger.error(f"❌ Recommendation error: {str(e)}")
#         return jsonify({'error': str(e), 'message': 'Failed to process image'}), 500

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status': 'healthy',
#         'emotion_model': emotion_model is not None,
#         'age_gender_model': age_gender_model is not None,
#         'tmdb_token': TMDB_BEARER_TOKEN is not None
#     })

# @app.route('/')
# def index():
#     return jsonify({'message': '✅ Flask backend is running.'})

# if __name__ == '__main__':
#     logger.info("🚀 Starting Flask server...")
#     load_models()
#     if TMDB_BEARER_TOKEN:
#         logger.info("✅ TMDB Bearer Token configured")
#     else:
#         logger.warning("⚠️ TMDB Bearer Token not found")
#     app.run(host='127.0.0.1', port=5000, debug=True)










































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
