import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllCategories } from '@/app/api/prompts/prompts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: `${t('categories')} | ${t('prompts')}`,
    description: t('categoriesDescription'),
  };
}

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const categories = await getAllCategories();
  
  // Only get top-level categories
  const topLevelCategories = categories.filter(category => !category.parent_id);
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('prompts'), href: `/${locale}/prompts` },
        { label: t('categories'), href: `/${locale}/prompts/categories`, isCurrent: true }
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
              href={`/${locale}/prompts/categories/${category.slug}`}
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
