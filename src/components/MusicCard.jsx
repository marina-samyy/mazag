import { ExternalLink } from 'lucide-react';
import { youtubeSearchUrl } from '../utils/dataHelpers';
import useItunesTrack from '../hooks/useItunesTrack';

export default function MusicCard({ track }) {
  // Extra data from the iTunes Search API. If it fails, only the JSON data and YouTube link show.
  const { status, track: found } = useItunesTrack(track.searchQuery);

  return (
    <article className="mz-card h-100 p-3 p-md-4">
      <h3 className="h4 mb-1">{track.title}</h3>
      {track.arabicTitle && <p className="mb-2" lang="ar" dir="rtl">{track.arabicTitle}</p>}
      <dl className="mz-facts">
        <div><dt>Artist</dt><dd>{track.artist}</dd></div>
        {track.year && <div><dt>Year</dt><dd>{track.year}</dd></div>}
      </dl>
      <p><span className="mz-note-label">Our take: </span>{track.note}</p>

      {/* Live preview from the iTunes Search API */}
      {status === 'loading' && (
        <p className="small text-muted-mz" role="status">Loading preview…</p>
      )}
      {status === 'success' && (
        <div className="mz-preview mb-3">
          <div className="d-flex align-items-center gap-3 mb-2">
            <img
              src={found.artworkUrl100.replace('100x100', '300x300')}
              alt={`Cover art for ${found.trackName}`}
              className="mz-preview-art"
              loading="lazy"
            />
            <p className="mb-0 small">
              <strong>{found.trackName}</strong><br />
              {found.artistName}
            </p>
          </div>
          <audio controls preload="none" src={found.previewUrl} className="w-100" aria-label={`30-second preview of ${found.trackName}`} />
          <p className="small text-muted-mz mt-1 mb-0">30-second preview from Apple Music (iTunes Search API).</p>
        </div>
      )}

      {/* If a youtubeId is added to music.json, the track is embedded here. */}
      {track.youtubeId && (
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}`}
            title={`${track.title} by ${track.artist}`}
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <a
        className="btn mz-btn-primary d-inline-flex align-items-center gap-2"
        href={youtubeSearchUrl(track.searchQuery)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Listen on YouTube <ExternalLink size={16} aria-hidden="true" />
      </a>
      <p className="small text-muted-mz mt-2 mb-0">Opens YouTube search results for this track.</p>
    </article>
  );
}
