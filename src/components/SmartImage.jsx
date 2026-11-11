import { useState } from 'react';
import { Gem } from 'lucide-react';
import { unsplashSrcSet, unsplashUrl } from '../utils/image';
import './SmartImage.css';

/**
 * Responsive, lazy-loaded photograph with a graceful fallback.
 * If the image fails to load, a styled panel replaces it, so layouts never
 * collapse or show a broken-image icon. The panel keeps the image's role:
 * labelled with the alt text, or hidden from assistive technology when the
 * image is decorative (alt="").
 * `focus` and `aspect` request a focal-point crop (see utils/image.js); only
 * pass `aspect` when the frame's shape is fixed, so the crop matches it.
 */
export default function SmartImage({
  photoId,
  alt,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  eager = false,
  className = '',
  focus = null,
  aspect = null,
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`smart-image smart-image--fallback ${className}`}
        {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true })}
      >
        <Gem size={28} strokeWidth={1.25} aria-hidden="true" />
        <span aria-hidden="true">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      className={`smart-image ${className}`}
      src={unsplashUrl(photoId, 800, focus, aspect)}
      srcSet={unsplashSrcSet(photoId, focus, aspect)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
