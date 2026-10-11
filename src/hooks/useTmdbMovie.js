import { useEffect, useState } from 'react';

// Searches the TMDB API for a film. TMDB needs a free API key, which is kept in an
// environment variable (VITE_TMDB_API_KEY in the .env file). Without a key the hook
// returns status 'disabled' and the app simply uses other sources.
// Returns { status: 'disabled' | 'loading' | 'success' | 'error', movie }.
export default function useTmdbMovie(query, year) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [state, setState] = useState({ status: apiKey ? 'loading' : 'disabled', movie: null });

  useEffect(() => {
    if (!apiKey) {
      setState({ status: 'disabled', movie: null });
      return undefined;
    }

    const controller = new AbortController();
    setState({ status: 'loading', movie: null });

    async function load() {
      try {
        const url =
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}` +
          `&query=${encodeURIComponent(query)}&include_adult=false`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const json = await response.json();

        // Accept a result only if its release year is close to ours, so we never show the wrong film.
        const movie = json.results.find(
          (item) =>
            item.poster_path &&
            item.release_date &&
            Math.abs(Number(item.release_date.slice(0, 4)) - year) <= 1
        );
        if (!movie) throw new Error('No matching film');
        setState({ status: 'success', movie });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({ status: 'error', movie: null });
        }
      }
    }

    load();
    return () => controller.abort();
  }, [apiKey, query, year]);

  return state;
}
