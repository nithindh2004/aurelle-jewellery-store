export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

/**
 * Filters by category and search text, then sorts.
 * Every search word must appear somewhere in the product's name,
 * category, description, material or specification values (stones, pearls,
 * inlay…), so "gold ring" or "emerald" narrows results.
 */
export function filterProducts(products, { category = 'All', query = '', sort = 'featured' }) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filtered = products.filter((product) => {
    if (category !== 'All' && product.category !== category) return false;
    if (terms.length === 0) return true;
    const specs = (product.details ?? []).map(([, value]) => value).join(' ');
    const haystack = `${product.name} ${product.category} ${product.description} ${product.material} ${specs}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });

  if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
  return filtered;
}
