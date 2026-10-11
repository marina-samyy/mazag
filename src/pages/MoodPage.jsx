import { Link, useParams } from 'react-router-dom';
import { Film, Music, Shuffle } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import ImageWithFallback from '../components/ImageWithFallback';
import PageTransition from '../components/PageTransition';
import PlaceCard from '../components/PlaceCard';
import MovieCard from '../components/MovieCard';
import MusicCard from '../components/MusicCard';
import NotFound from './NotFound';
import useMoodTheme from '../hooks/useMoodTheme';
import useDocumentTitle from '../hooks/useDocumentTitle';
import {
  getAllMoods,
  getMoodById,
  getMovieById,
  getMusicById,
  getPlacesForMood,
} from '../utils/dataHelpers';

export default function MoodPage() {
  const { moodName } = useParams(); // from the URL: /mood/:moodName
  const mood = getMoodById(moodName);

  // Hooks must run on every render, so they come before the early return.
  useMoodTheme(mood ? mood.id : 'home');
  useDocumentTitle(mood ? `${mood.name} — Mazag` : 'Mood not found — Mazag');

  if (!mood) {
    return <NotFound message={`We don't have a mood called "${moodName}".`} />;
  }

  const places = getPlacesForMood(mood);
  const movie = getMovieById(mood.movieId);
  const track = getMusicById(mood.musicId);
  const otherMoods = getAllMoods().filter((m) => m.id !== mood.id);
  const placeColumns = places.length >= 4 ? 'col-12 col-md-6 col-xl-3' : 'col-12 col-md-6 col-lg-4';

  return (
    <PageTransition>
      <section className="container mz-section" aria-labelledby="mood-title">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="mz-mood-ar" lang="ar" dir="rtl">{mood.arabicName}</p>
            <h1 id="mood-title" className="mz-hero-title">{mood.name}</h1>
            <p className="lead mb-3">{mood.tagline}</p>
            <p className="mz-readable">{mood.description}</p>
            <ul className="mz-chips list-unstyled d-flex flex-wrap gap-2 mb-4">
              {mood.keywords.map((k) => <li key={k}>{k}</li>)}
            </ul>
            <FavoriteButton type="mood" id={mood.id} name={`${mood.name} bundle`} />
          </div>
          <div className="col-lg-6">
            <ImageWithFallback
              src={mood.heroImage}
              alt={mood.heroAlt}
              label={mood.name}
              className="mz-mood-hero-img"
            />
          </div>
        </div>
      </section>

      <section className="container mz-section" aria-labelledby="places-title">
        <h2 id="places-title" className="mb-4">Where to go</h2>
        <div className="row g-4">
          {places.map((place) => (
            <div className={placeColumns} key={place.id}>
              <PlaceCard place={place} moodId={mood.id} />
            </div>
          ))}
        </div>
      </section>

      <section className="container mz-section">
        <div className="row g-4">
          <div className="col-lg-7">
            <h2 className="mb-4 d-flex align-items-center gap-2"><Film aria-hidden="true" /> What to watch</h2>
            {movie && <MovieCard movie={movie} />}
          </div>
          <div className="col-lg-5">
            <h2 className="mb-4 d-flex align-items-center gap-2"><Music aria-hidden="true" /> What to play</h2>
            {track && <MusicCard track={track} />}
          </div>
        </div>
      </section>

      <section className="container mz-section" aria-labelledby="other-title">
        <h2 id="other-title" className="mb-3">Not quite right? Try another mood.</h2>
        <div className="d-flex flex-wrap gap-3">
          {otherMoods.map((m) => (
            <Link key={m.id} to={`/mood/${m.id}`} className="btn mz-btn-outline">{m.name}</Link>
          ))}
          <Link to="/" className="btn mz-btn-outline d-inline-flex align-items-center gap-2">
            <Shuffle size={18} aria-hidden="true" /> All moods
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
