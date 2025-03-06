import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

interface NotFoundProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: NotFoundProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('notFound'),
  };
}

export default async function NotFound({ params }: NotFoundProps) {
  // Handle case where params might be undefined
  const locale = params ? (await params).locale : 'en';
  // Use try/catch to handle potential errors with unstable_setRequestLocale
  try {
    unstable_setRequestLocale(locale);
  } catch (error) {
    console.error('Error setting request locale:', error);
  }
  
  // Get translations
  const t = await getTranslations('prompts');
  const commonT = await getTranslations('common');
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: t('prompts'), href: `/${locale}/prompts` },
        { label: 'Not Found', href: '#', isCurrent: true }
      ]} />
      
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Prompt Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The prompt you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href={`/${locale}/prompts`}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-full text-white font-medium transition-colors"
        >
          {commonT('back')} to {t('prompts')}
        </Link>
      </div>
    </div>
  );
}
