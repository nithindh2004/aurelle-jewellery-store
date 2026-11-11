import { useCallback, useRef, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import Benefits from './components/Benefits';
import CartDrawer from './components/CartDrawer';
import Catalogue from './components/Catalogue';
import Categories from './components/Categories';
import Editorial from './components/Editorial';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Newsletter from './components/Newsletter';
import QuickView from './components/QuickView';
import WishlistDrawer from './components/WishlistDrawer';

const DEFAULT_FILTERS = { category: 'All', query: '', sort: 'featured' };

function Storefront() {
  const { openPanel, quickView } = useStore();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const searchInputRef = useRef(null);
  const overlayOpen = Boolean(openPanel || quickView);

  const scrollToCatalogue = useCallback(() => {
    document.getElementById('jewellery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSearch = useCallback(() => {
    scrollToCatalogue();
    // preventScroll keeps the smooth scroll from being cut short by the focus jump.
    searchInputRef.current?.focus({ preventScroll: true });
  }, [scrollToCatalogue]);

  const handleSelectCategory = useCallback(
    (category) => {
      setFilters((current) => ({ ...current, category, query: '' }));
      scrollToCatalogue();
    },
    [scrollToCatalogue],
  );

  return (
    <>
      {/* While an overlay is open the page behind it is inert: not focusable, not clickable. */}
      <div className="app-shell" inert={overlayOpen}>
        <a className="skip-link" href="#jewellery">
          Skip to the collection
        </a>
        <Navbar onSearch={handleSearch} />
        <main>
          <Hero />
          <Categories onSelectCategory={handleSelectCategory} />
          <Catalogue filters={filters} onFiltersChange={setFilters} searchInputRef={searchInputRef} />
          <Editorial />
          <Benefits />
          <Newsletter />
        </main>
        <Footer />
      </div>

      <QuickView />
      <CartDrawer onBrowse={scrollToCatalogue} />
      <WishlistDrawer onBrowse={scrollToCatalogue} />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <Storefront />
      </StoreProvider>
    </ToastProvider>
  );
}
