import { useEffect } from 'react';

// Sets data-mood on <html>. The CSS in index.css reads that attribute
// and swaps all the colors, fonts and card styles for the mood.
export default function useMoodTheme(moodId = 'home') {
  useEffect(() => {
    document.documentElement.dataset.mood = moodId;
    return () => {
      document.documentElement.dataset.mood = 'home';
    };
  }, [moodId]);
}
