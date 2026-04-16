export type SiteConfig = {
  title: string;
  description: string;
  author: string;
  url: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
  };
  navigation: Array<{
    href: string;
    name: string;
  }>;
};

export const siteConfig: SiteConfig = {
  title: 'Kool Codez',
  description: 'React libraries and TypeScript UI components by Lucio D\'Alessandro. Type safe WebSocket hooks, virtualized searchable dropdowns, gesture driven sidebars, and Clojure form tooling. Fast, polished, maintainable frontend engineering.',
  author: 'Lucio D\'Alessandro',
  url: 'https://koolcodez.com',
  email: 'lucio.dalessa@gmail.com',
  social: {
    github: 'https://github.com/luciodale',
    linkedin: 'https://www.linkedin.com/in/lucio-d-alessandro-38639bb6/',
  },
  navigation: [
    { href: '/', name: 'Home' },
    { href: '/projects', name: 'Projects' },
    { href: '/blog', name: 'Blog' },
    { href: '/contacts', name: 'Contacts' },
  ],
};
