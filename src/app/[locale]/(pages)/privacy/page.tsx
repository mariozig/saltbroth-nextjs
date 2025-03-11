/**
 * Privacy Policy Page
 * 
 * This page outlines the privacy policies and data handling practices.
 */

import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Privacy Page Props
 * @interface PrivacyPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the privacy page
 * 
 * @param {PrivacyPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('privacy'),
    description: t('privacyDescription'),
  };
}

/**
 * Privacy Page Component
 * 
 * Renders the privacy policy content.
 * 
 * @param {PrivacyPageProps} props - The component props
 * @returns {JSX.Element} - The rendered privacy page
 */
export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('privacy');
  const commonT = await getTranslations('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: commonT('home'), href: getLocalizedHref('/', locale) },
          { label: t('title'), href: getLocalizedHref('/privacy', locale), isCurrent: true }
        ]} />
        
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-gray-300 mt-2">
            {t('lastUpdated')}: {t('updateDate')}
          </p>
        </header>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2>{t('sections.intro.title')}</h2>
            <p>{t('sections.intro.content1')}</p>
            <p>{t('sections.intro.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.collection.title')}</h2>
            <p>{t('sections.collection.intro')}</p>
            <h3>{t('sections.collection.personal.title')}</h3>
            <p>{t('sections.collection.personal.content')}</p>
            <ul>
              <li>{t('sections.collection.personal.list.item1')}</li>
              <li>{t('sections.collection.personal.list.item2')}</li>
              <li>{t('sections.collection.personal.list.item3')}</li>
              <li>{t('sections.collection.personal.list.item4')}</li>
            </ul>
            
            <h3>{t('sections.collection.usage.title')}</h3>
            <p>{t('sections.collection.usage.content')}</p>
            <ul>
              <li>{t('sections.collection.usage.list.item1')}</li>
              <li>{t('sections.collection.usage.list.item2')}</li>
              <li>{t('sections.collection.usage.list.item3')}</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.use.title')}</h2>
            <p>{t('sections.use.intro')}</p>
            <ul>
              <li>{t('sections.use.list.item1')}</li>
              <li>{t('sections.use.list.item2')}</li>
              <li>{t('sections.use.list.item3')}</li>
              <li>{t('sections.use.list.item4')}</li>
              <li>{t('sections.use.list.item5')}</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.sharing.title')}</h2>
            <p>{t('sections.sharing.content1')}</p>
            <p>{t('sections.sharing.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.cookies.title')}</h2>
            <p>{t('sections.cookies.content1')}</p>
            <p>{t('sections.cookies.content2')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.security.title')}</h2>
            <p>{t('sections.security.content')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.thirdParty.title')}</h2>
            <p>{t('sections.thirdParty.content')}</p>
          </section>
          
          <section className="mb-10">
            <h2>{t('sections.children.title')}</h2>
            <p>{t('sections.children.content')}</p>
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
