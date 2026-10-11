import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import useFavoritesStore from '../store/useFavoritesStore';

// Works for both mood bundles (type="mood") and places (type="place").
export default function FavoriteButton({ type, id, name, iconOnly = false }) {
  const isFav = useFavoritesStore((s) => s[type === 'mood' ? 'moods' : 'places'].includes(id));
  const toggle = useFavoritesStore((s) => s.toggle);

  const handleClick = () => {
    const added = toggle(type, id);
    toast.success(added ? `${name} saved to favorites` : `${name} removed from favorites`);
  };

  const label = isFav ? 'Remove from Favorites' : 'Add to Favorites';

  return (
    <button
      type="button"
      className={`btn ${iconOnly ? 'mz-fav-icon' : 'mz-btn-outline'} ${isFav ? 'is-active' : ''}`}
      onClick={handleClick}
      aria-pressed={isFav}
      aria-label={iconOnly ? `${label}: ${name}` : undefined}
    >
      <Heart size={18} fill={isFav ? 'currentColor' : 'none'} aria-hidden="true" />
      {!iconOnly && <span className="ms-2">{label}</span>}
    </button>
  );
}
