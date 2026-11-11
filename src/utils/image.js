const UNSPLASH_BASE = 'https://images.unsplash.com';
const SRCSET_WIDTHS = [400, 800, 1200];

/**
 * Builds an Unsplash (imgix) URL at a given width.
 * `focus` = { x, y, zoom } crops around a focal point (x, y are 0–1 fractions
 * of the photo) and zooms in, so small jewellery fills the frame. `aspect`
 * (e.g. '4:5') sets the crop's aspect ratio so the focal point stays centred
 * in the frame the image is shown in.
 */
export function unsplashUrl(photoId, width = 800, focus = null, aspect = null) {
  let url = `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${width}&q=75`;
  if (focus) url += `&crop=focalpoint&fp-x=${focus.x}&fp-y=${focus.y}&fp-z=${focus.zoom}`;
  if (aspect) url += `&ar=${aspect}`;
  return url;
}

/** Responsive srcset so the browser picks the smallest image that looks sharp. */
export const unsplashSrcSet = (photoId, focus = null, aspect = null) =>
  SRCSET_WIDTHS.map((w) => `${unsplashUrl(photoId, w, focus, aspect)} ${w}w`).join(', ');
