/**
 * LLMs Landing Page
 * 
 * This page displays all available Large Language Models (LLMs).
 * It serves as the main entry point for browsing supported AI models.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllLlms, getLlmIconPath } from '@/lib/content';
import { Locale } from '@/config/i18n';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Props for the LlmsPage component
 * @interface LlmsPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface LlmsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the LLMs page
 * 
 * @param {LlmsPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: LlmsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('llms'),
    description: t('llms_description'),
  };
}

/**
 * LLM Card Component
 * 
 * Renders a card for a single LLM with its name, icon, and description.
 */
function LlmCard({ llm, locale }: { llm: any, locale: string }) {
  return (
    <Link 
      href={`/${locale}/llms/${llm.slug}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center mb-4">
        {llm.icon && (
          <div className="w-12 h-12 mr-4">
            <Image 
              src={getLlmIconPath(llm.icon)}
              alt={llm.name}
              width={48}
              height={48}
              className="object-contain"
              priority={true}
            />
          </div>
        )}
        <h2 className="text-xl font-bold">{llm.name}</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{llm.description}</p>
    </Link>
  );
}

/**
 * LLMs Page Component
 * 
 * Displays all available LLMs with their icons and descriptions.
 * 
 * @param {LlmsPageProps} props - The component props
 * @returns {JSX.Element} - The rendered LLMs page
 */
export default async function LlmsPage({ params }: LlmsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Get translations for both common and metadata namespaces
  const t = await getTranslations({ locale, namespace: 'common' });
  const metadataT = await getTranslations({ locale, namespace: 'metadata' });
  
  // Get all LLMs for the current locale
  const llms = await getAllLlms(locale as Locale);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs 
        items={[
          { label: t('home'), href: getLocalizedHref('/', locale) },
          { label: t('llms'), href: getLocalizedHref('/llms', locale) },
        ]}
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{metadataT('llms')}</h1>
        <p className="text-gray-600 dark:text-gray-300">{metadataT('llms_description')}</p>
      </div>
      
      <Suspense fallback={<div className="p-4 text-center">Loading LLMs...</div>}>
        {llms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {llms.map((llm) => (
              <LlmCard key={llm.slug} llm={llm} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-lg">No language models available</p>
          </div>
        )}
      </Suspense>
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
