import { getTranslations } from 'next-intl/server';
import LoginForm from './LoginForm';
import ClientLoginWrapper from './ClientLoginWrapper';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'metadata' });
  
  return {
    title: `${t('title')} | ${t('login')}`,
    description: t('description')
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'auth.loginForm' });
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <ClientLoginWrapper />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
