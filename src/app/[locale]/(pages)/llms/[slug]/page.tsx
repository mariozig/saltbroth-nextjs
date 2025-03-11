/**
 * LLM Detail Page
 * 
 * This page displays detailed information about a specific LLM,
 * including its features and compatible prompts.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { 
  getLlmBySlug, 
  getLlmIconPath, 
  getPromptsByCompatibleLlm,
  checkContentLocalization 
} from '@/lib/content';
import { Locale } from '@/config/i18n';
import LlmFeatures from '@/components/mdx/LlmFeatures';
import { processMDX } from '@/components/mdx/MDXProvider';

/**
 * Props for the LLM Detail page component
 * @interface LlmDetailPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 * @property {string} params.slug - The slug of the LLM
 */
interface LlmDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generates metadata for the LLM detail page
 * 
 * @param {LlmDetailPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: LlmDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const llm = await getLlmBySlug(locale as Locale, slug);
  
  if (!llm) {
    return {
      title: 'LLM Not Found',
    };
  }
  
  return {
    title: llm.name,
    description: llm.description,
  };
}

/**
 * LLM Detail Page Component
 * 
 * Displays detailed information about a specific LLM,
 * including its features and compatible prompts.
 * 
 * @param {LlmDetailPageProps} props - The component props
 * @returns {JSX.Element} - The rendered LLM detail page
 */
export default async function LlmDetailPage({ params }: LlmDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations({ locale, namespace: 'common' });
  
  // Get the LLM
  const llm = await getLlmBySlug(locale as Locale, slug);
  
  // If LLM not found, return 404
  if (!llm) {
    notFound();
  }
  
  // Get compatible prompts
  const compatiblePrompts = await getPromptsByCompatibleLlm(locale as Locale, slug);
  
  // Check localization status (for admin/debugging purposes)
  const localizationStatus = await checkContentLocalization('llms', slug);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: t('home'), href: getLocalizedHref('/', locale) },
          { label: t('llms'), href: getLocalizedHref('/llms', locale) },
          { label: llm.name, href: getLocalizedHref(`/llms/${slug}`, locale) },
        ]}
      />
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          {llm.icon && (
            <div className="w-16 h-16 mr-4">
              <Image 
                src={getLlmIconPath(llm.icon)}
                alt={llm.name}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold">{llm.name}</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{llm.description}</p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('features')}</h2>
          <LlmFeatures features={llm.features} locale={locale as Locale} />
        </div>
        
        {llm.content && llm.content.trim() !== '' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('about')}</h2>
            <div className="prose dark:prose-dark max-w-none">
              <Suspense fallback={<div>Loading content...</div>}>
                {/* Use the processMDX function from MDXProvider */}
                {llm.content && await processMDX(llm.content, locale as Locale)}
              </Suspense>
            </div>
          </div>
        )}
        
        {compatiblePrompts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{t('compatible_prompts')}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compatiblePrompts.map((prompt) => (
                <li key={prompt.slug}>
                  <Link 
                    href={getLocalizedHref(`/prompts/${prompt.slug}`, locale)}
                    className="block p-4 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <h3 className="font-bold">{prompt.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{prompt.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Localization status (only visible for admin/debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Localization Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(localizationStatus).map(([loc, exists]) => (
                <div key={loc} className={`p-2 rounded ${exists ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
                  <span className="font-medium">{loc}: {exists ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to get localized href
 * This is a temporary function that should be imported from a utility
 */
function getLocalizedHref(path: string, locale: string): string {
  return `/${locale}${path}`;
}


