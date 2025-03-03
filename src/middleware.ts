import createMiddleware from 'next-intl/middleware';

// Available locales
export const locales = ['en', 'es'];

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // Locales are considered similar (for example different regions
  // of the same language). This is used to match a non-preferred locale
  // to a preferred one.
  localePrefix: 'as-needed'
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 