// All data access goes through this file, so components never import JSON directly.
import moods from '../data/moods.json';
import places from '../data/places.json';
import movies from '../data/movies.json';
import music from '../data/music.json';

export const getAllMoods = () => moods;
export const getMoodById = (id) => moods.find((m) => m.id === id);
export const getPlaceById = (id) => places.find((p) => p.id === id);
export const getMovieById = (id) => movies.find((m) => m.id === id);
export const getMusicById = (id) => music.find((m) => m.id === id);

// A mood stores place IDs; this turns them into full place objects.
export const getPlacesForMood = (mood) =>
  mood.placeIds.map(getPlaceById).filter(Boolean);

// Always returns one of the moods defined in moods.json, so the route is always valid.
export const getRandomMood = () => moods[Math.floor(Math.random() * moods.length)];

// We link to a YouTube search instead of guessing video IDs (which could be wrong).
export const youtubeSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const googleMapsUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
