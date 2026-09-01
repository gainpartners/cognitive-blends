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
  { token: '--space-2', px: 8, use: 'Tight gaps (Dawn desktop grid)' },
  { token: '--space-4', px: 16, use: 'Hero mobile heading gap' },
  { token: '--space-5', px: 20, use: 'Card padding, product grid' },
  { token: '--space-7', px: 40, use: 'Section padding (mobile)' },
  { token: '--space-8', px: 60, use: 'Section padding (desktop)' },
] as const;
