export type NavLink = {
  label: string;
  href: string;
};

export const homeHref = '/';

export const navLinks: NavLink[] = [
  { label: 'What Is ThriveOne?', href: '/what-is-thriveone' },
  { label: 'Online Store', href: '/' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];
