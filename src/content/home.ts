export const hero = {
  title: 'Formulas For Modern Living',
  body: 'Our products are proudly made in the West of Ireland and are designed to promote quality sleep, balanced hormones and sustained energy so you can feel strong, focused and ready for anything.',
  video: '/brand/hero.mp4',
  poster: '/brand/thriveone-lifestyle.png',
  cta: {
    label: 'Shop now',
    href: '/',
  },
};

export const popularProducts = {
  heading: 'Most Popular Products',
};

export const thriveOneFeatures = {
  title: 'Reach Your Next Level With ThriveOne',
  intro:
    'Carefully crafted with premium ingredients to help you sleep, perform and recover at the maximum level.',
  image: '/brand/thriveone-lifestyle.png',
  blocks: [
    {
      title: 'Restorative Sleep',
      body: 'Ashwagandha and Magnesium help reduce stress levels and supports deeper, more restorative sleep so your body can properly recover overnight.',
    },
    {
      title: 'Elite Performance',
      body: 'Maca supports physical endurance, stamina and overall performance, helping you feel stronger throughout the day.',
    },
    {
      title: 'Sustained Energy',
      body: 'Vitamin D3 contributes to normal energy-yielding metabolism, supporting steady, balanced energy without spikes or crashes.',
    },
    {
      title: 'Focus & Clarity',
      body: 'Zinc supports normal cognitive function, helping maintain focus, clarity and mental sharpness when you need it most.',
    },
  ],
  purchaseCtas: [
    { label: 'Subscribe & Save 15%', href: '/products/thriveone' },
    { label: 'Buy It Once', href: '/products/thriveone' },
  ],
};

export const whoWeAre = {
  heading: 'Who We Are',
  people: [
    {
      name: 'Jack Carty',
      role: 'Founder',
      initial: 'J',
      image: '/brand/jack-carty.jpg',
      cta: { label: 'Learn More', href: '/our-story' },
    },
    {
      name: 'Dr Alan Farrell',
      role: 'Medical Advisor',
      initial: 'A',
      image: '/brand/alan-farrell.png',
      cta: { label: 'Learn More', href: '/our-story' },
    },
  ],
};

/** Do not render until Marcus/Hugh confirm these are real customer quotes. */
export const testimonials = {
  readyToPublish: false as const,
  quotes: [
    {
      name: 'Damien P.',
      body: 'I used to have to take a magnesium tablet, a zinc tablet, vit d, and a couple of others every morning. Thrive One covers most these with one convenient supplement.',
    },
    {
      name: 'Michael H.',
      body: 'I used to have to take a magnesium tablet, a zinc tablet, vit d, and a couple of others every morning. Thrive One covers these in one supplement.',
    },
    {
      name: 'Dylan C.',
      body: 'I am more focused at work and have the energy levels for gigs and training afterwards. Has also removed the mental fog and fatigue.',
    },
    {
      name: 'Chris W.',
      body: "I was looking for a boost in training and ThriveOne has certainly helped. I have more energy and endurance in the long runs or cycles - probably helped by the fact I'm sleeping better than ever!",
    },
  ],
  stats: [
    { value: '88%', label: 'very satisfied' },
    { value: '86%', label: 'would purchase again' },
    { value: '64%', label: 'saw lasting improvements' },
    { value: '4.7★', label: 'Average rating' },
  ],
};
