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
  const footer = useTranslations('footer');
  const locale = useLocale();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 py-12 md:py-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold gradient-text">{common('appName')}</h3>
            <p className="text-sm text-gray-400">{footer('tagline')}</p>
          </div>
          
          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80">{footer('resources.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={getLocalizedHref('/docs', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('resources.documentation')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/examples', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('resources.examples')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/tutorials', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('resources.tutorials')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80">{footer('company.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={getLocalizedHref('/about', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('company.about')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/blog', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('company.blog')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/contact', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('company.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white/80">{footer('legal.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href={getLocalizedHref('/privacy', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  href={getLocalizedHref('/terms', locale)} 
                  className="text-sm text-gray-400 hover:text-accent-100 transition-colors"
                >
                  {footer('legal.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section with Copyright and Social Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">&copy; {currentYear} {common('appName')}. {footer('copyright')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent-100 transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent-100 transition-colors" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
