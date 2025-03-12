/**
 * Internationalization Configuration
 * 
 * This file centralizes all locale-related configuration to provide a single
 * source of truth for supported languages and locale settings throughout the app.
 */

/**
 * All locales supported by the application
 */
export const locales = ['en', 'es'] as const;

/**
 * Type representing valid locale strings
 */
export type Locale = typeof locales[number];

/**
 * The default locale for the application
 */
export const defaultLocale: Locale = 'en';

/**
 * Get locale display names from dictionaries
 * 
 * This function dynamically imports the dictionary for the specified locale
 * and returns the localized display names for all supported locales.
 * 
 * @param locale - The locale to use for display names
 * @returns A promise resolving to a record mapping locale codes to their display names
 */
export async function getLocaleDisplayNames(locale: Locale = defaultLocale): Promise<Record<Locale, string>> {
  try {
    // Import the dictionary for the specified locale
    const dictionary = await import(`../dictionaries/${locale}.json`);
    return dictionary.default.locales;
  } catch (error) {
    // Fallback to default display names if dictionary import fails
    console.error(`Failed to load locale display names for ${locale}:`, error);
    return {
      en: 'English',
      es: 'Español',
    };
  }
}

/**
 * Check if a locale string is valid
 * @param locale - Locale string to check
 * @returns True if the locale is supported, false otherwise
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get locale parameters for static site generation
 * @returns Array of locale parameters for generateStaticParams
 */
export function getLocaleParams() {
  return locales.map(locale => ({ locale }));
}

/**
 * Get locale alternates for metadata
 * @param pathname - Base pathname without locale prefix
 * @returns Record of locale alternates for metadata
 */
export function getLocaleAlternates(pathname: string = '') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  
  return locales.reduce((acc, locale) => {
    acc[locale] = locale === defaultLocale ? path : `/${locale}${path}`;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Build a localized URL for a given path and locale
 * @param path - The path (without locale prefix)
 * @param locale - The target locale
 * @param baseUrl - Optional base URL (for absolute URLs)
 * @returns Properly formatted URL with locale prefix as needed
 */
export function getLocalizedUrl(path: string, locale: Locale, baseUrl?: string) {
  // Normalize path to always start with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Add locale prefix if not the default locale
  const localePath = locale === defaultLocale ? normalizedPath : `/${locale}${normalizedPath}`;
  
  // Add base URL if provided, otherwise return relative path
  return baseUrl ? `${baseUrl}${localePath}` : localePath;
}

/**
 * Generate localized URLs for all supported locales
 * @param path - The path (without locale prefix)
 * @param baseUrl - Optional base URL (for absolute URLs)
 * @returns Record mapping locale codes to their respective URLs
 */
export function getAllLocalizedUrls(path: string, baseUrl?: string) {
  return locales.reduce((acc, locale) => {
    acc[locale] = getLocalizedUrl(path, locale, baseUrl);
    return acc;
  }, {} as Record<string, string>);
}
