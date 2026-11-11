import { useEffect, useLayoutEffect, useRef } from 'react';
import './Overlay.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/*
 * Shared across every Overlay instance. Opening the cart from the quick view
 * (or "Choose size" from the wishlist) swaps one overlay for another in a
 * single render, so the element to return focus to must belong to the whole
 * overlay session, not to each overlay: it is captured when the first overlay
 * opens and restored only once the last one has closed.
 */
let openOverlays = 0;
let returnFocusTo = null;

/**
 * Accessible modal surface used by the quick-view modal and the side drawers.
 * - Moves focus inside on open; returns it to the original trigger on close.
 * - Traps Tab / Shift+Tab inside the panel, including when focus has been lost
 *   (for example after the focused line in the cart was removed).
 * - Escape and backdrop click close it.
 * - Locks page scroll without a layout jump from the disappearing scrollbar.
 * App marks the rest of the page `inert` while an overlay is open.
 *
 * A custom overlay is used instead of <dialog>.showModal() because the native
 * top layer would cover the toast notifications that confirm cart actions.
 */
export default function Overlay({ open, onClose, labelledBy, variant = 'modal', children }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const root = document.documentElement;

    const active = document.activeElement;
    // Only a page element can be the return target, never one inside an overlay
    // (React StrictMode re-runs this effect after focus has moved into the panel).
    if (openOverlays === 0 && active instanceof HTMLElement && active !== document.body && !active.closest('.overlay')) {
      returnFocusTo = active;
    }
    // Measure the scrollbar only when not already locked (a swap or a StrictMode re-run keeps the lock).
    if (!root.classList.contains('is-scroll-locked')) {
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
      root.classList.add('is-scroll-locked');
    }
    openOverlays += 1;
    document.body.classList.add(`has-open-${variant}`);

    const initial = panel.querySelector('[data-autofocus]') ?? panel.querySelector(FOCUSABLE) ?? panel;
    initial.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = panel.contains(document.activeElement) && document.activeElement !== panel;
      if (!inside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove(`has-open-${variant}`);
      openOverlays -= 1;
      // Wait a microtask: if this close is half of a swap, the next overlay has
      // opened by then and the session (scroll lock, return focus) continues.
      queueMicrotask(() => {
        if (openOverlays > 0) return;
        root.classList.remove('is-scroll-locked');
        document.body.style.paddingRight = '';
        const target = returnFocusTo;
        returnFocusTo = null;
        if (target?.isConnected) target.focus({ preventScroll: true });
      });
    };
  }, [open, variant]);

  if (!open) return null;

  return (
    <div className={`overlay overlay--${variant}`}>
      <div className="overlay__backdrop" onClick={() => onClose()} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`overlay__panel overlay__panel--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
