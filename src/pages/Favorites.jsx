import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FavoriteButton from '../components/FavoriteButton';
import ImageWithFallback from '../components/ImageWithFallback';
import PageTransition from '../components/PageTransition';
import PlaceCard from '../components/PlaceCard';
import useFavoritesStore from '../store/useFavoritesStore';
import useMoodTheme from '../hooks/useMoodTheme';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getMoodById, getMovieById, getMusicById, getPlaceById } from '../utils/dataHelpers';

export default function Favorites() {
  useMoodTheme('home');
  useDocumentTitle('Favorites — Mazag');

  const moodIds = useFavoritesStore((s) => s.moods);
  const placeIds = useFavoritesStore((s) => s.places);
  const clearAll = useFavoritesStore((s) => s.clearAll);

  // Turn saved ids into full objects (filter drops any id that no longer exists).
  const savedMoods = moodIds.map(getMoodById).filter(Boolean);
  const savedPlaces = placeIds.map(getPlaceById).filter(Boolean);
  const isEmpty = savedMoods.length === 0 && savedPlaces.length === 0;

  const handleClear = () => {
    if (window.confirm('Remove all of your favorites?')) {
      clearAll();
      toast.success('All favorites removed');
    }
  };

  return (
    <PageTransition>
      <div className="container mz-section">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <h1 className="mz-hero-title mb-2">Your favorites</h1>
            <p className="text-muted-mz mb-0">Saved on this device, so they are still here after a refresh.</p>
          </div>
          {!isEmpty && (
            <button type="button" className="btn mz-btn-outline d-inline-flex align-items-center gap-2" onClick={handleClear}>
              <Trash2 size={18} aria-hidden="true" /> Remove all
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="mz-empty text-center">
            <Heart size={40} aria-hidden="true" />
            <h2 className="h3 mt-3">Nothing saved yet</h2>
            <p className="text-muted-mz">
              Open a mood and press "Add to Favorites" to keep a bundle or a place here.
            </p>
            <Link to="/" className="btn mz-btn-primary">Pick a mood</Link>
          </div>
        ) : (
          <>
            {savedMoods.length > 0 && (
              <section className="mb-5" aria-labelledby="fav-moods">
                <h2 id="fav-moods" className="h3 mb-3">Mood bundles</h2>
                <div className="row g-4">
                  {savedMoods.map((mood) => {
                    const movie = getMovieById(mood.movieId);
                    const track = getMusicById(mood.musicId);
                    return (
                      <div className="col-12 col-lg-6" key={mood.id}>
                        <article className="mz-card h-100" data-mood={mood.id}>
                          <div className="row g-0 h-100">
                            <div className="col-4">
                              <ImageWithFallback src={mood.heroImage} alt="" label={mood.name} className="mz-bundle-img" />
                            </div>
                            <div className="col-8 p-3 p-md-4 d-flex flex-column">
                              <h3 className="h4">
                                <Link to={`/mood/${mood.id}`} className="mz-link-plain">{mood.name}</Link>
                              </h3>
                              <p className="small mb-3 flex-grow-1">
                                {movie && <>Film: {movie.title}<br /></>}
                                {track && <>Song: {track.title} by {track.artist}</>}
                              </p>
                              <div className="d-flex flex-wrap gap-2">
                                <Link to={`/mood/${mood.id}`} className="btn mz-btn-primary btn-sm">Open bundle</Link>
                                <FavoriteButton type="mood" id={mood.id} name={`${mood.name} bundle`} />
                              </div>
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {savedPlaces.length > 0 && (
              <section aria-labelledby="fav-places">
                <h2 id="fav-places" className="h3 mb-3">Places</h2>
                <div className="row g-4">
                  {savedPlaces.map((place) => (
                    <div className="col-12 col-md-6 col-xl-4" key={place.id}>
                      <PlaceCard place={place} moodId={place.moodIds[0]} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
