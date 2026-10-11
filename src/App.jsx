import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import MoodPage from './pages/MoodPage';
import PlaceDetails from './pages/PlaceDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <a href="#main" className="mz-skip">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mood/:moodName" element={<MoodPage />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#16333a', color: '#efe6d2' } }} />
    </>
  );
}
