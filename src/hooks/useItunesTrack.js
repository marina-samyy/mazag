import { useEffect, useState } from 'react';

// Searches the free iTunes Search API (no key needed) for a song and
// returns the first result that has a 30-second preview.
// Returns { status: 'loading' | 'success' | 'error', track }.
export default function useItunesTrack(query) {
  const [state, setState] = useState({ status: 'loading', track: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', track: null });

    async function load() {
      try {
        const url =
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}` +
          '&media=music&entity=song&limit=5';
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const json = await response.json();
        const track = json.results.find((item) => item.previewUrl);
        if (!track) throw new Error('No preview found');
        setState({ status: 'success', track });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({ status: 'error', track: null });
        }
      }
    }

    load();
    return () => controller.abort();
  }, [query]);

  return state;
}
