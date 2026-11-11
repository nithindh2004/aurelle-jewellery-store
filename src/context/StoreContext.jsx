import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { productById } from '../data/products';
import { FREE_SHIPPING_THRESHOLD, MAX_QUANTITY, SHIPPING_FEE, STORAGE_KEYS } from '../data/store';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { lineKey, normaliseSize, sanitiseCart, sanitiseWishlist } from '../utils/cart';
import { useClearToasts, useToast } from './ToastContext';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const showToast = useToast();
  const clearToasts = useClearToasts();
  const [cart, setCart] = useLocalStorage(STORAGE_KEYS.cart, [], sanitiseCart);
  const [wishlist, setWishlist] = useLocalStorage(STORAGE_KEYS.wishlist, [], sanitiseWishlist);

  // Which overlay is open. Only one panel or modal is shown at a time.
  const [openPanel, setOpenPanel] = useState(null); // 'cart' | 'wishlist' | null
  const [quickView, setQuickView] = useState(null); // { productId, needsSize } | null

  // Opening a drawer clears earlier toasts: the drawer itself now shows that state.
  const openCart = useCallback(() => {
    clearToasts();
    setQuickView(null);
    setOpenPanel('cart');
  }, [clearToasts]);
  const openWishlist = useCallback(() => {
    clearToasts();
    setQuickView(null);
    setOpenPanel('wishlist');
  }, [clearToasts]);
  const closePanel = useCallback(() => setOpenPanel(null), []);

  const openQuickView = useCallback((productId, { needsSize = false } = {}) => {
    setOpenPanel(null);
    setQuickView({ productId, needsSize });
  }, []);
  const closeQuickView = useCallback(() => setQuickView(null), []);

  const addToCart = useCallback(
    (productId, { size = null, quantity = 1 } = {}) => {
      const product = productById.get(productId);
      if (!product) return;
      // The same rule as stored data: sized products need a listed size, others never carry one.
      const validSize = normaliseSize(product, size);
      if (validSize === undefined) return;
      size = validSize;
      const key = lineKey(productId, size);
      const existingQuantity = cart.find((line) => line.key === key)?.quantity ?? 0;
      const capped = existingQuantity + quantity > MAX_QUANTITY;

      setCart((current) => {
        const existing = current.find((line) => line.key === key);
        if (!existing) {
          return [...current, { key, productId, size, quantity: Math.min(quantity, MAX_QUANTITY) }];
        }
        const nextQuantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
        return current.map((line) => (line.key === key ? { ...line, quantity: nextQuantity } : line));
      });

      const sizeNote = size ? ` (size ${size})` : '';
      showToast(
        capped
          ? `You can add up to ${MAX_QUANTITY} of ${product.name}${sizeNote}.`
          : `${product.name}${sizeNote} added to cart`,
        { tone: capped ? 'info' : 'success', action: { label: 'View cart', onClick: openCart } },
      );
    },
    [cart, setCart, showToast, openCart],
  );

  const updateQuantity = useCallback(
    (key, quantity) => {
      const next = Math.max(1, Math.min(MAX_QUANTITY, quantity));
      setCart((current) => current.map((line) => (line.key === key ? { ...line, quantity: next } : line)));
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (key) => {
      const line = cart.find((l) => l.key === key);
      setCart((current) => current.filter((l) => l.key !== key));
      if (line) showToast(`${productById.get(line.productId).name} removed from cart`, { tone: 'info' });
    },
    [cart, setCart, showToast],
  );

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const toggleWishlist = useCallback(
    (productId) => {
      const product = productById.get(productId);
      if (!product) return;
      const wasSaved = wishlist.includes(productId);
      setWishlist((current) =>
        current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
      );
      showToast(wasSaved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`, {
        tone: wasSaved ? 'info' : 'success',
      });
    },
    [wishlist, setWishlist, showToast],
  );

  const totals = useMemo(() => {
    const lines = cart.map((line) => ({ ...line, product: productById.get(line.productId) }));
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = subtotal === 0 || qualifiesForFreeShipping ? 0 : SHIPPING_FEE;
    return {
      lines,
      itemCount,
      subtotal,
      shipping,
      total: subtotal + shipping,
      amountToFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      freeShippingProgress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
    };
  }, [cart]);

  const value = {
    ...totals,
    wishlist,
    wishlistCount: wishlist.length,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    isWishlisted,
    openPanel,
    openCart,
    openWishlist,
    closePanel,
    quickView,
    openQuickView,
    closeQuickView,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Hook lives beside its provider; fast refresh still works for the provider.
// oxlint-disable-next-line react/only-export-components
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}
