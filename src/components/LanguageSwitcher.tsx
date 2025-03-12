import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales } from '@/config/i18n';
import { useTranslations } from 'next-intl';

/**
 * LanguageSwitcher Component
 * 
 * A CSS-only dropdown component that allows users to switch between available languages.
 * Uses standard hyperlinks for better SEO and crawlability.
 * 
 * Benefits:
 * - Fully server-rendered (no 'use client' directive)
 * - Mobile-friendly with focus-within support
 * - Improved SEO with proper language alternates
 * - Works without JavaScript
 * - Crawlable by search engines
 * - Supports static site generation
 * - Uses localized language names from dictionaries
 * - Uses localized flag emojis and short codes from dictionaries
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  
  // Get localized display names, flags, and short codes from the dictionary
  const t = useTranslations('locales');

  // Get the current path without the locale prefix
  const currentPath = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');

  return (
    <div className="relative group focus-within:outline-none">
      {/* Dropdown Toggle - Works with both hover and focus */}
      <button 
        className="flex items-center space-x-1 text-gray-300 hover:text-white focus:text-white focus:outline-none"
        aria-haspopup="true"
      >
        <span aria-hidden="true">{t(`flags.${locale}`)}</span>
        <span>{t(`shortCodes.${locale}`)}</span>
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {/* 
        Dropdown Menu - Hidden by default, visible on hover or focus-within
        - Uses longer transitions (duration-300) for smoother animations
        - Adds scale transform for more polished effect
        - Works with both mouse hover and touch (via focus-within)
      */}
      <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 
        transform origin-top-right scale-95
        opacity-0 invisible 
        transition-all duration-300 ease-in-out
        group-hover:opacity-100 group-hover:visible group-hover:scale-100
        group-focus-within:opacity-100 group-focus-within:visible group-focus-within:scale-100">
        <div className="py-1" role="menu" aria-orientation="vertical">
          {locales.map((localeOption) => (
            <Link
              key={localeOption}
              href={`/${localeOption}${currentPath}`}
              className={`block px-4 py-2 text-sm w-full text-left ${
                locale === localeOption 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white'
              }`}
              role="menuitem"
              hrefLang={localeOption}
              locale={localeOption}
            >
              <span className="flex items-center">
                <span className="mr-2" aria-hidden="true">{t(`flags.${localeOption}`)}</span> {t(localeOption)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}