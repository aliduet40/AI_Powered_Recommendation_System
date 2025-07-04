import requests
import os
from dotenv import load_dotenv

load_dotenv()

class TMDBApi:
    def __init__(self):
        self.bearer_token = os.getenv('TMDB_BEARER_TOKEN')
        self.base_url = 'https://api.themoviedb.org/3'
        self.headers = {
            'Authorization': f'Bearer {self.bearer_token}',
            'Content-Type': 'application/json'
        }
    
    def search_multi(self, query):
        """Search for movies and TV shows"""
        try:
            response = requests.get(
                f'{self.base_url}/search/multi',
                headers=self.headers,
                params={'query': query}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'TMDB API error: {str(e)}')
    
    def get_trending(self, media_type='all', time_window='week'):
        """Get trending movies and TV shows"""
        try:
            response = requests.get(
                f'{self.base_url}/trending/{media_type}/{time_window}',
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'TMDB API error: {str(e)}')
    
    def get_movie_recommendations(self, movie_id):
        """Get movie recommendations"""
        try:
            response = requests.get(
                f'{self.base_url}/movie/{movie_id}/recommendations',
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'TMDB API error: {str(e)}')
    
    def get_movie_details(self, movie_id):
        """Get detailed movie information"""
        try:
            response = requests.get(
                f'{self.base_url}/movie/{movie_id}',
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f'TMDB API error: {str(e)}')
























# import requests
# import os
# from dotenv import load_dotenv

# load_dotenv()

# class TMDBApi:
#     def __init__(self):
#         self.bearer_token = os.getenv('TMDB_BEARER_TOKEN')
#         self.base_url = 'https://api.themoviedb.org/3'
#         self.headers = {
#             'Authorization': f'Bearer {self.bearer_token}',
#             'Content-Type': 'application/json'
#         }
    
#     def search_multi(self, query):
#         """Search for movies and TV shows"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/search/multi',
#                 headers=self.headers,
#                 params={'query': query, 'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def search_movies(self, query):
#         """Search for movies only"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/search/movie',
#                 headers=self.headers,
#                 params={'query': query, 'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_trending(self, media_type='all', time_window='week'):
#         """Get trending movies and TV shows"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/trending/{media_type}/{time_window}',
#                 headers=self.headers,
#                 params={'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_trending_movies(self):
#         """Get trending movies for today"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/trending/movie/day',
#                 headers=self.headers,
#                 params={'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_trending_tv(self):
#         """Get trending TV shows for today"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/trending/tv/day',
#                 headers=self.headers,
#                 params={'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_popular_movies(self):
#         """Get popular movies"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/movie/popular',
#                 headers=self.headers,
#                 params={'language': 'en-US', 'page': 1}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_movie_recommendations(self, movie_id):
#         """Get movie recommendations"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/movie/{movie_id}/recommendations',
#                 headers=self.headers,
#                 params={'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_response(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def get_movie_details(self, movie_id):
#         """Get detailed movie information"""
#         try:
#             response = requests.get(
#                 f'{self.base_url}/movie/{movie_id}',
#                 headers=self.headers,
#                 params={'language': 'en-US'}
#             )
#             response.raise_for_status()
#             return self._transform_movie_details(response.json())
#         except requests.exceptions.RequestException as e:
#             raise Exception(f'TMDB API error: {str(e)}')
    
#     def _transform_response(self, data):
#         """Transform TMDB response to include full image URLs"""
#         if 'results' in data:
#             for item in data['results']:
#                 # Add full poster URLs
#                 if item.get('poster_path'):
#                     item['poster_path'] = f"https://image.tmdb.org/t/p/w500{item['poster_path']}"
#                 if item.get('backdrop_path'):
#                     item['backdrop_path'] = f"https://image.tmdb.org/t/p/w1280{item['backdrop_path']}"
#         return data
    
#     def _transform_movie_details(self, movie):
#         """Transform movie details response"""
#         if movie.get('poster_path'):
#             movie['poster_path'] = f"https://image.tmdb.org/t/p/w500{movie['poster_path']}"
#         if movie.get('backdrop_path'):
#             movie['backdrop_path'] = f"https://image.tmdb.org/t/p/w1280{movie['backdrop_path']}"
#         return movie