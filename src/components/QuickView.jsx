import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { productById } from '../data/products';
import { formatINR } from '../utils/format';
import Overlay from './Overlay';
import QuantityStepper from './QuantityStepper';
import SmartImage from './SmartImage';
import WishlistButton from './WishlistButton';
import './QuickView.css';

function QuickViewContent({ product, needsSize, onClose }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const titleId = 'quick-view-title';

  const handleAdd = () => {
    if (product.sizes && !size) {
      setSizeError(true);
      return;
    }
    addToCart(product.id, { size, quantity });
    setQuantity(1);
  };

  return (
    <>
    {/* Zero-height sticky bar keeps the close button reachable while long content scrolls on phones. */}
    <div className="quick-view__close-bar">
      <button type="button" className="icon-button quick-view__close" onClick={onClose} aria-label="Close quick view">
        <X size={22} aria-hidden="true" />
      </button>
    </div>
    <div className="quick-view">
      <div className="quick-view__media">
        <SmartImage
          photoId={product.image}
          alt={product.alt}
          eager
          sizes="(min-width: 760px) 480px, 100vw"
          focus={product.focus}
          aspect={product.focus && '4:5'}
        />
      </div>

      <div className="quick-view__info">
        <p className="quick-view__category">{product.category}</p>
        <h2 id={titleId} className="quick-view__title">
          {product.name}
        </h2>
        <p className="quick-view__price">{formatINR(product.price)}</p>
        <p className="quick-view__description">{product.description}</p>

        <dl className="quick-view__details">
          {product.details.map(([term, value]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {product.sizes && (
          <fieldset
            className={`size-picker ${sizeError ? 'has-error' : ''}`}
            aria-describedby={sizeError ? 'size-error' : needsSize ? 'size-hint' : undefined}
          >
            <legend>{product.sizeLabel}</legend>
            <div className="size-picker__options">
              {product.sizes.map((option) => (
                <label key={option} className="size-picker__option">
                  <input
                    type="radio"
                    name="size"
                    value={option}
                    checked={size === option}
                    onChange={() => {
                      setSize(option);
                      setSizeError(false);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {sizeError ? (
              <p id="size-error" className="size-picker__message size-picker__message--error" role="alert">
                Choose a size to add this piece to your cart.
              </p>
            ) : (
              needsSize && (
                <p id="size-hint" className="size-picker__message">
                  Choose a size to add this piece to your cart.
                </p>
              )
            )}
          </fieldset>
        )}

        <div className="quick-view__purchase">
          <QuantityStepper value={quantity} onChange={setQuantity} label={product.name} />
          <button type="button" className="btn quick-view__add" onClick={handleAdd}>
            Add to cart
          </button>
        </div>

        <WishlistButton productId={product.id} productName={product.name} withLabel />
      </div>
    </div>
    </>
  );
}

export default function QuickView() {
  const { quickView, closeQuickView } = useStore();
  const product = quickView ? productById.get(quickView.productId) : null;

  return (
    <Overlay open={Boolean(product)} onClose={closeQuickView} labelledBy="quick-view-title" variant="modal">
      {product && (
        <QuickViewContent
          key={product.id}
          product={product}
          needsSize={quickView.needsSize}
          onClose={closeQuickView}
        />
      )}
    </Overlay>
  );
}
