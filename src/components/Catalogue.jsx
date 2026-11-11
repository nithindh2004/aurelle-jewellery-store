import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, products } from '../data/products';
import { filterProducts, SORT_OPTIONS } from '../utils/filterProducts';
import ProductCard from './ProductCard';
import './Catalogue.css';

const FILTERS = ['All', ...CATEGORIES];

export default function Catalogue({ filters, onFiltersChange, searchInputRef }) {
  const { category, query, sort } = filters;
  const results = useMemo(() => filterProducts(products, filters), [filters]);
  const update = (patch) => onFiltersChange({ ...filters, ...patch });
  const isFiltered = category !== 'All' || query.trim() !== '';

  const summary =
    results.length === 0
      ? 'No designs found'
      : `Showing ${results.length} ${results.length === 1 ? 'design' : 'designs'}${
          category !== 'All' ? ` in ${category}` : ''
        }${query.trim() ? ` for “${query.trim()}”` : ''}`;

  return (
    <section id="jewellery" className="section catalogue" aria-labelledby="catalogue-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="catalogue-title">The collection</h2>
          <p>Fine jewellery in gold, diamonds, pearls and coloured stones, designed to be worn often.</p>
        </div>

        <div className="catalogue__toolbar">
          <div className="catalogue__filters" role="group" aria-label="Filter by category">
            {FILTERS.map((name) => (
              <button
                key={name}
                type="button"
                className={`chip ${category === name ? 'is-active' : ''}`}
                aria-pressed={category === name}
                onClick={() => update({ category: name })}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="catalogue__controls">
            <div className="catalogue__search">
              <label htmlFor="catalogue-search" className="visually-hidden">
                Search jewellery
              </label>
              <Search size={18} aria-hidden="true" className="catalogue__search-icon" />
              <input
                ref={searchInputRef}
                id="catalogue-search"
                type="search"
                placeholder="Search name, metal or stone"
                value={query}
                onChange={(e) => update({ query: e.target.value })}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="catalogue__search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    update({ query: '' });
                    searchInputRef.current?.focus();
                  }}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="catalogue__sort">
              <label htmlFor="catalogue-sort">Sort by</label>
              <select id="catalogue-sort" value={sort} onChange={(e) => update({ sort: e.target.value })}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="catalogue__summary" aria-live="polite">
          {summary}
        </p>

        {results.length > 0 ? (
          <ul className="catalogue__grid">
            {results.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="catalogue__empty">
            <h3>Nothing matches yet</h3>
            <p>
              {query.trim()
                ? `No designs match “${query.trim()}”${category !== 'All' ? ` in ${category}` : ''}. Try a broader word such as “gold” or “diamond”, or clear the filters.`
                : 'Try another category, or clear the filters.'}
            </p>
            {isFiltered && (
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onFiltersChange({ category: 'All', query: '', sort })}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
