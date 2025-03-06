/**
 * Categories Landing Page
 * 
 * This page displays all top-level categories in a grid layout.
 * It serves as the main entry point for browsing prompt categories.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllCategories } from '@/app/api/prompts/prompts';

/**
 * Generates metadata for the categories page
 * 
 * @param {Object} props - The component props
 * @param {Promise<{locale: string}>} props.params - The route parameters containing the locale
 * @returns {Promise<Metadata>} - The page metadata for SEO
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: `${t('categories')}`,
    description: t('categoriesDescription'),
  };
}

/**
 * Categories Page Component
 * 
 * Renders a grid of top-level categories, each linking to its respective nested
 * category page. Filters out child categories to only show main/parent categories.
 * 
 * @param {Object} props - The component props
 * @param {Promise<{locale: string}>} props.params - The route parameters containing the locale
 * @returns {JSX.Element} - The rendered categories page
 */
export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  const categories = await getAllCategories();
  
  /**
   * Filter categories to get only top-level categories (those without a parent)
   * Child categories will be displayed on their respective parent category pages
   */
  const topLevelCategories = categories.filter(category => !category.parent_id);
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: commonT('home'), href: `/${locale}` },
        { label: t('categories'), href: `/${locale}/categories`, isCurrent: true }
      ]} />
      
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('browseCategories')}</h1>
        <p className="text-gray-300 mt-2">{t('browseCategoriesDescription')}</p>
      </header>
      
      <Suspense fallback={<div className="grid gap-6 animate-pulse">{Array(6).fill(0).map((_, i) => <div key={i} className="h-36 glass rounded-2xl" />)}</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topLevelCategories.map(category => (
            <Link 
              key={category.id}
              href={`/${locale}/categories/${category.slug}`}
              className="block group"
            >
              <div className="glass rounded-2xl p-6 h-full transition-transform duration-200 group-hover:translate-y-[-2px]">
                <h2 className="text-lg font-semibold text-white mb-2">{category.name}</h2>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
} 