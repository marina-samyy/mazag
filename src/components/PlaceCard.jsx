import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import FavoriteButton from './FavoriteButton';

export default function PlaceCard({ place, moodId }) {
  // moodId is passed in the URL so the place page keeps the same theme.
  const to = moodId ? `/place/${place.id}?mood=${moodId}` : `/place/${place.id}`;

  return (
    <article className="mz-card h-100 d-flex flex-column">
      <Link to={to} className="mz-card-media" tabIndex={-1} aria-hidden="true">
        <ImageWithFallback src={place.images[0].src} alt="" label={place.name} />
      </Link>
      <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
        <p className="mz-location mb-1">
          <MapPin size={14} aria-hidden="true" /> {place.governorate}
        </p>
        <h3 className="h4">
          <Link to={to} className="mz-link-plain">{place.name}</Link>
        </h3>
        <p className="text-muted-mz flex-grow-1">{place.summary}</p>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <Link className="btn mz-btn-primary" to={to}>View place</Link>
          <FavoriteButton type="place" id={place.id} name={place.name} iconOnly />
        </div>
      </div>
    </article>
  );
}
