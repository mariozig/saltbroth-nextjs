import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptCard from '@/components/prompts/PromptCard';
import { getPromptsByCategory, getAllCategories } from '@/app/api/prompts/prompts';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  // Construct the complete category slug
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
    title: `${currentCategory.name} | ${t('prompts')}`,
    description: currentCategory.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  
  // Construct the complete category slug
  const categorySlug = slug.join('/');
  
  // Get all categories to find the current one and its children
  const allCategories = await getAllCategories();
  const currentCategory = allCategories.find(cat => cat.slug === categorySlug);
  
  if (!currentCategory) {
    notFound();
  }
  
  // Get child categories
  const childCategories = allCategories.filter(cat => cat.parent_id === currentCategory.id);
  
  // Get prompts in this category
  const prompts = await getPromptsByCategory(categorySlug);
  
  // Build breadcrumb path
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t('prompts'), href: `/${locale}/prompts` },
    { label: t('categories'), href: `/${locale}/prompts/categories` }
  ];
  
  // If this is a nested category, add parent categories to breadcrumbs
  if (slug.length > 1) {
    // Build parent slugs incrementally
    let parentSlug = '';
    for (let i = 0; i < slug.length - 1; i++) {
      parentSlug = parentSlug ? `${parentSlug}/${slug[i]}` : slug[i];
      const parentCategory = allCategories.find(cat => cat.slug === parentSlug);
      if (parentCategory) {
        breadcrumbItems.push({
          label: parentCategory.name,
          href: `/${locale}/prompts/categories/${parentSlug}`
        });
      }
    }
  }
  
  // Add current category to breadcrumbs
  breadcrumbItems.push({
    label: currentCategory.name,
    href: `/${locale}/prompts/categories/${categorySlug}`,
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
                  href={`/${locale}/prompts/categories/${category.slug}`}
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
