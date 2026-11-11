import { lifestyleImages } from '../data/products';
import SmartImage from './SmartImage';
import './Hero.css';

export default function Hero() {
  const { image, alt } = lifestyleImages.hero;

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            Elegance, in every detail.
          </h1>
          <p className="hero__lede">
            Jewellery that celebrates the moments, milestones and memories that make you.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#jewellery">
              Explore Collection
            </a>
            <a className="btn btn--outline" href="#about">
              Discover Our Story
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__arch">
            <SmartImage photoId={image} alt={alt} eager sizes="(min-width: 900px) 46vw, 92vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
