import { useEffect, useRef, useState } from 'react';
import './Newsletter.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Enter your email address, like name@example.com.';
  if (!EMAIL_PATTERN.test(email)) return 'Check the email address. It needs an @ and a domain, like name@example.com.';
  return null;
}

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const confirmationRef = useRef(null);
  const inputRef = useRef(null);
  const hasInteracted = useRef(false);

  // The submit button disappears when the confirmation replaces the form, so move
  // focus to the confirmation, and back to the input when the form returns.
  useEffect(() => {
    if (!hasInteracted.current) return;
    (validated ? confirmationRef : inputRef).current?.focus();
  }, [validated]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const problem = validateEmail(email);
    setError(problem);
    if (problem) return;
    // Frontend-only demonstration: the address is checked, then discarded.
    // Nothing is sent or stored, so the confirmation must not claim a subscription.
    hasInteracted.current = true;
    setValidated(true);
    setEmail('');
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter__inner container">
        <div className="newsletter__copy">
          <h2 id="newsletter-title">Hear about new pieces first</h2>
          <p>One considered email a month: new designs, care notes and early previews.</p>
        </div>

        {validated ? (
          <div className="newsletter__success" role="status" ref={confirmationRef} tabIndex={-1}>
            <p>Email format validated. This is a demonstration form; no subscription has been created.</p>
            <button type="button" className="text-link" onClick={() => setValidated(false)}>
              Check another email
            </button>
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="newsletter-email">Email address</label>
            <div className="newsletter__row">
              <input
                ref={inputRef}
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : 'newsletter-note'}
              />
              <button type="submit" className="btn">
                Subscribe
              </button>
            </div>
            {error ? (
              <p id="newsletter-error" className="newsletter__error" role="alert">
                {error}
              </p>
            ) : (
              <p id="newsletter-note" className="newsletter__note">
                Demonstration form: addresses are checked for format only, never stored or sent.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
