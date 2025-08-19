// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Kool Codez';
export const SITE_DESCRIPTION = 'Creative coding solutions with a cool edge. Building innovative web experiences that stand out.';
export const SITE_AUTHOR = 'Kool Codez';
export const SITE_URL = 'https://koolcodez.com';

type TNavLink = {
	href: string;
	name: string;
}

export const NAVBAR_LINKS: TNavLink[] = [
	{ href: '/', name: 'Home' },
	{ href: '/blog', name: 'Blog' },
	{ href: '/contacts', name: 'Contacts' }
];
