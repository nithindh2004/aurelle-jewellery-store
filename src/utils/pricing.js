/**
 * Illustrative catalogue pricing for the fictional AURELLE storefront.
 *
 * This is NOT a live price feed, a quotation or a tax/billing calculator.
 * It exists so that the fictional prices are internally consistent and
 * plausible for Indian gold jewellery, and so the method can be explained.
 *
 * Reference gold rates: GoodReturns, "Gold Rates Today, November 9" (2026),
 * published per-gram prices. Historical reference values, not live rates.
 *
 * GST: the GST Council / CBIC sectoral FAQ on gems and jewellery (Q7) states
 * that GST on the sale of jewellery is 3% of the total transaction value,
 * whether or not making charges are shown separately. So 3% is applied once,
 * to (metal + making + stones). Not tax advice; illustration only.
 */
export const GOLD_RATE_REFERENCE = {
  date: '2026-11-09',
  source: 'GoodReturns, "Gold Rates Today, November 9: 24K, 22K, 18K"',
  url: 'https://www.goodreturns.in/news/gold-rates-today-november-9-24k-22k-18k-gold-price-jump-rs-10300-mumbai-delhi-but-falls-in-chennai-1546003.html',
  perGram: { '24K': 14460, '22K': 13255, '18K': 10845 },
};

export const GST_RATE = 0.03;
export const ROUND_TO = 10;

/**
 * Breaks an illustrative price into its parts.
 *   metal  = weight (g) × reference rate for the purity
 *   making = metal × assumed making-charge rate
 *   stones = assumed stone value (₹), 0 when the piece has no stones
 *   gst    = 3% × (metal + making + stones)
 *   price  = (metal + making + stones + gst), rounded to the nearest ₹10
 * Throws on missing or impossible inputs instead of inventing a number.
 */
export function calculatePrice({ purity, metalWeightGrams, makingChargeRate, stoneValue = 0 }) {
  const rate = GOLD_RATE_REFERENCE.perGram[purity];
  if (!rate) throw new Error(`No reference gold rate for purity "${purity}"`);
  if (!(metalWeightGrams > 0)) throw new Error('metalWeightGrams must be a positive number');
  if (!(makingChargeRate >= 0 && makingChargeRate < 1)) throw new Error('makingChargeRate must be between 0 and 1');
  if (!(stoneValue >= 0)) throw new Error('stoneValue must be zero or positive');

  const metal = metalWeightGrams * rate;
  const making = metal * makingChargeRate;
  const beforeTax = metal + making + stoneValue;
  const gst = beforeTax * GST_RATE;
  const price = Math.round((beforeTax + gst) / ROUND_TO) * ROUND_TO;
  return { rate, metal, making, stones: stoneValue, gst, price };
}

/**
 * The displayed price of a product: calculated from its pricing inputs when
 * it has them, otherwise its stated catalogue price (for pieces whose value
 * is not mainly gold, such as pearls or silver).
 */
export function resolvePrice(product) {
  if (product.pricing) return calculatePrice(product.pricing).price;
  if (Number.isInteger(product.catalogPrice) && product.catalogPrice > 0) return product.catalogPrice;
  throw new Error(`Product "${product.id}" has neither pricing inputs nor a catalogue price`);
}
