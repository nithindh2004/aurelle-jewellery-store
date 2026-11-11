import { useRef, useState } from 'react';
import { ShoppingBag, Trash2, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FREE_SHIPPING_THRESHOLD } from '../data/store';
import { formatINR } from '../utils/format';
import { focusAfterRemoval } from '../utils/focus';
import DrawerHeader from './DrawerHeader';
import Overlay from './Overlay';
import QuantityStepper from './QuantityStepper';
import SmartImage from './SmartImage';
import './Drawer.css';

function FreeShippingMeter({ subtotal, amountToFreeShipping, progress }) {
  const qualifies = amountToFreeShipping === 0;
  return (
    <div className="shipping-meter">
      <p className="shipping-meter__text">
        <Truck size={16} aria-hidden="true" />
        {qualifies ? 'Your order ships free.' : `Add ${formatINR(amountToFreeShipping)} more for free shipping.`}
      </p>
      <div
        className="shipping-meter__track"
        role="progressbar"
        aria-label="Progress towards free shipping"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}
        aria-valuetext={qualifies ? 'Free shipping reached' : `${formatINR(amountToFreeShipping)} to go`}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </div>
  );
}

/**
 * Mounted only while the drawer is open, so local UI state such as the
 * checkout notice starts fresh every time, however the drawer was closed
 * (close button, Escape, backdrop, or switching to another overlay).
 */
function CartContents({ onClose, onBrowse }) {
  const {
    lines,
    itemCount,
    subtotal,
    shipping,
    total,
    amountToFreeShipping,
    freeShippingProgress,
    updateQuantity,
    removeFromCart,
  } = useStore();
  const [checkoutNotice, setCheckoutNotice] = useState(false);
  const rootRef = useRef(null);

  const handleRemove = (key, index) => {
    removeFromCart(key);
    focusAfterRemoval(rootRef.current?.closest('[role="dialog"]'), index);
  };

  return (
    <div ref={rootRef} className="drawer__body">
      <DrawerHeader id="cart-title" title="Your cart" count={itemCount} onClose={onClose} />

      {lines.length === 0 ? (
        <div className="drawer__empty">
          <span className="drawer__empty-mark" aria-hidden="true">
            <ShoppingBag size={26} strokeWidth={1.25} />
          </span>
          <h3>Your cart is empty</h3>
          <p>Pieces you add will appear here, with free shipping from {formatINR(FREE_SHIPPING_THRESHOLD)}.</p>
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
        <>
          <FreeShippingMeter
            subtotal={subtotal}
            amountToFreeShipping={amountToFreeShipping}
            progress={freeShippingProgress}
          />

          <ul className="drawer__lines">
            {lines.map(({ key, product, size, quantity }, index) => {
              const label = `${product.name}${size ? `, size ${size}` : ''}`;
              return (
                <li key={key} className="drawer-line">
                  <div className="drawer-line__image">
                    <SmartImage photoId={product.image} alt="" sizes="96px" focus={product.focus} aspect={product.focus && '4:5'} />
                  </div>
                  <div className="drawer-line__body">
                    <div className="drawer-line__top">
                      <div>
                        <p className="drawer-line__name">{product.name}</p>
                        <p className="drawer-line__meta">
                          {size && <span>Size {size}</span>}
                          <span>{formatINR(product.price)} each</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="icon-button drawer-line__remove"
                        data-remove-button
                        onClick={() => handleRemove(key, index)}
                        aria-label={`Remove ${label} from cart`}
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="drawer-line__bottom">
                      <QuantityStepper value={quantity} onChange={(q) => updateQuantity(key, q)} label={label} />
                      <p className="drawer-line__total">
                        <span className="visually-hidden">Line total </span>
                        {formatINR(product.price * quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="drawer__footer">
            <dl className="drawer__totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : formatINR(shipping)}</dd>
              </div>
              <div className="drawer__grand-total">
                <dt>Total</dt>
                <dd>{formatINR(total)}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn--block" onClick={() => setCheckoutNotice(true)}>
              Checkout
            </button>
            <p className={`drawer__note ${checkoutNotice ? 'drawer__note--alert' : ''}`} role="status">
              {checkoutNotice
                ? 'Checkout isn’t available in this concept storefront. No orders are placed and no payment is taken.'
                : 'Concept storefront. No orders are placed and no payment is taken.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default function CartDrawer({ onBrowse }) {
  const { openPanel, closePanel } = useStore();
  return (
    <Overlay open={openPanel === 'cart'} onClose={closePanel} labelledBy="cart-title" variant="drawer">
      <CartContents onClose={closePanel} onBrowse={onBrowse} />
    </Overlay>
  );
}
