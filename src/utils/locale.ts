/**
 * Locale Utilities
 * 
 * Utility functions for handling localization and URL creation
 * with proper locale prefixing based on configuration.
 */

/**
 * Creates locale-aware URLs (no prefix for English as the default locale)
 * 
 * This helper ensures URL consistency throughout the application
 * by following the locale prefix pattern defined in the middleware.
 * 
 * @param {string} path - The path without locale prefix
 * @param {string} locale - The current locale
 * @returns {string} - The path with locale prefix if needed
 */
export function getLocalizedHref(path: string, locale: string): string {
  return locale === 'en' ? path : `/${locale}${path}`;
}
