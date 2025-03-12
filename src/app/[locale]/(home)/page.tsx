/**
 * Home Page Component
 * 
 * This is the main landing page for SALTBROTH, located in the (home) route group.
 * 
 * Features:
 * - Dynamic category loading from MDX content
 * - Fallback data for error cases
 * - Internationalization support via next-intl
 * - Responsive design with Tailwind CSS
 * - Beautiful gradient effects and glass morphism UI
 */

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';
import Link from 'next/link';
import { getAllCategories, Category } from '@/lib/content';
import { use } from 'react';
import { Locale } from '@/config/i18n';

/**
 * Fetches categories with error handling and fallback data
 * @param locale - The current locale (e.g., 'en' or 'es')
 * @returns Promise<Category[]> - Array of category objects
 */
async function getCategories(locale: Locale): Promise<Category[]> {
  try {
    // Use the new MDX-based content loading system
    return await getAllCategories(locale);
  } catch (error) {
    console.error('Error fetching categories for homepage:', error);
    // Provide fallback data in case of error
    return [
      { 
        name: 'Creative Writing', 
        slug: 'creative-writing', 
        description: 'Prompts for creative writing and storytelling',
        icon: 'pen-nib',
        locale: locale,
        content: '',
        path: ['creative-writing']
      },
      { 
        name: 'Business Marketing', 
        slug: 'business-marketing', 
        description: 'Tools to improve your business marketing content',
        icon: 'bullhorn',
        locale: locale,
        content: '',
        path: ['business-marketing']
      },
      { 
        name: 'Professional', 
        slug: 'professional', 
        description: 'Professional communication templates',
        icon: 'briefcase',
        locale: locale,
        content: '',
        path: ['professional']
      }
    ];
  }
}

/**
 * Home Page Component
 * Renders the main landing page with:
 * -Intentionally does not include a navbar
 * - Hero section with gradient text and CTA
 * - Featured categories grid
 * - Elegant dividers and glass-morphism cards
 * - Footer component
 */
export default function Home() {
  const t = useTranslations('home');
  const common = useTranslations('common');
  const categoriesT = useTranslations('common.categories');
  const locale = useLocale();
  
  // Fetch categories data using React's use() hook for data fetching with error handling
  const categories = use(getCategories(locale as Locale));

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Title Section */}
        <header className="text-center mb-12">
          <h1 className="text-[clamp(3rem,15vw,12rem)] font-extrabold leading-none tracking-tight text-center gradient-text glow">
            {common('appName')}
          </h1>
        </header>

        {/* Hero Section */}
        <section className="px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-center">
              {t('hero.title')}
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12">
              {t('hero.subtitle')}
            </p>
            <div className="flex justify-center">
              <Link href={getLocalizedHref('/prompts_legacy', locale)} className="gradient-button inline-flex items-center px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 group relative shadow-lg shadow-accent-100/30 hover:shadow-accent-100/50">
                {t('hero.cta')}
                <i className="fas fa-arrow-right text-lg ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="w-full max-w-6xl mx-auto px-6 py-4">
          <div className="divider"></div>
        </div>

        {/* Categories Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text leading-tight pb-2">{t('featuredCategories.title')}</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t('featuredCategories.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Creative Writing */}
              <Link href={getLocalizedHref(`/categories/${categories.find((c: Category) => c.slug === 'creative-writing')?.slug || 'creative-writing'}`, locale)} 
                className="category-card glass rounded-3xl p-8 hover:bg-accent-100/5 cursor-pointer group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-100/10 flex items-center justify-center">
                    <i className={`fas fa-${categories.find((c: Category) => c.slug === 'creative-writing')?.icon || 'pen-nib'} text-2xl text-accent-100`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-100 transition-colors">{categoriesT('creative')}</h3>
                </div>
                <p className="text-gray-400 mb-6">{categoriesT('descriptions.creative')}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-100/30 mr-3"></span>
                    Short Stories
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-100/30 mr-3"></span>
                    Character Development
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-100/30 mr-3"></span>
                    Plot Generation
                  </div>
                </div>
              </Link>

              {/* Business Writing */}
              <Link href={getLocalizedHref(`/categories/${categories.find((c: Category) => c.slug === 'business-marketing')?.slug || 'business-marketing'}`, locale)} 
                className="category-card glass rounded-3xl p-8 hover:bg-accent-200/5 cursor-pointer group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-200/10 flex items-center justify-center">
                    <i className={`fas fa-${categories.find((c: Category) => c.slug === 'business-marketing')?.icon || 'bullhorn'} text-2xl text-accent-200`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-200 transition-colors">{categoriesT('business')}</h3>
                </div>
                <p className="text-gray-400 mb-6">{categoriesT('descriptions.business')}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-200/30 mr-3"></span>
                    Email Templates
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-200/30 mr-3"></span>
                    Proposals
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-200/30 mr-3"></span>
                    Reports
                  </div>
                </div>
              </Link>

              {/* Professional */}
              <Link href={getLocalizedHref(`/categories/${categories.find((c: Category) => c.slug === 'professional')?.slug || 'professional'}`, locale)} 
                className="category-card glass rounded-3xl p-8 hover:bg-accent-300/5 cursor-pointer group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-300/10 flex items-center justify-center">
                    <i className={`fas fa-${categories.find((c: Category) => c.slug === 'professional')?.icon || 'briefcase'} text-2xl text-accent-300`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-300 transition-colors">{categoriesT('professional')}</h3>
                </div>
                <p className="text-gray-400 mb-6">{categoriesT('descriptions.professional')}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-300/30 mr-3"></span>
                    Business Communication
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-300/30 mr-3"></span>
                    Professional Documents
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-300/30 mr-3"></span>
                    Templates
                  </div>
                </div>
              </Link>

              {/* Educational */}
              <Link href={getLocalizedHref(`/categories/${categories.find((c: Category) => c.slug === 'educational')?.slug || 'educational'}`, locale)} 
                className="category-card glass rounded-3xl p-8 hover:bg-accent-400/5 cursor-pointer group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-400/10 flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-2xl text-accent-400"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-400 transition-colors">{categoriesT('educational')}</h3>
                </div>
                <p className="text-gray-400 mb-6">{categoriesT('descriptions.educational')}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400/30 mr-3"></span>
                    Study Guides
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400/30 mr-3"></span>
                    Lesson Plans
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400/30 mr-3"></span>
                    Explanations
                  </div>
                </div>
              </Link>

              {/* Marketing */}
              <Link href={getLocalizedHref(`/categories/${categories.find((c: Category) => c.slug === 'marketing')?.slug || 'marketing'}`, locale)} 
                className="category-card glass rounded-3xl p-8 hover:bg-accent-600/5 cursor-pointer group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent-600/10 flex items-center justify-center">
                    <i className="fas fa-chart-line text-2xl text-accent-600"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-accent-600 transition-colors">{categoriesT('marketing')}</h3>
                </div>
                <p className="text-gray-400 mb-6">{categoriesT('descriptions.marketing')}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-600/30 mr-3"></span>
                    Social Media
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-600/30 mr-3"></span>
                    Ad Copy
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-600/30 mr-3"></span>
                    Landing Pages
                  </div>
                </div>
              </Link>
            </div>
            
            {/* View All Categories Button */}
            <div className="text-center mt-16">
              <Link href={getLocalizedHref('/categories', locale)} className="gradient-button inline-flex items-center px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 group relative">
                {common('viewAll')} {common('categoriesNav')}
                <i className="fas fa-arrow-right text-lg ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
