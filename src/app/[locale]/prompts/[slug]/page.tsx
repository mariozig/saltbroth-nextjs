import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptTemplate from '@/components/prompts/PromptTemplate';
import PromptOutputSamples from '@/components/prompts/PromptOutputSamples';
import { getPromptBySlug, getOutputSamplesByPromptId } from '@/app/api/prompts/prompts';

interface PromptPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

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

export default async function PromptPage({ params }: PromptPageProps) {
  const { locale, slug } = await params;
  unstable_setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  
  const prompt = await getPromptBySlug(slug);
  
  if (!prompt) {
    notFound();
  }
  
  const samples = await getOutputSamplesByPromptId(prompt.id);
  
  // Construct breadcrumb path from category
  // Categories is an array, so we need to access the first element
  const categoryItem = Array.isArray(prompt.categories) ? prompt.categories[0] : null;
  const categorySlug = categoryItem?.slug || '';
  const categoryName = categoryItem?.name || '';
  
  const breadcrumbItems = [
    { label: t('prompts'), href: `/${locale}/prompts` },
    { 
      label: categoryName, 
      href: `/${locale}/prompts/categories/${categorySlug}`,
    },
    { label: prompt.title, href: `/${locale}/prompts/${slug}`, isCurrent: true },
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
