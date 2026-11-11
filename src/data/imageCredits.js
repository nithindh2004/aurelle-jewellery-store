/**
 * Photo credits and verification record for every image the storefront uses.
 *
 * All photos are from Unsplash under the Unsplash License
 * (https://unsplash.com/license). Each photo page below was opened on
 * 2026-11-12 and checked: its og:image is the same photo id, served from
 * images.unsplash.com (not plus.unsplash.com), and the page is titled
 * "Free Photo on Unsplash" (Unsplash+ photos are not free). Contributors are
 * listed by their Unsplash profile handle, exactly as linked on the page.
 *
 * `visualCheck` records that the photo was looked at and judged to match its
 * product or section. It is not a guarantee: re-check after any change with
 * `npm run check:images`. People shown in photos do not endorse AURELLE.
 */
const CHECKED = '2026-11-12';

const entry = (image, usedFor, slug, handle) => ({
  image,
  usedFor,
  page: `https://unsplash.com/photos/${slug}`,
  contributor: `@${handle}`,
  profile: `https://unsplash.com/@${handle}`,
  licence: 'Unsplash License',
  pageChecked: CHECKED,
  visualCheck: CHECKED,
});

export const imageCredits = [
  entry('photo-1585960622850-ed33c41d6418', 'Hero', 'woman-in-white-v-neck-shirt-wearing-gold-necklace--GhLgB-oXNw', 'saeedanahid'),
  entry('photo-1772442125263-c9dd28bbd938', 'Editorial section', 'a-woman-examining-jewelry-at-a-workbench-e7KQ0yocfRE', 'gnhearingglobal'),
  entry('photo-1543294001-f7cd5d7fb516', 'Category: Rings', 'three-gold-colored-studded-rings-zZLhoEwGCeM', 'corneliang'),
  entry('photo-1617038220319-276d3cfab638', 'Category: Earrings', 'gold-twisted-hoop-earrings-on-stones-5ngCICAXiH0', 'natinati'),
  entry('photo-1611107683227-e9060eccd846', 'Category: Necklaces', 'gold-chain-necklace-on-white-surface-aldDZePniqg', 'sfhashemi'),
  entry('photo-1777817117657-d2fa6aacef06', 'Category: Bracelets', 'womans-arms-adorned-with-two-stylish-bracelets-aqvjVg1b50Y', 'seljansalim'),
  entry('photo-1605100804763-247f67b3557e', 'Solene Halo Diamond Ring', 'silver-diamond-ring-on-black-box-Y_bxfTa_iUA', 'sabrinnaringquist'),
  entry('photo-1586104237516-5b7075e00d45', 'Meera Sapphire Ring', 'silver-blue-and-green-stone-ring-mmCm6c2ru5A', 'sabrinnaringquist'),
  entry('photo-1623449567043-e0cad8ee793a', 'Vanya Emerald Ring', 'a-gold-ring-with-a-green-stone-sitting-on-a-table-mnMWMNP0soM', 'annabelle_worrall'),
  entry('photo-1777999745582-781ebbd8c7b9', 'Noor Diamond Hoops', 'gold-hoop-earrings-with-diamonds-on-white-satin-Jdc5_dKmhuk', 'disfruta_cafe'),
  entry('photo-1787520309842-6a8e4b7cdd7f', 'Tara Solitaire Studs', 'gold-diamond-stud-earrings-on-stone-8bJKF2famIk', 'prahantstudio'),
  entry('photo-1535632066927-ab7c9ab60908', 'Neela Topaz Drops', 'pair-of-silver-colored-earrings-with-blue-gemstone-VJZdxfvFGuo', 'arteum'),
  entry('photo-1515562141207-7a88fb7ce338', 'Moti Pearl Strand', 'white-pearl-necklace-with-box-2zHQhfEpisc', 'corneliang'),
  entry('photo-1763256614589-199db7a3bd51', 'Rosa Floral Pendant', 'rose-gold-necklace-with-a-clear-gemstone-pendant-IWQfmEC-OkY', 'aliisarvari'),
  entry('photo-1773612968627-d1dd72e9d8be', 'Rani Heritage Pendant', 'a-gold-pendant-with-a-green-gem-rests-on-fur-6Gx9qn10cvQ', 'raevolution'),
  entry('photo-1602173574767-37ac01994b2a', 'Lumen Chain Bracelet', 'a-gold-chain-bracelet-sitting-on-top-of-a-magazine-oO0JAOJhquk', 'natinati'),
  entry('photo-1778000000743-87e855360c51', 'Kiara Charm Bracelet Trio', 'three-delicate-gold-bracelets-with-charms-on-white-background-y7xmVsIXNUI', 'disfruta_cafe'),
  entry('photo-1758995116383-f51775896add', 'Aarohi Carved Bangle Set', 'a-stack-of-ornate-gold-bangles-on-a-dark-surface-wreS7kv_tLE', 'zayed_ahmed_zadu'),
];

export const creditByImage = new Map(imageCredits.map((c) => [c.image, c]));
