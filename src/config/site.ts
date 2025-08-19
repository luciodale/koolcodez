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
  description: 'Creative coding solutions with a cool edge. Building innovative web experiences that stand out.',
  author: 'Kool Codez',
  url: 'https://koolcodez.com',
  email: 'lucio.dalessa@gmail.com',
  social: {
    github: 'https://github.com/luciodale',
    linkedin: 'https://www.linkedin.com/in/lucio-d-alessandro-38639bb6/',
  },
  navigation: [
    { href: '/', name: 'Home' },
    { href: '/blog', name: 'Blog' },
    { href: '/contacts', name: 'Contacts' },
  ],
};
