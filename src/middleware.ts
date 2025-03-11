import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';

/**
 * Next.js Internationalization Middleware
 * 
 * This middleware handles locale detection and routing for the application.
 * It ensures URLs are properly formatted with locale prefixes when needed.
 */
export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Only add locale prefix when needed (not for default locale)
  localePrefix: 'as-needed',
  
  // Disable automatic locale detection from cookies, making URL the source of truth
  localeDetection: false
});

/**
 * Middleware configuration
 * 
 * This tells Next.js which routes should be processed by this middleware.
 * We're processing all routes except API routes, Next.js internal routes, and static files.
 */
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
