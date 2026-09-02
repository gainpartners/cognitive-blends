export type NavLink = {
  label: string;
  href: string;
};

export const homeHref = '/';

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'What Is ThriveOne?', href: '/what-is-thriveone' },
  { label: 'Online Store', href: '/collections/frontpage' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];
