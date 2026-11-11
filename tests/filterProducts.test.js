import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { filterProducts } from '../src/utils/filterProducts.js';
import { formatINR } from '../src/utils/format.js';

const names = (list) => list.map((p) => p.name);

test('no filters returns the full catalogue in featured order', () => {
  assert.deepEqual(filterProducts(products, {}), products);
});

test('each category returns only its products', () => {
  for (const category of ['Rings', 'Earrings', 'Necklaces', 'Bracelets']) {
    const result = filterProducts(products, { category });
    assert.ok(result.length > 0, category);
    assert.ok(result.every((p) => p.category === category), category);
  }
});

test('search matches name, material and description, case-insensitively', () => {
  assert.deepEqual(names(filterProducts(products, { query: 'MOTI PEARL' })), ['Moti Pearl Strand']);
  assert.ok(filterProducts(products, { query: 'sterling silver' }).every((p) => p.material.includes('silver')));
  assert.ok(filterProducts(products, { query: 'granulated' }).some((p) => p.name === 'Rani Heritage Pendant'));
});

test('search covers specification values such as stones and inlays', () => {
  assert.deepEqual(names(filterProducts(products, { query: 'baguette' })), ['Noor Diamond Hoops']);
  assert.deepEqual(names(filterProducts(products, { query: 'mother-of-pearl' })), ['Rosa Floral Pendant']);
  assert.deepEqual(names(filterProducts(products, { category: 'Rings', query: 'emerald' })), ['Vanya Emerald Ring']);
});

test('multi-word search requires every word', () => {
  const result = filterProducts(products, { query: 'rose gold' });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => /rose/i.test(`${p.name} ${p.description} ${p.material}`)));
});

test('search combines with category; no match gives an empty list', () => {
  assert.deepEqual(filterProducts(products, { category: 'Rings', query: 'pearl' }), []);
  assert.deepEqual(filterProducts(products, { query: '   ' }), products);
});

test('price sorting in both directions, without mutating the input', () => {
  const before = products.map((p) => p.id);
  const asc = filterProducts(products, { sort: 'price-asc' }).map((p) => p.price);
  const desc = filterProducts(products, { sort: 'price-desc' }).map((p) => p.price);
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
  assert.deepEqual(desc, [...desc].sort((a, b) => b - a));
  assert.deepEqual(products.map((p) => p.id), before);
});

test('INR uses Indian digit grouping', () => {
  assert.equal(formatINR(242330), '₹2,42,330');
  assert.equal(formatINR(8950), '₹8,950');
});

test('catalogue keeps four categories of three products', () => {
  for (const category of ['Rings', 'Earrings', 'Necklaces', 'Bracelets']) {
    assert.equal(products.filter((p) => p.category === category).length, 3, category);
  }
});

test('catalogue data is consistent', () => {
  const ids = products.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'unique ids');
  const photos = products.map((p) => p.image);
  assert.equal(new Set(photos).size, photos.length, 'no photo reused across products');
  for (const p of products) {
    assert.ok(p.alt && p.description && p.material && p.price > 0, p.id);
    if (p.sizes) assert.ok(p.sizeLabel && p.sizes.every((s) => typeof s === 'string'), p.id);
  }
});
