import { useEffect, useState } from 'react';

// Shows a photo. If the file is missing or fails to load, shows a themed
// placeholder instead (or nothing when hideOnError is true, e.g. extra gallery images).
export default function ImageWithFallback({
  src,
  alt,
  label,
  className = '',
  hideOnError = false,
}) {
  const [failed, setFailed] = useState(false);

  // Try again if a different image is passed in.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    if (hideOnError) return null;
    return (
      <div className={`mz-img-fallback ${className}`} role="img" aria-label={alt}>
        <span>{label || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`mz-photo ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
