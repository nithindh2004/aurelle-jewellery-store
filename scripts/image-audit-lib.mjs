/**
 * Image-audit helpers, kept separate from the CLI so they can be unit-tested
 * (tests/imageAudit.test.js) against a local server for every result class.
 */
import { createHash } from 'node:crypto';

export const TIMEOUT_MS = 20000;
export const NETWORK_CODES = new Set([
  'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENETUNREACH',
  'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'CERT_HAS_EXPIRED', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'SELF_SIGNED_CERT_IN_CHAIN',
]);

/** Reads width × height from image headers, so "200 OK" with junk bytes is caught. */
export function imageInfo(buf) {
  const b = new Uint8Array(buf);
  const u16 = (i) => (b[i] << 8) | b[i + 1];
  const le16 = (i) => b[i] | (b[i + 1] << 8);
  const u32 = (i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return { format: 'jpeg', width: null, height: null };
      const marker = b[i + 1];
      const len = u16(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { format: 'jpeg', height: u16(i + 5), width: u16(i + 7) };
      }
      i += 2 + len;
    }
    return { format: 'jpeg', width: null, height: null };
  }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { format: 'png', width: u32(16), height: u32(20) };
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return { format: 'gif', width: le16(6), height: le16(8) };
  const ascii = (s, e) => String.fromCharCode(...b.slice(s, e));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    const chunk = ascii(12, 16);
    if (chunk === 'VP8X') return { format: 'webp', width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (chunk === 'VP8 ') return { format: 'webp', width: le16(26) & 0x3fff, height: le16(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { format: 'webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return { format: 'webp', width: null, height: null };
  }
  if (ascii(4, 8) === 'ftyp' && /avif|avis/.test(ascii(8, 12))) {
    const ispe = ascii(0, Math.min(b.length, 4096)).indexOf('ispe');
    return ispe > 0 ? { format: 'avif', width: u32(ispe + 8), height: u32(ispe + 12) } : { format: 'avif', width: null, height: null };
  }
  return null;
}

export async function audit(entry, { timeoutMs = TIMEOUT_MS } = {}) {
  if (!entry.url) return { ...entry, result: 'invalid-url', detail: 'URL could not be built' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(entry.url, { redirect: 'follow', signal: controller.signal });
    const status = response.status;
    const type = response.headers.get('content-type') ?? '';
    const redirected = response.redirected ? response.url : null;
    const buf = await response.arrayBuffer();
    const base = { ...entry, status, type, bytes: buf.byteLength, redirected };
    if (!response.ok) return { ...base, result: 'http-error', detail: `HTTP ${status}` };
    if (!type.startsWith('image/')) return { ...base, result: 'not-image', detail: `content-type "${type}"` };
    if (buf.byteLength === 0) return { ...base, result: 'bad-content', detail: 'empty body' };
    const info = imageInfo(buf);
    if (!info) return { ...base, result: 'bad-content', detail: 'bytes are not a recognised image format' };
    const sha256 = createHash('sha256').update(new Uint8Array(buf)).digest('hex');
    return { ...base, ...info, sha256, result: 'ok', detail: '' };
  } catch (error) {
    const code = error.cause?.code ?? error.code;
    if (error.name === 'AbortError') return { ...entry, result: 'network-error', detail: `timed out after ${timeoutMs / 1000}s` };
    if (code && NETWORK_CODES.has(code)) return { ...entry, result: 'network-error', detail: code };
    return { ...entry, result: 'network-error', detail: `${error.message}${code ? ` (${code})` : ''}` };
  } finally {
    clearTimeout(timer);
  }
}

