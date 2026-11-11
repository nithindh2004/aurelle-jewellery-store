import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/format';
import SmartImage from './SmartImage';
import WishlistButton from './WishlistButton';
import './ProductCard.css';

/**
 * One button opens the quick view: the product name. Its hit area is
 * stretched over the whole card (see .product-card__open::after), so the
 * photo is clickable too, without a second tab stop or a clickable <div>.
 * The wishlist and add-to-cart buttons sit above that layer.
 */
export default function ProductCard({ product }) {
  const { addToCart, openQuickView } = useStore();
  const needsSize = Boolean(product.sizes);

  return (
    <article className="product-card">
      <div className="product-card__media">
        <SmartImage photoId={product.image} alt={product.alt} focus={product.focus} aspect={product.focus && '4:5'} />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">
          <button
            type="button"
            className="product-card__open"
            onClick={() => openQuickView(product.id)}
            aria-haspopup="dialog"
            aria-label={`${product.name}: view details`}
          >
            {product.name}
          </button>
        </h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">{formatINR(product.price)}</p>
        <button
          type="button"
          className="btn btn--outline btn--small btn--block product-card__add"
          onClick={() => (needsSize ? openQuickView(product.id, { needsSize: true }) : addToCart(product.id))}
          aria-haspopup={needsSize ? 'dialog' : undefined}
          aria-label={`${needsSize ? 'Choose size' : 'Add to cart'}: ${product.name}`}
        >
          {needsSize ? 'Choose size' : 'Add to cart'}
        </button>
      </div>

      <WishlistButton productId={product.id} productName={product.name} className="product-card__wish" />
    </article>
  );
}
