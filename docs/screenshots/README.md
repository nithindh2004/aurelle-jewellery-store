# Screenshots

These are genuine captures of the application, rendered from the production build (`npm run build`, then `npm run preview`) in headless Chromium on 2026-11-12.

| File | Viewport | View |
| --- | --- | --- |
| `desktop-home.jpg` | 1440 × 900 | Homepage hero |
| `categories.jpg` | 1440 × 900 | Shop by category |
| `desktop-catalogue.jpg` | 1440 × 900 | Product catalogue with filters, search and sorting |
| `quick-view.jpg` | 1440 × 900 | Quick view with ring size 13 selected |
| `cart-drawer.jpg` | 1440 × 900 | Cart drawer with three pieces and free shipping reached |
| `mobile-home.jpg` | 390 × 844 at 2× | Mobile homepage |
| `mobile-menu.jpg` | 390 × 844 at 2× | Mobile navigation open |

**About the photographs in these captures.** The capture environment could not reach Unsplash directly. So each photo was first fetched from `images.unsplash.com`, in a normal browser, at the exact URL and crop the app requests. Those image files were then served to the headless browser in place of its blocked requests. The layout, text, prices and interactions are the application's own; the photos are the real Unsplash images.

## Recapturing on Windows

1. `npm run dev`, then open http://localhost:5173 in Chrome or Edge.
2. Press F12, then Ctrl+Shift+M for the device toolbar, and set the viewport size from the table.
3. Prepare the view, then use DevTools' **⋮ → Capture screenshot**.
4. Save over the file with the same name, as JPEG or PNG. If you switch to PNG, update the file extensions in the main README.
