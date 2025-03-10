/**
 * Individual Prompt Display Page
 * 
 * This page displays a single prompt with its details, template content, and output samples.
 * It fetches the prompt data based on the slug parameter and renders the prompt template
 * along with any available output samples.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptTemplate from '@/components/prompts/PromptTemplate';
import PromptOutputSamples from '@/components/prompts/PromptOutputSamples';
import { getPromptBySlug, getOutputSamplesByPromptId } from '@/app/api/prompts/prompts';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Props for the PromptPage component
 * @interface PromptPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 * @property {string} params.slug - The prompt slug identifier
 */
interface PromptPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generates metadata for the prompt page for SEO purposes
 * @param {PromptPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  const prompt = await getPromptBySlug(slug);
  
  if (!prompt) {
    return {
      title: t('notFound'),
    };
  }
  
  return {
    title: `${prompt.title} | ${t('prompts')}`,
    description: prompt.description,
  };
}

/**
 * Prompt Page Component
 * 
 * Renders a single prompt's details, including its title, description, 
 * template content, and any available output samples. Provides breadcrumb 
 * navigation with links to the category hierarchy.
 * 
 * @param {PromptPageProps} props - The component props
 * @returns {JSX.Element} - The rendered prompt page
 */
export default async function PromptPage({ params }: PromptPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  
  const prompt = await getPromptBySlug(slug);
  
  if (!prompt) {
    notFound();
  }
  
  const samples = await getOutputSamplesByPromptId(prompt.id);
  
  /**
   * Construct breadcrumb path from the prompt's category
   * Categories can be either an array or a single object, so we need to handle both cases
   */
  const categoryItem = Array.isArray(prompt.categories) ? prompt.categories[0] : prompt.categories;
  const categorySlug = categoryItem?.slug || '';
  const categoryName = categoryItem?.name || '';
  
  const breadcrumbItems = [
    { label: commonT('home'), href: getLocalizedHref('/', locale) },
    { label: t('categories'), href: getLocalizedHref('/categories', locale) },
    { 
      label: categoryName, 
      href: getLocalizedHref(`/categories/${categorySlug}`, locale),
    },
    { label: prompt.title, href: getLocalizedHref(`/prompts_legacy/${slug}`, locale), isCurrent: true },
  ];
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {prompt.icon && (
            <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center">
              <i className={`fas ${prompt.icon} text-primary-400 text-xl`}></i>
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-white">{prompt.title}</h1>
        </div>
        <p className="text-gray-300 text-lg max-w-3xl">{prompt.description}</p>
      </header>
      
      <div className="space-y-12">
        <Suspense fallback={<div className="h-36 glass rounded-2xl animate-pulse" />}>
          <PromptTemplate 
            content={prompt.content} 
          />
        </Suspense>
        
        {samples.length > 0 && (
          <Suspense fallback={<div className="h-64 glass rounded-2xl animate-pulse" />}>
            <PromptOutputSamples samples={samples} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
