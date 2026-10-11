import ImageWithFallback from './ImageWithFallback';
import useWikipediaSummary from '../hooks/useWikipediaSummary';
import useTmdbMovie from '../hooks/useTmdbMovie';

export default function MovieCard({ movie }) {
  // Two API sources. Both are optional: if they fail, the local JSON data and poster are used.
  const wiki = useWikipediaSummary(movie.wikiTitle);
  const tmdb = useTmdbMovie(movie.tmdbQuery, movie.year);

  const wikiPoster = wiki.status === 'success' && wiki.data.thumbnail ? wiki.data.thumbnail.source : null;
  const wikiUrl = wiki.status === 'success' ? wiki.data.content_urls?.desktop?.page : null;
  const tmdbPoster = tmdb.status === 'success' ? `https://image.tmdb.org/t/p/w500${tmdb.movie.poster_path}` : null;
  const rating = tmdb.status === 'success' && tmdb.movie.vote_average > 0 ? tmdb.movie.vote_average.toFixed(1) : null;

  // Poster priority: TMDB, then Wikipedia, then the local title card.
  const poster = tmdbPoster || wikiPoster || movie.poster;

  return (
    <article className="mz-card h-100">
      <div className="row g-0 h-100">
        <div className="col-5 col-md-4">
          <ImageWithFallback
            src={poster}
            alt={movie.posterAlt}
            label={movie.title}
            className="mz-poster"
          />
        </div>
        <div className="col-7 col-md-8 p-3 p-md-4">
          <h3 className="h4 mb-1">{movie.title}</h3>
          {movie.arabicTitle && (
            <p className="mb-2" lang="ar" dir="rtl">{movie.arabicTitle}</p>
          )}
          <dl className="mz-facts">
            <div><dt>Year</dt><dd>{movie.year}</dd></div>
            <div><dt>Director</dt><dd>{movie.director}</dd></div>
            <div><dt>Connection</dt><dd>{movie.connection}</dd></div>
            {rating && <div><dt>TMDB rating</dt><dd>{rating} / 10</dd></div>}
          </dl>
          <p className="mb-0"><span className="mz-note-label">Our take: </span>{movie.synopsis}</p>

          {(wikiUrl || tmdbPoster) && (
            <p className="small text-muted-mz mt-3 mb-0">
              {wikiUrl && (
                <>
                  Article:{' '}
                  <a href={wikiUrl} target="_blank" rel="noopener noreferrer">Wikipedia</a>.{' '}
                </>
              )}
              {tmdbPoster && 'This product uses the TMDB API but is not endorsed or certified by TMDB.'}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
