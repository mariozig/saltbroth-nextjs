import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Locales are considered similar (for example different regions
  // of the same language). This is used to match a non-preferred locale
  // to a preferred one.
  localePrefix: 'as-needed',
  
  // Disable automatic locale detection from cookies, making URL the source of truth
  localeDetection: false
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 