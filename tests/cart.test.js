import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitiseCart, sanitiseWishlist, lineKey } from '../src/utils/cart.js';
test('non-array → []', () => { assert.deepEqual(sanitiseCart(null), []); assert.deepEqual(sanitiseCart({}), []); assert.deepEqual(sanitiseCart('x'), []); });
test('drops junk entries', () => assert.deepEqual(sanitiseCart([null, 3, 'a', [], { productId: 'ghost', quantity: 1 }]), []));
test('valid sized line kept, key rebuilt', () => assert.deepEqual(
  sanitiseCart([{ key: 'WRONG', productId: 'solene-halo-ring', size: '12', quantity: 2 }]),
  [{ key: 'solene-halo-ring::12', productId: 'solene-halo-ring', size: '12', quantity: 2 }]));
test('sized product with missing/invalid size dropped', () => {
  assert.equal(sanitiseCart([{ productId: 'solene-halo-ring', quantity: 1 }]).length, 0);
  assert.equal(sanitiseCart([{ productId: 'solene-halo-ring', size: '99', quantity: 1 }]).length, 0);
});
test('numeric size accepted as text', () => assert.equal(sanitiseCart([{ productId: 'solene-halo-ring', size: 12, quantity: 1 }])[0].size, '12'));
test('non-sized product loses arbitrary size', () => assert.deepEqual(
  sanitiseCart([{ productId: 'neela-topaz-drops', size: 'XL', quantity: 1 }]),
  [{ key: 'neela-topaz-drops', productId: 'neela-topaz-drops', size: null, quantity: 1 }]));
test('quantities: <1, NaN, string dropped; fraction floored; >max capped', () => {
  assert.equal(sanitiseCart([{ productId: 'neela-topaz-drops', quantity: 0 }]).length, 0);
  assert.equal(sanitiseCart([{ productId: 'neela-topaz-drops', quantity: NaN }]).length, 0);
  assert.equal(sanitiseCart([{ productId: 'neela-topaz-drops', quantity: '3' }]).length, 0);
  assert.equal(sanitiseCart([{ productId: 'neela-topaz-drops', quantity: 2.7 }])[0].quantity, 2);
  assert.equal(sanitiseCart([{ productId: 'neela-topaz-drops', quantity: 500 }])[0].quantity, 10);
});
test('duplicates merged and capped', () => {
  const out = sanitiseCart([
    { productId: 'neela-topaz-drops', quantity: 6 },
    { productId: 'neela-topaz-drops', size: 'junk', quantity: 7 },
    { productId: 'solene-halo-ring', size: '12', quantity: 1 },
    { productId: 'solene-halo-ring', size: '13', quantity: 1 },
  ]);
  assert.equal(out.length, 3);
  assert.equal(out[0].quantity, 10);
  assert.deepEqual(out.map((l) => l.key), ['neela-topaz-drops', 'solene-halo-ring::12', 'solene-halo-ring::13']);
});
test('lineKey', () => { assert.equal(lineKey('a', null), 'a'); assert.equal(lineKey('a', '12'), 'a::12'); });
test('wishlist: dedupe, unknown/non-string dropped', () => assert.deepEqual(
  sanitiseWishlist(['moti-pearl-strand', 'ghost', 5, null, 'moti-pearl-strand', 'tara-solitaire-studs']),
  ['moti-pearl-strand', 'tara-solitaire-studs']));
