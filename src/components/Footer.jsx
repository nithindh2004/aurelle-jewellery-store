import { NAV_LINKS } from '../data/navigation';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

/* Shown as information, not links: these pages and channels don't exist for a concept brand. */
const CUSTOMER_CARE = ['Shipping & delivery', 'Returns & exchanges', 'Ring size guide', 'Contact us'];

/* Lucide no longer ships brand logos, so simple outline marks are drawn here. */
const SOCIALS = [
  {
    name: 'Instagram',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'Pinterest',
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10.5 20.5 12 14m0 0c.6.9 1.6 1.3 2.6 1.1 2-.4 3.1-2.4 2.8-4.6-.4-2.6-2.8-4-5.4-3.6-2.9.4-4.5 2.9-3.9 5.3" />
      </>
    ),
  },
  {
    name: 'YouTube',
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9.5 4.5 2.5-4.5 2.5z" fill="currentColor" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <p className="footer__wordmark">Aurelle</p>
          <p className="footer__tagline">
            Fine jewellery for everyday rituals and once-in-a-lifetime moments, designed in India.
          </p>
          <div className="footer__socials">
            <p className="footer__concept-note">Social channels (not live for this concept brand)</p>
            <ul aria-label="Social channels, not live">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {social.path}
                  </svg>
                  <span>{social.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className="footer__column" aria-labelledby="footer-explore">
          <h2 id="footer-explore">Explore</h2>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__column">
          <h2 id="footer-care">Customer care</h2>
          <p className="footer__concept-note footer__concept-note--lead">
            Not available in this concept storefront. Listed to show the intended structure.
          </p>
          <ul aria-labelledby="footer-care" className="footer__info-list">
            {CUSTOMER_CARE.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© {CURRENT_YEAR} AURELLE. A fictional brand.</p>
        <p>AURELLE — Concept Storefront / Portfolio Project.</p>
      </div>
    </footer>
  );
}
