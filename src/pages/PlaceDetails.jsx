import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import FavoriteButton from '../components/FavoriteButton';
import ImageWithFallback from '../components/ImageWithFallback';
import PageTransition from '../components/PageTransition';
import WikipediaSummary from '../components/WikipediaSummary';
import NotFound from './NotFound';
import useMoodTheme from '../hooks/useMoodTheme';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getMoodById, getPlaceById, googleMapsUrl } from '../utils/dataHelpers';

export default function PlaceDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams(); // reads ?mood=nostalgic
  const place = getPlaceById(id);

  // Use the mood from the URL if it really belongs to this place, else the place's first mood.
  const requested = getMoodById(searchParams.get('mood'));
  const mood =
    requested && place && place.moodIds.includes(requested.id)
      ? requested
      : place && getMoodById(place.moodIds[0]);

  useMoodTheme(mood ? mood.id : 'home');
  useDocumentTitle(place ? `${place.name} — Mazag` : 'Place not found — Mazag');

  if (!place) {
    return <NotFound message="We couldn't find that place." />;
  }

  const [mainImage, ...otherImages] = place.images;

  return (
    <PageTransition>
      <div className="container mz-section">
        <Link to={`/mood/${mood.id}`} className="mz-back d-inline-flex align-items-center gap-2 mb-4">
          <ArrowLeft size={18} aria-hidden="true" /> Back to {mood.name}
        </Link>

        <header className="mb-4">
          <p className="mz-location mb-1"><MapPin size={14} aria-hidden="true" /> {place.governorate} · {place.region}</p>
          <h1 className="mz-hero-title">{place.name}</h1>
        </header>

        <div className="row g-3 mb-5" role="group" aria-label={`Photos of ${place.name}`}>
          <div className="col-12 col-lg-8">
            <ImageWithFallback src={mainImage.src} alt={mainImage.alt} label={place.name} className="mz-gallery-main" />
          </div>
          {otherImages.map((img) => (
            <div className="col-6 col-lg-4" key={img.src}>
              <ImageWithFallback src={img.src} alt={img.alt} className="mz-gallery-thumb" hideOnError />
            </div>
          ))}
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            <h2 className="h3">About this place</h2>
            <p className="mz-readable">{place.description}</p>

            <h2 className="h3 mt-4">Reasons to visit</h2>
            <ul className="mz-readable">
              {place.reasonsToVisit.map((r) => <li key={r}>{r}</li>)}
            </ul>

            {/* Data from an external API (Wikipedia). The JSON data above still shows if it fails. */}
            <WikipediaSummary title={place.wikiTitle} placeName={place.name} />
          </div>

          <aside className="col-lg-5" aria-label="Visitor information">
            <div className="mz-card p-4">
              <h2 className="h4">Before you go</h2>
              <dl className="mz-facts">
                <div><dt>Governorate</dt><dd>{place.governorate}</dd></div>
                <div><dt>Region</dt><dd>{place.region}</dd></div>
              </dl>
              <p className="mb-1"><span className="mz-note-label">General tips:</span></p>
              <ul>
                {place.visitorTips.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <p className="small text-muted-mz">
                Opening hours, prices and conditions change. Always check locally before you travel.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a
                  className="btn mz-btn-primary d-inline-flex align-items-center gap-2"
                  href={googleMapsUrl(place.mapQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps <ExternalLink size={16} aria-hidden="true" />
                </a>
                <FavoriteButton type="place" id={place.id} name={place.name} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
