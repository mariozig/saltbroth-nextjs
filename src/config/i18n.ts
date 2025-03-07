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
 * Display names for each supported locale
 */
export const localeDisplayNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

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
