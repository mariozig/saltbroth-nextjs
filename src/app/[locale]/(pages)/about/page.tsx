/**
 * About Page
 * 
 * This page provides information about the application, its purpose,
 * the team behind it, and other relevant information.
 */

import React from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';

/**
 * About Page Props
 * @interface AboutPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the about page
 * 
 * @param {AboutPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('about'),
    description: t('aboutDescription'),
  };
}

/**
 * About Page Component
 * 
 * Renders information about the application, team, mission, etc.
 * 
 * @param {AboutPageProps} props - The component props
 * @returns {JSX.Element} - The rendered about page
 */
export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('about');
  const commonT = await getTranslations('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: commonT('home'), href: getLocalizedHref('/', locale) },
          { label: t('title'), href: getLocalizedHref('/about', locale), isCurrent: true }
        ]} />
        
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-gray-300 mt-2">{t('subtitle')}</p>
        </header>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t('mission.title')}</h2>
          <p className="text-gray-300 mb-4">{t('mission.description')}</p>
          <p className="text-gray-300 mb-4">{t('mission.vision')}</p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{t('team.title')}</h2>
          <p className="text-gray-300 mb-4">{t('team.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glass rounded-xl p-6">
              <div className="w-20 h-20 rounded-full bg-primary-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-center mb-2">{t('team.member1.name')}</h3>
              <p className="text-gray-400 text-center">{t('team.member1.role')}</p>
              <p className="text-gray-300 mt-4 text-center">{t('team.member1.bio')}</p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <div className="w-20 h-20 rounded-full bg-primary-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-center mb-2">{t('team.member2.name')}</h3>
              <p className="text-gray-400 text-center">{t('team.member2.role')}</p>
              <p className="text-gray-300 mt-4 text-center">{t('team.member2.bio')}</p>
            </div>
            
            <div className="glass rounded-xl p-6">
              <div className="w-20 h-20 rounded-full bg-primary-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-center mb-2">{t('team.member3.name')}</h3>
              <p className="text-gray-400 text-center">{t('team.member3.role')}</p>
              <p className="text-gray-300 mt-4 text-center">{t('team.member3.bio')}</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
