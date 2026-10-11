import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mz-footer">
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-2">
        <p className="mb-0">
          <strong>Mazag</strong> <span lang="ar" dir="rtl">مزاج</span> — Egypt by mood. A university front-end project.
        </p>
        <p className="mb-0 text-muted-mz">
          Titles, years and artists are factual. Descriptions are editorial. Check opening hours locally before you travel.{' '}
          <Link to="/favorites">Your favorites</Link>
        </p>
      </div>
    </footer>
  );
}
