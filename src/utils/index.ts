// Re-export all utility functions
export { formatDate } from './date';

/**
 * Utility function to check if a path is active
 */
export function isActivePath(currentPath: string, href: string): boolean {
  return currentPath === href || (href !== '/' && currentPath.startsWith(href));
}

/**
 * Utility function to get the current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
