export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric' 
	});
}

export function isActivePath(currentPath: string, href: string): boolean {
  return currentPath === href || (href !== '/' && currentPath.startsWith(href));
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}
