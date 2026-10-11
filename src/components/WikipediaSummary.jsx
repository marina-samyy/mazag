import { ExternalLink } from 'lucide-react';
import useWikipediaSummary from '../hooks/useWikipediaSummary';

// Shows live data from the Wikipedia API. The three states are
// loading, error and success, so the page never breaks.
export default function WikipediaSummary({ title, placeName }) {
  const { status, data } = useWikipediaSummary(title);

  return (
    <section className="mz-wiki mt-5" aria-labelledby="wiki-title">
      <h2 id="wiki-title" className="h3">From Wikipedia</h2>

      {status === 'loading' && (
        <p className="text-muted-mz" role="status">Loading information from Wikipedia…</p>
      )}

      {status === 'error' && (
        <p className="text-muted-mz">
          We couldn't load Wikipedia details right now. Everything above is still available.
        </p>
      )}

      {status === 'success' && (
        <div className="row g-3 align-items-start">
          {data.thumbnail && (
            <div className="col-12 col-md-4">
              <img
                src={data.thumbnail.source}
                alt={`${placeName}, image from Wikipedia`}
                className="mz-wiki-img"
                loading="lazy"
              />
            </div>
          )}
          <div className={data.thumbnail ? 'col-12 col-md-8' : 'col-12'}>
            <p className="mz-readable">{data.extract}</p>
            {data.content_urls?.desktop?.page && (
              <a
                href={data.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
                className="d-inline-flex align-items-center gap-2"
              >
                Read the full article on Wikipedia <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
            <p className="small text-muted-mz mt-2 mb-0">Source: Wikipedia, licensed CC BY-SA.</p>
          </div>
        </div>
      )}
    </section>
  );
}
