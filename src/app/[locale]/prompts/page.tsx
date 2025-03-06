import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptCard from '@/components/prompts/PromptCard';
import { getAllCategories, getPromptsByCategory } from '@/app/api/prompts/prompts';

interface PromptsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PromptsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('prompts'),
    description: t('description'),
  };
}

export default async function PromptsPage({ params }: PromptsPageProps) {
  const { locale } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  
  // Get all categories
  const categories = await getAllCategories();
  
  // Get top-level categories
  const topLevelCategories = categories.filter(category => !category.parent_id);
  
  // Get featured prompts (for now, use the Business/Professional Content category)
  const featuredCategorySlug = 'business/professional-content';
  const featuredPrompts = await getPromptsByCategory(featuredCategorySlug);
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('prompts'), href: `/${locale}/prompts`, isCurrent: true }
      ]} />
      
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('prompts')}</h1>
        <p className="text-gray-300 mt-2">{t('browseCategoriesDescription')}</p>
      </header>
      
      {/* Featured Prompts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{t('popularPrompts')}</h2>
          <Link 
            href={`/${locale}/prompts/categories/${featuredCategorySlug}`}
            className="text-primary-400 text-sm hover:underline"
          >
            {commonT('viewAll')}
          </Link>
        </div>
        
        <Suspense fallback={<div className="grid gap-6 animate-pulse">{Array(3).fill(0).map((_, i) => <div key={i} className="h-36 glass rounded-2xl" />)}</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.slice(0, 3).map(prompt => (
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
      </section>
      
      {/* Categories Section */}
      <section>
        <h2 className="text-xl font-semibold mb-6">{t('categories')}</h2>
        <Suspense fallback={<div className="grid gap-6 animate-pulse">{Array(6).fill(0).map((_, i) => <div key={i} className="h-36 glass rounded-2xl" />)}</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topLevelCategories.map(category => (
              <Link 
                key={category.id}
                href={`/${locale}/prompts/categories/${category.slug}`}
                className="block group"
              >
                <div className="glass rounded-2xl p-6 h-full transition-transform duration-200 group-hover:translate-y-[-2px]">
                  <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Suspense>
      </section>
    </div>
  );
}
