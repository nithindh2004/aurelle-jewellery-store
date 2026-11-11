import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, GOLD_RATE_REFERENCE, GST_RATE, resolvePrice } from '../src/utils/pricing.js';
import { products } from '../src/data/products.js';

test('reference rates are the published 9 Nov 2026 per-gram prices', () => {
  assert.deepEqual(GOLD_RATE_REFERENCE.perGram, { '24K': 14460, '22K': 13255, '18K': 10845 });
  assert.equal(GOLD_RATE_REFERENCE.date, '2026-11-09');
  assert.equal(GST_RATE, 0.03);
});

test('worked example: Aarohi bangle set, 14.2 g of 22K', () => {
  const b = calculatePrice({ purity: '22K', metalWeightGrams: 14.2, makingChargeRate: 0.25 });
  assert.equal(Math.round(b.metal), 188221); // 14.2 × 13,255
  assert.equal(Math.round(b.making), 47055); // 25% of metal value
  // GST is 3% of the whole transaction value (metal + making + stones), applied once.
  assert.equal(Math.round(b.gst), Math.round((b.metal + b.making) * 0.03));
  assert.equal(b.price, 242330); // 2,42,334.5 rounded to the nearest ₹10
});

test('GST covers stones and making charges too, not just gold', () => {
  const b = calculatePrice({ purity: '18K', metalWeightGrams: 1, makingChargeRate: 0, stoneValue: 10000 });
  assert.equal(b.price, Math.round(((10845 + 10000) * 1.03) / 10) * 10);
});

test('missing or impossible inputs are rejected, never guessed', () => {
  assert.throws(() => calculatePrice({ purity: '14K', metalWeightGrams: 2, makingChargeRate: 0.2 }), /No reference gold rate/);
  assert.throws(() => calculatePrice({ purity: '22K', metalWeightGrams: 0, makingChargeRate: 0.2 }), /metalWeightGrams/);
  assert.throws(() => calculatePrice({ purity: '22K', makingChargeRate: 0.2 }), /metalWeightGrams/);
  assert.throws(() => calculatePrice({ purity: '22K', metalWeightGrams: 2, makingChargeRate: 1.5 }), /makingChargeRate/);
  assert.throws(() => calculatePrice({ purity: '22K', metalWeightGrams: 2, makingChargeRate: 0.2, stoneValue: -1 }), /stoneValue/);
  assert.throws(() => resolvePrice({ id: 'x' }), /neither pricing inputs nor a catalogue price/);
});

test('every product price is consistent with its inputs and its stated purity and weight', () => {
  for (const p of products) {
    assert.equal(p.price, resolvePrice(p), p.id);
    assert.equal(p.price % 10, 0, `${p.id} price is rounded to ₹10`);
    if (!p.pricing) {
      assert.ok(Number.isInteger(p.catalogPrice), `${p.id} has a stated catalogue price`);
      assert.ok(!/^(18|22|24)K/.test(p.material), `${p.id} is not a gold piece priced without inputs`);
      continue;
    }
    assert.ok(p.material.startsWith(p.pricing.purity), `${p.id}: purity ${p.pricing.purity} matches material "${p.material}"`);
    const weightRow = p.details.find(([label]) => label === 'Approx. weight');
    assert.ok(weightRow, `${p.id} shows its weight`);
    assert.equal(parseFloat(weightRow[1]), p.pricing.metalWeightGrams, `${p.id}: shown weight matches the priced weight`);
    const hasStones = p.details.some(([label]) => label === 'Stones' || label === 'Inlay');
    assert.equal(hasStones, (p.pricing.stoneValue ?? 0) > 0, `${p.id}: stone value only when the piece lists stones`);
  }
});
