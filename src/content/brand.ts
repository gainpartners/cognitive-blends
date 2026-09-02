export const brand = {
  name: 'Cognitive Blends',
  line: 'Formulas For Modern Living',
  place: 'West of Ireland',
  logo: {
    wordmark: '/brand/logo-wordmark.png',
    mark: '/brand/logo-mark.png',
  },
  narrative:
    'Cognitive Blends makes science-backed supplements in the West of Ireland. ThriveOne is the flagship: five ingredients chosen to work together for sleep, energy, focus, and hormonal balance.',
  voice: [
    {
      bad: 'Unlock your peak masculine potential with our revolutionary biohacking stack!!!',
      good: 'Five researched ingredients, one daily dose. Made in the West of Ireland.',
    },
    {
      bad: 'Seamlessly elevate your wellness journey with premium botanicals.',
      good: 'Ashwagandha KSM-66, maca, magnesium, vitamin D3, and zinc. Take three capsules a day.',
    },
  ],
};

export const colours = [
  { name: 'Charcoal', token: '--bg', hex: '#252525', use: 'Page, header, footer' },
  { name: 'Raised', token: '--bg-raised', hex: '#FFFFFF', use: 'Product cards' },
  { name: 'Ink', token: '--ink', hex: '#FFFFFF', use: 'Text on charcoal' },
  { name: 'Ink dark', token: '--ink-dark', hex: '#121212', use: 'Text on sand and cards' },
  { name: 'Sand', token: '--sand', hex: '#C9B288', use: 'Headings, marketing CTAs' },
  { name: 'Teal', token: '--accent', hex: '#00A29B', use: 'Shop buttons, subscribe price' },
  { name: 'Judge.me', token: '--accent-judge', hex: '#108474', use: 'Review widget only' },
  { name: 'Mute', token: '--ink-mute', hex: '#6D7175', use: 'Captions, roles' },
  { name: 'Error', token: '--error', hex: '#F87171', use: 'Form errors' },
] as const;

export const typeScale = [
  { name: 'Display', spec: 'EB Garamond 400 · clamp 2–3.75rem', sample: 'Formulas For Modern Living' },
  { name: 'Heading', spec: 'EB Garamond 400 · clamp 1.6–2.875rem · sand', sample: 'Reach Your Next Level With ThriveOne' },
  { name: 'Body', spec: 'Assistant 400 · 16px · 1.6 · 0.04em', sample: 'Proudly produced in the West of Ireland.' },
  { name: 'UI', spec: 'Assistant 400 · 16px · square buttons', sample: 'Shop now' },
] as const;

export const spacing = [
  { token: '--space-1', px: 4, use: 'Icon gaps' },
  { token: '--space-2', px: 8, use: 'Tight gaps, badge padding' },
  { token: '--space-3', px: 12, use: 'Label to field' },
  { token: '--space-4', px: 16, use: 'Hero mobile heading gap' },
  { token: '--space-5', px: 20, use: 'Card padding, product grid' },
  { token: '--space-6', px: 32, use: 'Block gaps' },
  { token: '--space-7', px: 40, use: 'Section padding (mobile)' },
  { token: '--space-8', px: 60, use: 'Section padding (desktop)' },
] as const;

export const contrastPairs = [
  {
    fg: 'Ink',
    bg: 'Charcoal',
    ratio: '12.6:1',
    badge: 'AAA',
    fgHex: '#FFFFFF',
    bgHex: '#252525',
    note: 'Primary body on the shop',
  },
  {
    fg: 'Sand',
    bg: 'Charcoal',
    ratio: '7.4:1',
    badge: 'AAA',
    fgHex: '#C9B288',
    bgHex: '#252525',
    note: 'Headings only, not small UI',
  },
  {
    fg: 'Ink dark',
    bg: 'Sand',
    ratio: '8.1:1',
    badge: 'AAA',
    fgHex: '#121212',
    bgHex: '#C9B288',
    note: 'Marketing buttons',
  },
  {
    fg: 'Ink dark',
    bg: 'Raised',
    ratio: '16.1:1',
    badge: 'AAA',
    fgHex: '#121212',
    bgHex: '#FFFFFF',
    note: 'Product cards',
  },
  {
    fg: 'Teal',
    bg: 'Charcoal',
    ratio: '5.2:1',
    badge: 'AA',
    fgHex: '#00A29B',
    bgHex: '#252525',
    note: 'Shop actions and subscribe price',
  },
  {
    fg: 'Mute',
    bg: 'Raised',
    ratio: '4.6:1',
    badge: 'AA',
    fgHex: '#6D7175',
    bgHex: '#FFFFFF',
    note: 'Captions 14px+. Not body text',
  },
] as const;

export const pages = [
  {
    page: 'Home',
    url: '/',
    desc: 'Hero video → catalogue → signup → ThriveOne features → quotes → stats → Who We Are.',
  },
  {
    page: 'What Is ThriveOne?',
    url: '/what-is-thriveone',
    desc: 'Benefits, audience, ingredients. Purchase CTAs are the same Button atoms as home.',
  },
  {
    page: 'Online Store',
    url: '/collections/frontpage',
    desc: 'Best sellers. CatalogSection + ProductCard. Prices from Shopify Markets.',
  },
  {
    page: 'Product',
    url: '/products/thriveone',
    desc: 'MediaImage, PurchaseForm (Appstle plans only), accordion, Judge.me reviews.',
  },
  {
    page: 'Our Story',
    url: '/our-story',
    desc: 'Founders. Copy stays verbatim, including Cogntive Blends.',
  },
  {
    page: 'Contact',
    url: '/contact',
    desc: 'ContactForm posts to Shopify contact. Fields persist on error.',
  },
  {
    page: 'Cart / Search / Account',
    url: '/cart',
    desc: 'Cart is Shopify checkoutUrl. Search uses Storefront predictive search. Account is hosted Shopify, not a custom portal.',
  },
] as const;

export const motionRules = [
  {
    name: 'Reveal',
    use: 'Off-screen sections only. In-view nodes stay put after SSR. One-shot IntersectionObserver.',
  },
  {
    name: 'Hover lift',
    use: 'Buttons translateY(-0.25rem). Product cards lift 4px and zoom the image inside a clipped frame.',
  },
  {
    name: 'Ambient',
    use: 'Who We Are slide images scale 1 → 1.06 over 30s. Never on product photography.',
  },
  {
    name: 'Reduced motion',
    use: 'No reveal, no ambient, no lift. Content is visible immediately.',
  },
] as const;
