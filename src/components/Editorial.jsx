import { lifestyleImages } from '../data/products';
import SmartImage from './SmartImage';
import './Editorial.css';

export default function Editorial() {
  const { image, alt } = lifestyleImages.editorial;

  return (
    <section id="about" className="editorial" aria-labelledby="editorial-title">
      <div className="editorial__inner container">
        <div className="editorial__image">
          <SmartImage photoId={image} alt={alt} sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="editorial__copy">
          <h2 id="editorial-title">Made for moments that matter.</h2>
          <p>
            Every AURELLE piece begins as a sketch at the bench and is finished by hand. Stones are set one at a time,
            and every edge is polished until it rests softly against the skin.
          </p>
          <p>
            We design for the way jewellery is really worn: the studs you never take off, the bangle saved for weddings,
            the ring that marks a promise. Pieces made to stay with you, and to be handed on.
          </p>
          <a className="btn btn--outline" href="#jewellery">
            See the collection
          </a>
        </div>
      </div>
    </section>
  );
}
