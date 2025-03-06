/**
 * Contact Page
 * 
 * This page provides a contact form and information for users to get in touch.
 */

import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import { getLocalizedHref } from '@/utils/locale';

/**
 * Contact Page Props
 * @interface ContactPageProps
 * @property {Promise<Object>} params - The route parameters
 * @property {string} params.locale - The current locale (e.g., 'en', 'es')
 */
interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Generates metadata for the contact page
 * 
 * @param {ContactPageProps} props - The component props
 * @returns {Promise<Metadata>} - The page metadata
 */
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('contact'),
    description: t('contactDescription'),
  };
}

/**
 * Contact Page Component
 * 
 * Renders a contact form and company information.
 * 
 * @param {ContactPageProps} props - The component props
 * @returns {JSX.Element} - The rendered contact page
 */
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('contact');
  const commonT = await getTranslations('common');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: commonT('home'), href: getLocalizedHref('/', locale) },
          { label: t('title'), href: getLocalizedHref('/contact', locale), isCurrent: true }
        ]} />
        
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white">{t('title')}</h1>
          <p className="text-gray-300 mt-2">{t('subtitle')}</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <h2 className="text-2xl font-semibold mb-6">{t('form.title')}</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.name')}</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.email')}</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('form.message')}</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('form.messagePlaceholder')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="gradient-button px-6 py-3 rounded-lg font-medium"
              >
                {t('form.submit')}
              </button>
            </form>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-6">{t('info.title')}</h2>
            
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">{t('info.address.title')}</h3>
                <p className="text-gray-300">
                  {t('info.address.line1')}<br />
                  {t('info.address.line2')}<br />
                  {t('info.address.line3')}
                </p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">{t('info.email.title')}</h3>
                <p className="text-gray-300">{t('info.email.value')}</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">{t('info.phone.title')}</h3>
                <p className="text-gray-300">{t('info.phone.value')}</p>
              </div>
              
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">{t('info.hours.title')}</h3>
                <p className="text-gray-300">{t('info.hours.value')}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
