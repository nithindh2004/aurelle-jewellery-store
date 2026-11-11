/**
 * Product catalogue for the AURELLE concept storefront.
 *
 * All product names, specifications and prices are fictional and illustrative.
 * Gold pieces carry `pricing` inputs (purity, metal weight, assumed making-charge
 * rate, assumed stone value); their displayed price is calculated from those
 * inputs in utils/pricing.js. Pieces whose value is not mainly gold (pearls,
 * silver) carry a stated `catalogPrice` instead.
 *
 * Photography: Unsplash (Unsplash License). `image` is the Unsplash photo id;
 * credits are in src/data/imageCredits.js. `focus` is an optional focal-point
 * crop (x, y as 0–1 fractions of the photo, zoom ≥ 1) used when the jewellery
 * is small within the original frame. See utils/image.js.
 */
import { resolvePrice } from '../utils/pricing.js';

export const CATEGORIES = ['Rings', 'Earrings', 'Necklaces', 'Bracelets'];

/** Indian ring sizes offered for sized rings. */
const RING_SIZES = ['10', '11', '12', '13', '14', '15', '16'];
/** Bangle sizes in inches (Indian sizing convention). */
const BANGLE_SIZES = ['2.4', '2.6', '2.8'];

const catalogue = [
  {
    id: 'solene-halo-ring',
    name: 'Solene Halo Diamond Ring',
    category: 'Rings',
    badge: 'Bestseller',
    image: 'photo-1605100804763-247f67b3557e',
    alt: 'Diamond ring with a rose gold halo and pavé split shank, resting on a black box',
    description: 'A round brilliant centre stone ringed by a rose gold halo, set on a pavé split shank.',
    material: '18K rose and white gold',
    pricing: { purity: '18K', metalWeightGrams: 3.8, makingChargeRate: 0.2, stoneValue: 42000 },
    details: [
      ['Metal', '18K rose and white gold'],
      ['Stones', 'Diamonds, 0.42 ct total, SI-IJ'],
      ['Approx. weight', '3.8 g'],
    ],
    sizes: RING_SIZES,
    sizeLabel: 'Ring size',
  },
  {
    id: 'meera-sapphire-ring',
    name: 'Meera Sapphire Ring',
    category: 'Rings',
    badge: 'New Arrival',
    image: 'photo-1586104237516-5b7075e00d45',
    alt: 'White gold ring with an oval blue sapphire surrounded by small diamonds',
    description: 'An oval blue sapphire framed in a fine diamond border, for evenings that call for colour.',
    material: '18K white gold',
    pricing: { purity: '18K', metalWeightGrams: 4.1, makingChargeRate: 0.2, stoneValue: 30000 },
    details: [
      ['Metal', '18K white gold'],
      ['Stones', 'Oval blue sapphire, diamond accents'],
      ['Approx. weight', '4.1 g'],
    ],
    sizes: RING_SIZES,
    sizeLabel: 'Ring size',
  },
  {
    id: 'vanya-emerald-ring',
    name: 'Vanya Emerald Ring',
    category: 'Rings',
    image: 'photo-1623449567043-e0cad8ee793a',
    focus: { x: 0.5, y: 0.45, zoom: 1.6 },
    alt: 'Two-tone gold bypass ring holding a square-cut green emerald',
    description: 'A square-cut emerald held between the sweeping ends of a two-tone gold bypass band.',
    material: '18K yellow and white gold',
    pricing: { purity: '18K', metalWeightGrams: 4.6, makingChargeRate: 0.18, stoneValue: 18000 },
    details: [
      ['Metal', '18K yellow and white gold'],
      ['Stones', 'Square-cut emerald, approx. 0.6 ct'],
      ['Approx. weight', '4.6 g'],
    ],
    sizes: RING_SIZES,
    sizeLabel: 'Ring size',
  },
  {
    id: 'noor-diamond-hoops',
    name: 'Noor Diamond Hoops',
    category: 'Earrings',
    badge: 'Bestseller',
    image: 'photo-1777999745582-781ebbd8c7b9',
    focus: { x: 0.55, y: 0.55, zoom: 1.6 },
    alt: 'Pair of gold huggie hoop earrings set with baguette diamonds, on white satin',
    description: 'Slim huggie hoops lined with baguette-cut diamonds that catch the light from every angle.',
    material: '18K yellow gold',
    pricing: { purity: '18K', metalWeightGrams: 3.1, makingChargeRate: 0.2, stoneValue: 34000 },
    details: [
      ['Metal', '18K yellow gold'],
      ['Stones', 'Baguette diamonds, 0.36 ct total'],
      ['Approx. weight', '3.1 g (pair)'],
      ['Closure', 'Hinged snap'],
    ],
  },
  {
    id: 'tara-solitaire-studs',
    name: 'Tara Solitaire Studs',
    category: 'Earrings',
    image: 'photo-1787520309842-6a8e4b7cdd7f',
    alt: 'Two gold stud earrings with round diamonds on a textured stone surface',
    description: 'Round diamonds in a classic four-prong setting. The pair you reach for every day.',
    material: '18K yellow gold',
    pricing: { purity: '18K', metalWeightGrams: 1.4, makingChargeRate: 0.18, stoneValue: 30000 },
    details: [
      ['Metal', '18K yellow gold'],
      ['Stones', 'Round diamonds, 0.30 ct total'],
      ['Approx. weight', '1.4 g (pair)'],
      ['Closure', 'Screw back'],
    ],
  },
  {
    id: 'neela-topaz-drops',
    name: 'Neela Topaz Drops',
    category: 'Earrings',
    badge: 'New Arrival',
    image: 'photo-1535632066927-ab7c9ab60908',
    alt: 'Pair of silver drop earrings with blue gemstones, on a green leaf',
    description: 'Deep blue stones on polished silver drops, light enough to wear from desk to dinner.',
    material: '925 sterling silver',
    catalogPrice: 8950,
    details: [
      ['Metal', '925 sterling silver, rhodium finish'],
      ['Stones', 'London blue topaz'],
      ['Closure', 'Hook'],
    ],
  },
  {
    id: 'moti-pearl-strand',
    name: 'Moti Pearl Strand',
    category: 'Necklaces',
    image: 'photo-1515562141207-7a88fb7ce338',
    alt: 'White pearl necklace arranged in its jewellery box',
    description: 'Hand-knotted freshwater pearls with a gold clasp. Quietly elegant, never out of place.',
    material: 'Freshwater pearls, 18K gold clasp',
    catalogPrice: 24500,
    details: [
      ['Pearls', 'Freshwater, 6–6.5 mm'],
      ['Clasp', '18K yellow gold'],
      ['Length', '18 inches'],
    ],
  },
  {
    id: 'rosa-floral-pendant',
    name: 'Rosa Floral Pendant',
    category: 'Necklaces',
    badge: 'New Arrival',
    image: 'photo-1763256614589-199db7a3bd51',
    focus: { x: 0.5, y: 0.5, zoom: 2 },
    alt: 'Gold pendant with a carved white flower at its centre, on a fine chain against red fabric',
    description: 'A carved mother-of-pearl flower framed in polished rose gold, on a fine box chain.',
    material: '18K rose gold',
    pricing: { purity: '18K', metalWeightGrams: 2.3, makingChargeRate: 0.18, stoneValue: 3000 },
    details: [
      ['Metal', '18K rose gold'],
      ['Inlay', 'Carved mother-of-pearl'],
      ['Approx. weight', '2.3 g with chain'],
      ['Chain length', '16 + 2 inches'],
    ],
  },
  {
    id: 'rani-heritage-pendant',
    name: 'Rani Heritage Pendant',
    category: 'Necklaces',
    image: 'photo-1773612968627-d1dd72e9d8be',
    focus: { x: 0.48, y: 0.55, zoom: 1.25 },
    alt: 'Antique-finish gold medallion pendant with granulated rings around a green cabochon, on grey fur',
    description: 'An heirloom-inspired medallion with fine granulated work around a green cabochon.',
    material: '22K yellow gold',
    pricing: { purity: '22K', metalWeightGrams: 11.6, makingChargeRate: 0.2, stoneValue: 4000 },
    details: [
      ['Metal', '22K yellow gold with oxidised detailing'],
      ['Stones', 'Green cabochon'],
      ['Approx. weight', '11.6 g'],
      ['Chain length', '18 inches'],
    ],
  },
  {
    id: 'lumen-chain-bracelet',
    name: 'Lumen Chain Bracelet',
    category: 'Bracelets',
    badge: 'Bestseller',
    image: 'photo-1602173574767-37ac01994b2a',
    alt: 'Gold chain bracelet lying on the pages of a magazine',
    description: 'A polished link chain with an adjustable clasp. Simple, bright and endlessly wearable.',
    material: '18K yellow gold',
    pricing: { purity: '18K', metalWeightGrams: 3.4, makingChargeRate: 0.15 },
    details: [
      ['Metal', '18K yellow gold'],
      ['Approx. weight', '3.4 g'],
      ['Length', 'Adjustable, 6.5–7.5 inches'],
    ],
  },
  {
    id: 'kiara-charm-trio',
    name: 'Kiara Charm Bracelet Trio',
    category: 'Bracelets',
    image: 'photo-1778000000743-87e855360c51',
    alt: 'Three delicate gold bracelets with small charms on a white background',
    description: 'Three fine chains with tiny charms, designed to stack or to share with the people you love.',
    material: '18K yellow gold',
    pricing: { purity: '18K', metalWeightGrams: 4.2, makingChargeRate: 0.18 },
    details: [
      ['Metal', '18K yellow gold'],
      ['Set', 'Three bracelets'],
      ['Approx. weight', '4.2 g (set)'],
      ['Length', 'Adjustable, 6–7 inches'],
    ],
  },
  {
    id: 'aarohi-carved-bangle',
    name: 'Aarohi Carved Bangle Set',
    category: 'Bracelets',
    image: 'photo-1758995116383-f51775896add',
    alt: 'Stack of ornate carved gold bangles on a dark surface',
    description: 'Hand-engraved bangles with traditional motifs, made to be stacked for the occasions that matter.',
    material: '22K yellow gold',
    pricing: { purity: '22K', metalWeightGrams: 14.2, makingChargeRate: 0.25 },
    details: [
      ['Metal', '22K yellow gold'],
      ['Finish', 'Hand-engraved, stackable set'],
      ['Approx. weight', '14.2 g (set)'],
    ],
    sizes: BANGLE_SIZES,
    sizeLabel: 'Bangle size (in)',
  },
];

/** The catalogue with each displayed price resolved once, so card, quick view and cart always agree. */
export const products = catalogue.map((product) => ({ ...product, price: resolvePrice(product) }));

/** Category cards. Each uses a photograph no product uses; it is decorative (the card's text names it). */
export const categoryCards = [
  { name: 'Rings', image: 'photo-1543294001-f7cd5d7fb516' },
  { name: 'Earrings', image: 'photo-1617038220319-276d3cfab638', focus: { x: 0.45, y: 0.63, zoom: 1.8 } },
  { name: 'Necklaces', image: 'photo-1611107683227-e9060eccd846' },
  { name: 'Bracelets', image: 'photo-1777817117657-d2fa6aacef06' },
];

export const lifestyleImages = {
  hero: {
    image: 'photo-1585960622850-ed33c41d6418',
    alt: 'Woman in a white top wearing a fine gold necklace',
  },
  editorial: {
    image: 'photo-1772442125263-c9dd28bbd938',
    alt: 'A jeweller holding up a ring to examine it at her workbench',
  },
};

export const productById = new Map(products.map((p) => [p.id, p]));
