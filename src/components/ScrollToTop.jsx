import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Starts every new page at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Braces matter: an effect must not return a value (scrollTo can return one).
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
