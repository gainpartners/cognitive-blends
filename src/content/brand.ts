export const brand = {
  name: 'Cognitive Blends',
  line: 'Formulas For Modern Living',
  place: 'West of Ireland',
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
  { name: 'Paper', token: '--bg', hex: '#FAFAF9', use: 'Page background' },
  { name: 'Raised', token: '--bg-raised', hex: '#FFFFFF', use: 'Cards, header' },
  { name: 'Ink', token: '--ink', hex: '#121212', use: 'Body text, prices' },
  { name: 'Soft', token: '--ink-soft', hex: '#6B7280', use: 'Secondary copy' },
  { name: 'Teal', token: '--accent', hex: '#108474', use: 'Primary CTAs' },
  { name: 'Gold', token: '--gold', hex: '#FFB200', use: 'Stars, highlights' },
  { name: 'Gold ink', token: '--gold-ink', hex: '#533C0A', use: 'Rating labels' },
  { name: 'Line', token: '--line', hex: '#E5E7EB', use: 'Borders' },
  { name: 'Error', token: '--error', hex: '#B42318', use: 'Form errors' },
] as const;

export const typeScale = [
  { name: 'Display', spec: 'EB Garamond 500 · clamp 2–2.75rem', sample: 'ThriveOne' },
  { name: 'Heading', spec: 'EB Garamond 500 · 1.5rem', sample: 'Subscribe and save' },
  { name: 'Body', spec: 'Assistant 400 · 16px · 1.55', sample: 'Proudly produced in the West of Ireland.' },
  { name: 'UI', spec: 'Assistant 600 · 15px', sample: 'Add to cart' },
] as const;

export const spacing = [
  { token: '--space-2', px: 8, use: 'Tight gaps' },
  { token: '--space-4', px: 16, use: 'Card padding' },
  { token: '--space-5', px: 24, use: 'Section gaps' },
  { token: '--space-7', px: 48, use: 'Page title offset' },
  { token: '--space-8', px: 64, use: 'Footer / section padding' },
] as const;
