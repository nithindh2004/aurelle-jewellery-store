# Manual browser QA checklist

The automated tests (`npm test`) cover the pure logic: cart sanitisation, filtering, search, sorting, pricing and the image audit. Interactions in a real browser were checked during development with a Playwright script that is **not** part of this repository. Use this list to repeat those checks by hand in about 15 minutes.

Run `npm run dev`, open http://localhost:5173, and use Chrome or Edge DevTools' device toolbar (Ctrl+Shift+M) for the viewport sizes.

## Navigation
- [ ] Header links Home, Jewellery, Collections and About each scroll to their section.
- [ ] The search icon scrolls to the catalogue and puts the cursor in the search field.
- [ ] At 390 px wide: the menu button opens the menu; a link closes it and scrolls; Escape closes it.
- [ ] At 320 px wide: the wordmark never touches the search, wishlist or cart icons.

## Catalogue
- [ ] Each category chip shows exactly three products; **All** shows twelve.
- [ ] Clicking a category card filters the catalogue and highlights the matching chip.
- [ ] Search "Tara" (name), "sterling silver" (material), "emerald" (stone) and "rose gold" (two words).
- [ ] Search "platinum": the empty state appears, and **Clear filters** restores all twelve.
- [ ] Price: low to high, and Price: high to low, sort correctly.

## Quick view
- [ ] Opens by clicking a product photo or name, and with the keyboard (Tab to the name, then Enter).
- [ ] Closes with the × button, with Escape, and by clicking the dark backdrop; focus returns to the product.
- [ ] Tab and Shift+Tab never leave the open quick view.
- [ ] **Choose size** on a ring, then **Add to cart** without a size: an error appears and nothing is added.
- [ ] Ring sizes 10–16 and bangle sizes 2.4–2.8 can be selected; the quantity goes from 1 to 10.

## Cart
- [ ] Adding the same piece twice gives one line with quantity 2.
- [ ] The same ring in sizes 12 and 14 gives two separate lines.
- [ ] + and − change quantity; − stops at 1 and + stops at 10.
- [ ] Remove works, and keyboard focus moves to the next line (or to **Browse jewellery** when empty).
- [ ] Below ₹25,000, shipping is ₹499 and the bar shows how much is left; from ₹25,000 shipping is Free.
- [ ] Subtotal and total add up (check one by hand).
- [ ] **Checkout** shows the concept-storefront notice; nothing claims an order was placed.
- [ ] Refresh the page: the cart is still there.

## Wishlist
- [ ] The heart toggles a piece on and off, and the header count updates.
- [ ] In the wishlist drawer: **Add to cart** works for earrings; **Choose size** on a ring opens the size selector.
- [ ] Refresh: the wishlist is still there.

## Newsletter
- [ ] Empty field → "Enter your email address…"; `reader@example` → "Check the email address…".
- [ ] `reader@example.com` → "Email format validated. This is a demonstration form; no subscription has been created."

## Accessibility and robustness
- [ ] The first Tab shows the "Skip to the collection" link; a visible focus ring follows every Tab.
- [ ] With Windows "Show animations" turned off (or DevTools → Rendering → prefers-reduced-motion: reduce), nothing animates.
- [ ] DevTools → Application → Local Storage: set `aurelle:cart` to `{broken` and refresh; the page still loads with an empty cart.
- [ ] DevTools Console shows no errors or React warnings.
- [ ] No sideways scrolling at 1440, 1366, 1024, 768, 390 and 320 px wide.
