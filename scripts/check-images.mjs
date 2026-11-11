#!/usr/bin/env node
/**
 * Image audit for the AURELLE storefront (no dependencies; Node 20.19+).
 *
 *   npm run check:images
 *
 * Requests every photograph exactly as the app requests it (same URL,
 * including focal-point crop parameters) and classifies each result:
 *
 *   ok             loaded: HTTP 2xx, image content type, decodable image data
 *   invalid-url    the URL could not be built or parsed
 *   network-error  DNS, connection, TLS or timeout failure (the URL may be fine)
 *   http-error     the server answered with a non-2xx status
 *   not-image      the response is not an image content type
 *   bad-content    empty body, or bytes that are not a JPEG/PNG/WebP/GIF/AVIF
 *
 * It also flags duplicate URLs and duplicate image content (SHA-256), and
 * writes docs/image-audit.html: a contact sheet with each photo, what it is
 * used for, the expected subject, URL, status, dimensions and verification
 * state. A successful load does NOT prove a photo shows the right jewellery:
 * the "Visual check" column records the last time a person looked
 * (src/data/imageCredits.js), and the sheet is how you look again.
 *
 * Exit code 1 if any image fails to load or a duplicate is found.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { categoryCards, lifestyleImages, products } from '../src/data/products.js';
import { creditByImage } from '../src/data/imageCredits.js';
import { unsplashUrl } from '../src/utils/image.js';
import { audit } from './image-audit-lib.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'docs/image-audit.html');
/** Every image the app shows, with the exact URL it requests at 800px. */
const entries = [
  { usedFor: 'Hero', subject: lifestyleImages.hero.alt, image: lifestyleImages.hero.image },
  { usedFor: 'Editorial section', subject: lifestyleImages.editorial.alt, image: lifestyleImages.editorial.image },
  ...categoryCards.map((c) => ({
    usedFor: `Category: ${c.name}`,
    subject: `${c.name} (decorative card image)`,
    image: c.image,
    focus: c.focus,
    aspect: c.focus && '3:4',
  })),
  ...products.map((p) => ({
    usedFor: `${p.category}: ${p.name}`,
    subject: `${p.alt}. Sold as: ${p.material}.`,
    image: p.image,
    focus: p.focus,
    aspect: p.focus && '4:5',
  })),
].map((e) => ({ ...e, url: buildUrl(e) }));

function buildUrl(e) {
  try {
    return new URL(unsplashUrl(e.image, 800, e.focus, e.aspect)).href;
  } catch {
    return null;
  }
}

const escape = (text) =>
  String(text ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function contactSheet(results) {
  const loaded = results.filter((r) => r.result === 'ok').length;
  const rows = results
    .map((r) => {
      const credit = creditByImage.get(r.image);
      const visual = credit?.visualCheck ? `Looked at on ${credit.visualCheck}` : 'Not yet visually checked';
      const flags = [...(r.duplicateUrl ? ['duplicate URL'] : []), ...(r.duplicateContent ? ['duplicate content'] : [])];
      return `
    <figure class="${r.result === 'ok' && !flags.length ? '' : 'failed'}">
      <img src="${escape(r.url)}" alt="" loading="lazy">
      <figcaption>
        <strong>${escape(r.usedFor)}</strong>
        <span><em>Expected subject:</em> ${escape(r.subject)}</span>
        <span class="mono">${escape(r.image)}</span>
        <a href="${escape(r.url)}">Open image URL</a>
        ${credit ? `<a href="${escape(credit.page)}">Unsplash page</a> <span>by <a href="${escape(credit.profile)}">${escape(credit.contributor)}</a></span>` : '<span>No credit recorded</span>'}
        <span class="mono">HTTP ${escape(r.status ?? '–')} · ${escape(r.type ?? '–')} · ${r.width ? `${r.width}×${r.height}` : 'size unknown'}${r.bytes ? ` · ${Math.round(r.bytes / 1024)} KB` : ''}</span>
        <span class="result ${r.result}">Automated: ${escape(r.result)}${r.detail ? ` (${escape(r.detail)})` : ''}${flags.length ? ` · ${flags.join(', ')}` : ''}</span>
        <span class="visual">Visual check: ${escape(visual)}</span>
        <label><input type="checkbox"> Photo matches the expected subject</label>
      </figcaption>
    </figure>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AURELLE image audit</title>
<style>
  body { margin: 0; padding: 24px; background: #faf6ef; color: #2a2623; font: 15px/1.5 system-ui, sans-serif; }
  h1 { font: 400 28px Georgia, serif; margin: 0 0 4px; }
  p { margin: 0 0 8px; color: #6b635a; max-width: 80ch; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-top: 20px; }
  figure { margin: 0; background: #fff; border: 1px solid #dcd2c2; }
  figure.failed { border: 2px solid #9b3b2e; }
  img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; background: #ede3d3; }
  figcaption { display: grid; gap: 4px; padding: 12px; font-size: 13px; }
  .mono { font-family: ui-monospace, monospace; font-size: 12px; word-break: break-all; }
  .result.ok { color: #3f6b4a; } .result:not(.ok) { color: #9b3b2e; font-weight: 600; }
  .visual { color: #7e6334; } label { margin-top: 6px; }
</style>
<h1>AURELLE image audit</h1>
<p>Generated ${escape(new Date().toISOString())}. ${loaded}/${results.length} images loaded. Duplicate URLs: ${results.filter((r) => r.duplicateUrl).length}. Duplicate content: ${results.filter((r) => r.duplicateContent).length}.</p>
<p>"Automated" proves only that the request succeeded and returned real image data. Whether each photo shows the right jewellery is a visual judgement: look at every card and tick the box.</p>
<div class="grid">${rows}
</div>
</html>
`;
}

const results = await Promise.all(entries.map((entry) => audit(entry)));

const seenUrls = new Map();
const seenHashes = new Map();
for (const r of results) {
  if (r.url) {
    if (seenUrls.has(r.url)) r.duplicateUrl = seenUrls.get(r.url);
    else seenUrls.set(r.url, r.usedFor);
  }
  if (r.sha256) {
    if (seenHashes.has(r.sha256)) r.duplicateContent = seenHashes.get(r.sha256);
    else seenHashes.set(r.sha256, r.usedFor);
  }
}

const counts = {};
for (const r of results) {
  counts[r.result] = (counts[r.result] ?? 0) + 1;
  const flags = [r.duplicateUrl && `dup URL of ${r.duplicateUrl}`, r.duplicateContent && `dup content of ${r.duplicateContent}`].filter(Boolean).join('; ');
  const size = r.width ? `${r.width}x${r.height}` : '';
  console.log(`${r.result.padEnd(13)} ${r.usedFor.padEnd(40)} ${String(r.status ?? '').padEnd(4)} ${size.padEnd(10)} ${r.detail || ''}${flags ? ` [${flags}]` : ''}`);
}
const duplicates = results.filter((r) => r.duplicateUrl || r.duplicateContent).length;
console.log(`\n${counts.ok ?? 0}/${results.length} loaded · ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ')} · duplicates: ${duplicates}`);
if (counts['network-error'] === results.length) {
  console.log('Every request failed at the network level: check your internet connection or proxy. This says nothing about the URLs themselves.');
}

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, contactSheet(results));
console.log(`\nContact sheet: ${pathToFileURL(OUTPUT).href}`);
console.log('Open it in a browser and confirm each photo matches its expected subject. A successful load is not a visual check.');

if ((counts.ok ?? 0) !== results.length || duplicates) process.exitCode = 1;
