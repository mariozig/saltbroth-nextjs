/**
 * Terms of Service Page
 * 
 * This page outlines the terms and conditions for using the application.
 */

import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Terms Page Props
 * @interface TermsPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the terms page
 * 
 * @param {TermsPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('terms'),
    description: t('termsDescription'),
  };
}

/**
 * Terms Page Component
 * 
 * Renders the terms of service content.
 * 
 * @param {TermsPageProps} props - The component props
 * @returns {JSX.Element} - The rendered terms page
 */
export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('terms');
  const commonT = await getTranslations('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: commonT('home'), href: getLocalizedHref('/', locale) },
          { label: t('title'), href: getLocalizedHref('/terms', locale), isCurrent: true }
        ]} />
        
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-gray-300 mt-2">
            {t('lastUpdated')}: {t('updateDate')}
          </p>
        </header>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2>{t('sections.overview.title')}</h2>
            <p>{t('sections.overview.content1')}</p>
            <p>{t('sections.overview.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.access.title')}</h2>
            <p>{t('sections.access.content1')}</p>
            <p>{t('sections.access.content2')}</p>
            <ul>
              <li>{t('sections.access.list.item1')}</li>
              <li>{t('sections.access.list.item2')}</li>
              <li>{t('sections.access.list.item3')}</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.intellectual.title')}</h2>
            <p>{t('sections.intellectual.content1')}</p>
            <p>{t('sections.intellectual.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.userContent.title')}</h2>
            <p>{t('sections.userContent.content1')}</p>
            <p>{t('sections.userContent.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.prohibited.title')}</h2>
            <p>{t('sections.prohibited.intro')}</p>
            <ul>
              <li>{t('sections.prohibited.list.item1')}</li>
              <li>{t('sections.prohibited.list.item2')}</li>
              <li>{t('sections.prohibited.list.item3')}</li>
              <li>{t('sections.prohibited.list.item4')}</li>
              <li>{t('sections.prohibited.list.item5')}</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.termination.title')}</h2>
            <p>{t('sections.termination.content1')}</p>
            <p>{t('sections.termination.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.changes.title')}</h2>
            <p>{t('sections.changes.content')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.contact.title')}</h2>
            <p>{t('sections.contact.content')}</p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
