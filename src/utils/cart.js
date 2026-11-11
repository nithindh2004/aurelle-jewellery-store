import { productById } from '../data/products.js';
import { MAX_QUANTITY } from '../data/store.js';

/** A cart line is unique per product + size, so two ring sizes are two lines. */
export const lineKey = (productId, size) => (size ? `${productId}::${size}` : productId);

/**
 * The size a line may carry for this product: a listed size for sized
 * products, and always `null` for products that have no sizes.
 * Returns `undefined` when the size is not valid for the product.
 */
export function normaliseSize(product, size) {
  if (!product.sizes) return null;
  const asText = typeof size === 'number' ? String(size) : size;
  return product.sizes.includes(asText) ? asText : undefined;
}

const clampQuantity = (quantity) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

/**
 * Rebuilds the cart from untrusted stored data:
 * - drops non-objects, unknown product ids and sizes the product doesn't offer;
 * - strips any size from products that have no sizes;
 * - drops quantities that aren't finite numbers ≥ 1, floors fractions, caps at MAX_QUANTITY;
 * - recomputes every line key instead of trusting the stored one;
 * - merges duplicate lines (same product + size), keeping the first line's position.
 */
export function sanitiseCart(stored) {
  if (!Array.isArray(stored)) return [];
  const lines = new Map();

  for (const entry of stored) {
    if (!entry || typeof entry !== 'object') continue;
    const product = productById.get(entry.productId);
    if (!product) continue;
    const size = normaliseSize(product, entry.size);
    if (size === undefined) continue;
    if (typeof entry.quantity !== 'number' || !Number.isFinite(entry.quantity) || entry.quantity < 1) continue;

    const key = lineKey(product.id, size);
    const quantity = clampQuantity(entry.quantity);
    const existing = lines.get(key);
    lines.set(key, {
      key,
      productId: product.id,
      size,
      quantity: existing ? Math.min(MAX_QUANTITY, existing.quantity + quantity) : quantity,
    });
  }

  return [...lines.values()];
}

/** Keeps unique, known product ids, in their stored order. */
export function sanitiseWishlist(stored) {
  if (!Array.isArray(stored)) return [];
  return [...new Set(stored.filter((id) => typeof id === 'string' && productById.has(id)))];
}
