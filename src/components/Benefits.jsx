import { Gem, ListChecks, PackageCheck } from 'lucide-react';
import './Benefits.css';

const BENEFITS = [
  {
    icon: Gem,
    title: 'Thoughtful Craftsmanship',
    text: 'Considered proportions, careful stone settings and smooth finishes, designed to sit comfortably every day.',
  },
  {
    // Only claims what the product data shows: purity, stones, weight and size where listed.
    icon: ListChecks,
    title: 'Transparent Product Details',
    text: 'Clear information on metal purity, stones, approximate weight and sizing, helping customers make informed choices.',
  },
  {
    icon: PackageCheck,
    title: 'Seamless Shopping Experience',
    text: 'Save favourites, compare pieces and review your cart in one place, on any device.',
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-labelledby="benefits-title">
      <div className="container">
        <h2 id="benefits-title" className="visually-hidden">
          Why AURELLE
        </h2>
        <ul className="benefits__list">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="benefit">
              <Icon size={26} strokeWidth={1.25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
        <p className="benefits__note">Brand promises shown here are concept messaging for a fictional label.</p>
      </div>
    </section>
  );
}
