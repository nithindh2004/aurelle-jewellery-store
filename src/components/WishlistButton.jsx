import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './WishlistButton.css';

/** Heart toggle used on product cards and in the quick-view modal. */
export default function WishlistButton({ productId, productName, className = '', withLabel = false }) {
  const { isWishlisted, toggleWishlist } = useStore();
  const saved = isWishlisted(productId);

  return (
    <button
      type="button"
      className={`wishlist-button ${saved ? 'is-saved' : ''} ${withLabel ? 'wishlist-button--labelled' : ''} ${className}`}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `Save ${productName} to wishlist`}
      onClick={(event) => {
        event.stopPropagation();
        toggleWishlist(productId);
      }}
    >
      <Heart size={18} aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
      {withLabel && <span>{saved ? 'Saved to wishlist' : 'Save to wishlist'}</span>}
    </button>
  );
}
