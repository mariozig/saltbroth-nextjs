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

import React, { use } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';
import Link from 'next/link';
import { getAllContent, type Category } from '@/lib/content';
import { type Locale } from '@/config/i18n';

/**
 * Fetch categories data with error handling
 */
async function getCategories(locale: Locale) {
  try {
    return await getAllContent<Category>(locale, 'categories');
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Home Page Component
 * Renders the main landing page with:
 * - Intentionally does not include a navbar
 * - Hero section with gradient text and CTA
 * - Featured categories grid
 * - Elegant dividers and glass-morphism cards
 * - Footer component
 */
export default function Home() {
  const t = useTranslations('home');
  const common = useTranslations('common');
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
              <Link href={getLocalizedHref('/prompts', locale)} className="gradient-button inline-flex items-center px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300 group relative shadow-lg shadow-accent-100/30 hover:shadow-accent-100/50">
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
              {/* Dynamically generate category cards */}
              {categories.slice(0, 6).map((category, index) => {
                // Use the accentColor from the category or fallback to a default based on index
                const accentColor = category.accentColor || `accent-${(index % 6) * 100 + 100}`;
                
                return (
                  <Link 
                    key={category.slug}
                    href={getLocalizedHref(`/categories/${category.slug}`, locale)} 
                    className={`category-card glass rounded-3xl p-8 hover:bg-${accentColor}/5 cursor-pointer group transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-${accentColor}/10 flex items-center justify-center`}>
                        <i className={`fas fa-${category.icon} text-2xl text-${accentColor}`}></i>
                      </div>
                      <h3 className={`text-2xl font-bold text-white group-hover:text-${accentColor} transition-colors`}>
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-6">{category.description}</p>
                    <div className="space-y-3">
                      {/* Extract bullet points from the MDX content */}
                      {category.content
                        .split('\n')
                        .filter(line => line.trim().startsWith('- '))
                        .slice(0, 3)
                        .map((line, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-400">
                            <span className={`w-1.5 h-1.5 rounded-full bg-${accentColor}/30 mr-3`}></span>
                            {line.replace('- ', '')}
                          </div>
                        ))}
                    </div>
                  </Link>
                );
              })}
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
