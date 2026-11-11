import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { NAV_LINKS } from '../data/navigation';
import './Navbar.css';

function CountBadge({ count }) {
  if (count === 0) return null;
  return (
    <span className="navbar__count" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Navbar({ onSearch }) {
  const { itemCount, wishlistCount, openCart, openWishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on Escape or when the viewport grows to desktop.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 900px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onChange);
    return () => {
      document.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <button
          type="button"
          className="icon-button navbar__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <a href="#home" className="navbar__wordmark" onClick={closeMenu}>
          Aurelle
        </a>

        <nav className="navbar__links" aria-label="Main">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Search jewellery"
            onClick={() => {
              closeMenu();
              onSearch();
            }}
          >
            <Search size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button navbar__counted"
            aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
            onClick={() => {
              closeMenu();
              openWishlist();
            }}
          >
            <Heart size={20} aria-hidden="true" />
            <CountBadge count={wishlistCount} />
          </button>
          <button
            type="button"
            className="icon-button navbar__counted"
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            onClick={() => {
              closeMenu();
              openCart();
            }}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            <CountBadge count={itemCount} />
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}
        aria-label="Mobile"
        hidden={!menuOpen}
      >
        <ul className="container">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
