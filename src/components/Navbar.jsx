import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import useFavoritesStore from '../store/useFavoritesStore';
import { getAllMoods } from '../utils/dataHelpers';

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu open/closed
  const count = useFavoritesStore((s) => s.moods.length + s.places.length);
  const close = () => setOpen(false);

  return (
    <header className="mz-header sticky-top">
      <nav className="navbar navbar-expand-lg container py-2" aria-label="Main navigation">
        <Link className="navbar-brand mz-brand" to="/" onClick={close}>
          Mazag <span lang="ar" dir="rtl">مزاج</span>
        </Link>

        <button
          type="button"
          className="btn mz-toggler d-lg-none"
          aria-controls="main-nav"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>

        <div id="main-nav" className={`collapse navbar-collapse justify-content-end ${open ? 'show' : ''}`}>
          <ul className="navbar-nav align-items-lg-center gap-lg-1 pt-3 pt-lg-0">
            <li className="nav-item">
              <NavLink end to="/" className="nav-link" onClick={close}>Home</NavLink>
            </li>
            {getAllMoods().map((mood) => (
              <li className="nav-item" key={mood.id}>
                <NavLink to={`/mood/${mood.id}`} className="nav-link" onClick={close}>
                  {mood.name}
                </NavLink>
              </li>
            ))}
            <li className="nav-item">
              <NavLink to="/favorites" className="nav-link d-inline-flex align-items-center gap-2" onClick={close}>
                <Heart size={18} aria-hidden="true" />
                Favorites
                {count > 0 && <span className="mz-badge" aria-label={`${count} saved`}>{count}</span>}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
