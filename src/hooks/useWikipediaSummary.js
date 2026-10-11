import { useEffect, useState } from 'react';

// Fetches a short summary of a Wikipedia article (free API, no key needed).
// Returns { status: 'loading' | 'success' | 'error', data }.
export default function useWikipediaSummary(title) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    // AbortController lets us cancel the request if the user leaves the page.
    const controller = new AbortController();
    setState({ status: 'loading', data: null });

    // useEffect cannot be async itself, so the async work goes in an inner function.
    async function load() {
      try {
        const name = encodeURIComponent(title.replace(/ /g, '_'));
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const json = await response.json();
        if (!json.extract) throw new Error('No summary text');
        setState({ status: 'success', data: json });
      } catch (error) {
        // An aborted request is not a real error, so ignore it.
        if (error.name !== 'AbortError') {
          setState({ status: 'error', data: null });
        }
      }
    }

    load();

    // Cleanup: cancel the request when the title changes or the page closes.
    return () => controller.abort();
  }, [title]);

  return state;
}
