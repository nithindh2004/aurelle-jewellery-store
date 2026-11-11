import { categoryCards, products } from '../data/products';
import SmartImage from './SmartImage';
import './Categories.css';

const countByCategory = products.reduce((counts, p) => {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}, {});

export default function Categories({ onSelectCategory }) {
  return (
    <section id="collections" className="section categories" aria-labelledby="categories-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="categories-title">Shop by category</h2>
          <p>Choose a category to see every design in it.</p>
        </div>

        <ul className="categories__grid">
          {categoryCards.map((card) => (
            <li key={card.name}>
              <button type="button" className="category-card" onClick={() => onSelectCategory(card.name)}>
                <span className="category-card__frame">
                  {/* Decorative: the button's text already names the category. */}
                  <SmartImage
                    photoId={card.image}
                    alt=""
                    sizes="(min-width: 900px) 24vw, 46vw"
                    focus={card.focus}
                    aspect={card.focus && '3:4'}
                  />
                </span>
                <span className="category-card__label">
                  <span className="category-card__name">{card.name}</span>
                  <span className="category-card__count">
                    {countByCategory[card.name] ?? 0} designs
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
