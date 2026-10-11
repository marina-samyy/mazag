import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import useMoodTheme from '../hooks/useMoodTheme';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound({ message = "This page doesn't exist." }) {
  useMoodTheme('home');
  useDocumentTitle('Page not found — Mazag');

  return (
    <PageTransition>
      <section className="container mz-section text-center mz-404">
        <p className="mz-404-number" aria-hidden="true">404</p>
        <h1 className="mz-hero-title">Lost your way?</h1>
        <p className="lead">{message}</p>
        <p lang="ar" dir="rtl" className="mz-hero-ar">تهت؟</p>
        <Link to="/" className="btn btn-lg mz-btn-primary">Back to home</Link>
      </section>
    </PageTransition>
  );
}
