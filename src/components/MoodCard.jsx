import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';

// Big clickable card on the home page. data-mood gives the card its own mood colors.
export default function MoodCard({ mood }) {
  return (
    <Link to={`/mood/${mood.id}`} className="mz-mood-card" data-mood={mood.id}>
      <ImageWithFallback
        src={mood.heroImage}
        alt=""
        label={mood.name}
        className="mz-card-bg"
      />
      <span className="mz-mood-card-ar" lang="ar" dir="rtl">{mood.arabicName}</span>
      <h3 className="mz-mood-card-title">{mood.name}</h3>
      <p className="mz-mood-card-text">{mood.tagline}</p>
      <span className="mz-mood-card-cta">Explore this mood</span>
    </Link>
  );
}
