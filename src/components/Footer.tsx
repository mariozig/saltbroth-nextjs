/**
 * Footer Component
 * 
 * Reusable footer for the application with links to important pages.
 */

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Footer component for displaying site-wide footer with navigation links
 * 
 * @returns {JSX.Element} The rendered footer component
 */
export default function Footer() {
  const common = useTranslations('common');
  const footer = useTranslations('common.footer');
  const locale = useLocale();

  return (
    <footer className="bg-black/30 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="divider mb-8"></div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold gradient-text">{common('appName')}</h2>
          </div>
          <div className="flex space-x-8">
            <Link href={getLocalizedHref('/about', locale)} className="text-gray-400 hover:text-white">{footer('about')}</Link>
            <Link href={getLocalizedHref('/contact', locale)} className="text-gray-400 hover:text-white">{footer('contact')}</Link>
            <Link href={getLocalizedHref('/terms', locale)} className="text-gray-400 hover:text-white">{footer('terms')}</Link>
            <Link href={getLocalizedHref('/privacy', locale)} className="text-gray-400 hover:text-white">{footer('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
