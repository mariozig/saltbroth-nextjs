/**
 * Prompts Landing Page
 * 
 * This page displays all prompts in chronological order with newest first.
 * It serves as the main entry point for browsing all available prompts.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import PromptCard from '@/components/prompts/PromptCard';
import { getAllPrompts } from '@/app/api/prompts/prompts';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Props for the PromptsPage component
 * @interface PromptsPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface PromptsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the prompts page
 * 
 * @param {PromptsPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: PromptsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('prompts'),
    description: t('description'),
  };
}

/**
 * Prompts Page Component
 * 
 * Renders all prompts in chronological order with newest first.
 * Provides breadcrumb navigation for easy site navigation.
 * 
 * @param {PromptsPageProps} props - The component props
 * @returns {JSX.Element} - The rendered prompts page
 */
export default async function PromptsPage({ params }: PromptsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  
  // Get all prompts (already ordered by created_at desc in the API function)
  const prompts = await getAllPrompts();
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: commonT('home'), href: getLocalizedHref('/', locale) },
        { label: t('prompts'), href: getLocalizedHref('/prompts_legacy', locale), isCurrent: true }
      ]} />
      
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('prompts')}</h1>
        <p className="text-gray-300 mt-2">{t('browseCategoriesDescription')}</p>
      </header>
      
      <section>
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
      </section>
    </div>
  );
}
