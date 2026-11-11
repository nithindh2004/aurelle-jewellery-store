import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { audit, imageInfo } from '../scripts/image-audit-lib.mjs';

// Smallest valid images of each format, built byte by byte.
const PNG_1x1 = Buffer.from(
  '89504e470d0a1a0a0000000d4948445200000001000000010806000000' + '1f15c4890000000d4944415478da63f8cfc0f01f0005000201a5f1a0b10000000049454e44ae426082',
  'hex',
);
const GIF_3x2 = Buffer.from('474946383961030002000000002c00000000030002000002024401003b', 'hex');
// JPEG header: SOI, then a SOF0 segment declaring 640 × 480.
const JPEG_640x480 = Buffer.from('ffd8ffc0001108' + '01e0' + '0280' + '03012200021101031101ffd9', 'hex');
const WEBP_VP8X_300x200 = Buffer.concat([
  Buffer.from('RIFF'), Buffer.from([0x1a, 0, 0, 0]), Buffer.from('WEBPVP8X'), Buffer.from([10, 0, 0, 0, 0, 0, 0, 0]),
  Buffer.from([299 & 0xff, 299 >> 8, 0, 199 & 0xff, 199 >> 8, 0]),
]);

test('imageInfo reads dimensions from PNG, GIF, JPEG and WebP headers', () => {
  assert.deepEqual(imageInfo(PNG_1x1), { format: 'png', width: 1, height: 1 });
  assert.deepEqual(imageInfo(GIF_3x2), { format: 'gif', width: 3, height: 2 });
  assert.deepEqual(imageInfo(JPEG_640x480), { format: 'jpeg', width: 640, height: 480 });
  assert.deepEqual(imageInfo(WEBP_VP8X_300x200), { format: 'webp', width: 300, height: 200 });
});

test('imageInfo rejects non-image bytes', () => {
  assert.equal(imageInfo(Buffer.from('<!doctype html><html></html>')), null);
  assert.equal(imageInfo(Buffer.alloc(0)), null);
});

let server;
let base;
before(async () => {
  server = createServer((req, res) => {
    const routes = {
      '/ok.png': [200, 'image/png', PNG_1x1],
      '/missing.jpg': [404, 'text/plain', Buffer.from('not found')],
      '/page': [200, 'text/html', Buffer.from('<html></html>')],
      '/empty.jpg': [200, 'image/jpeg', Buffer.alloc(0)],
      '/junk.jpg': [200, 'image/jpeg', Buffer.from('this is not really a jpeg')],
    };
    if (req.url === '/moved.png') {
      res.writeHead(301, { Location: '/ok.png' });
      return res.end();
    }
    if (req.url === '/slow.png') return setTimeout(() => res.end(), 2000);
    const [status, type, body] = routes[req.url] ?? [500, 'text/plain', Buffer.from('?')];
    res.writeHead(status, { 'Content-Type': type, 'Content-Length': body.length });
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const run = (path, options) => audit({ url: path === null ? null : `${base}${path}` }, options);

test('audit: a real image loads, with dimensions and a content hash', async () => {
  const r = await run('/ok.png');
  assert.equal(r.result, 'ok');
  assert.equal(r.status, 200);
  assert.equal(r.width, 1);
  assert.match(r.sha256, /^[0-9a-f]{64}$/);
});

test('audit: redirects are followed and reported', async () => {
  const r = await run('/moved.png');
  assert.equal(r.result, 'ok');
  assert.match(r.redirected, /\/ok\.png$/);
});

test('audit: each failure class is distinguished', async () => {
  assert.equal((await run('/missing.jpg')).result, 'http-error');
  assert.equal((await run('/page')).result, 'not-image');
  assert.equal((await run('/empty.jpg')).result, 'bad-content');
  assert.equal((await run('/junk.jpg')).result, 'bad-content');
  assert.equal((await audit({ url: null })).result, 'invalid-url');
  assert.equal((await run('/slow.png', { timeoutMs: 200 })).result, 'network-error');
  // A port that was just freed, so nothing is listening on it.
  const closed = createServer();
  await new Promise((resolve) => closed.listen(0, '127.0.0.1', resolve));
  const { port } = closed.address();
  await new Promise((resolve) => closed.close(resolve));
  const refused = await audit({ url: `http://127.0.0.1:${port}/x.jpg` });
  assert.equal(refused.result, 'network-error');
  assert.match(refused.detail, /ECONNREFUSED/);
});
