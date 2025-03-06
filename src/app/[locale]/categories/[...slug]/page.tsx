/**
 * Nested Category Page
 * 
 * This page displays a specific category, its child categories, and associated prompts.
 * It supports multilevel category nesting through the catch-all [...slug] parameter.
 * Provides breadcrumb navigation showing the full category hierarchy.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptCard from '@/components/prompts/PromptCard';
import { getPromptsByCategory, getAllCategories } from '@/app/api/prompts/prompts';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Props for the CategoryPage component
 * @interface CategoryPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 * @property {string[]} params.slug - The category slug parts as an array
 */
interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

/**
 * Represents an item in the breadcrumb navigation
 * @interface BreadcrumbItem
 * @property {string} label - Display text for the breadcrumb
 * @property {string} href - URL the breadcrumb links to
 * @property {boolean} [isCurrent] - Whether this is the current page
 */
interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Generates metadata for the category page
 * 
 * Resolves the category slug to find the current category and sets
 * appropriate SEO metadata based on the category name and description.
 * 
 * @param {CategoryPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  /**
   * Construct the complete category slug from the slug array parts
   * For example, ['cooking', 'recipes'] becomes 'cooking/recipes'
   */
  const categorySlug = slug.join('/');
  
  // Get all categories to find the current one
  const categories = await getAllCategories();
  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  
  if (!currentCategory) {
    return {
      title: t('notFound'),
    };
  }
  
  return {
    title: `${currentCategory.name} | ${t('categories')}`,
    description: currentCategory.description,
  };
}

/**
 * Category Page Component
 * 
 * Renders a specific category page showing:

 * 1. Breadcrumb navigation for the category hierarchy
 * 2. Category details (name and description)
 * 3. Child categories (if any)
 * 4. Prompts associated with this category
 * 
 * @param {CategoryPageProps} props - The component props
 * @returns {JSX.Element} - The rendered category page
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  
  /**
   * Construct the complete category slug from the slug array parts
   * For example, ['cooking', 'recipes'] becomes 'cooking/recipes'
   */
  const categorySlug = slug.join('/');
  
  /**
   * Get all categories to find the current one and its children
   * If the category doesn't exist, return a 404 Not Found response
   */
  const allCategories = await getAllCategories();
  const currentCategory = allCategories.find(cat => cat.slug === categorySlug);
  
  if (!currentCategory) {
    notFound();
  }
  
  /**
   * Get child categories for the current category
   * These are categories that have this category as their parent
   */
  const childCategories = allCategories.filter(cat => cat.parent_id === currentCategory.id);
  
  /**
   * Get all prompts that belong to this specific category
   */
  const prompts = await getPromptsByCategory(categorySlug);
  
  /**
   * Build breadcrumb navigation path
   * Starting with home and categories as the base path
   */
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: commonT('home'), href: getLocalizedHref('/', locale) },
    { label: t('categories'), href: getLocalizedHref('/categories', locale) }
  ];
  
  /**
   * If this is a nested category (slug has multiple parts), add parent categories to breadcrumbs
   * For example, for 'cooking/recipes/desserts', we add 'cooking' and 'cooking/recipes' as parents
   */
  if (slug.length > 1) {
    /**
     * Build parent slugs incrementally
     * For each part of the slug (except the last one), construct the parent slug
     * and find the corresponding category to add to breadcrumbs
     */
    let parentSlug = '';
    for (let i = 0; i < slug.length - 1; i++) {
      parentSlug = parentSlug ? `${parentSlug}/${slug[i]}` : slug[i];
      const parentCategory = allCategories.find(cat => cat.slug === parentSlug);
      if (parentCategory) {
        breadcrumbItems.push({
          label: parentCategory.name,
          href: getLocalizedHref(`/categories/${parentSlug}`, locale)
        });
      }
    }
  }
  
  /**
   * Add the current category as the final item in the breadcrumb trail
   * This is marked as the current page (isCurrent: true)
   */
  breadcrumbItems.push({
    label: currentCategory.name,
    href: getLocalizedHref(`/categories/${categorySlug}`, locale),
    isCurrent: true
  });
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">{currentCategory.name}</h1>
        <p className="text-gray-300 mt-2">{currentCategory.description}</p>
      </header>
      
      {childCategories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">{t('subcategories')}</h2>
          <Suspense fallback={<div className="grid gap-6 animate-pulse">{Array(3).fill(0).map((_, i) => <div key={i} className="h-36 glass rounded-2xl" />)}</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {childCategories.map(category => (
                <a 
                  key={category.id}
                  href={getLocalizedHref(`/categories/${category.slug}`, locale)}
                  className="block group"
                >
                  <div className="glass rounded-2xl p-6 h-full transition-transform duration-200 group-hover:translate-y-[-2px]">
                    <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </Suspense>
        </section>
      )}
      
      <section>
        <h2 className="text-xl font-semibold mb-6">{t('promptsInCategory')}</h2>
        {prompts.length > 0 ? (
          <Suspense fallback={<div className="grid gap-6 animate-pulse">{Array(6).fill(0).map((_, i) => <div key={i} className="h-36 glass rounded-2xl" />)}</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  title={prompt.title}
                  slug={prompt.slug}
                  description={prompt.description}
                  icon={prompt.icon}
                  isPremium={prompt.is_premium}
                />
              ))}
            </div>
          </Suspense>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('noPrompts')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

/**
 * Generate static parameters for all possible category paths
 * This enables static generation of all category pages at build time
 * 
 * @returns {Promise<Array<{slug: string[]}>>} Array of slug parameters for each category
 */
export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();

    return categories.map((category) => ({
      slug: category.slug.split('/'),
    }));
  } catch (error) {
    console.error('Unexpected error in generateStaticParams:', error);
    return [];
  }
}
