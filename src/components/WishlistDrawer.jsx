import { useRef } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { productById } from '../data/products';
import { formatINR } from '../utils/format';
import { focusAfterRemoval } from '../utils/focus';
import DrawerHeader from './DrawerHeader';
import Overlay from './Overlay';
import SmartImage from './SmartImage';
import './Drawer.css';

function WishlistContents({ onClose, onBrowse }) {
  const { wishlist, toggleWishlist, addToCart, openQuickView } = useStore();
  const items = wishlist.map((id) => productById.get(id)).filter(Boolean);
  const rootRef = useRef(null);

  const handleRemove = (productId, index) => {
    toggleWishlist(productId);
    focusAfterRemoval(rootRef.current?.closest('[role="dialog"]'), index);
  };

  return (
    <div ref={rootRef} className="drawer__body">
      <DrawerHeader id="wishlist-title" title="Your wishlist" count={items.length} onClose={onClose} />

      {items.length === 0 ? (
        <div className="drawer__empty">
          <span className="drawer__empty-mark" aria-hidden="true">
            <Heart size={26} strokeWidth={1.25} />
          </span>
          <h3>Your wishlist is empty</h3>
          <p>Select the heart on any piece to keep it here for later.</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              onClose();
              onBrowse();
            }}
          >
            Browse jewellery
          </button>
        </div>
      ) : (
        <ul className="drawer__lines">
          {items.map((product, index) => (
            <li key={product.id} className="drawer-line">
              <div className="drawer-line__image">
                <SmartImage photoId={product.image} alt="" sizes="96px" focus={product.focus} aspect={product.focus && '4:5'} />
              </div>
              <div className="drawer-line__body">
                <div className="drawer-line__top">
                  <div>
                    <p className="drawer-line__name">{product.name}</p>
                    <p className="drawer-line__meta">
                      <span>{product.category}</span>
                      <span>{formatINR(product.price)}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="icon-button drawer-line__remove"
                    data-remove-button
                    onClick={() => handleRemove(product.id, index)}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
                <div className="drawer-line__bottom">
                  {product.sizes ? (
                    <button
                      type="button"
                      className="btn btn--outline btn--small"
                      onClick={() => openQuickView(product.id, { needsSize: true })}
                      aria-label={`Choose size: ${product.name}`}
                    >
                      Choose size
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--outline btn--small"
                      onClick={() => addToCart(product.id)}
                      aria-label={`Add to cart: ${product.name}`}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function WishlistDrawer({ onBrowse }) {
  const { openPanel, closePanel } = useStore();
  return (
    <Overlay open={openPanel === 'wishlist'} onClose={closePanel} labelledBy="wishlist-title" variant="drawer">
      <WishlistContents onClose={closePanel} onBrowse={onBrowse} />
    </Overlay>
  );
}
