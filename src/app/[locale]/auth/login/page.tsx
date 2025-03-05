"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import LoginForm from './LoginForm';

export default function Page() {
  const t = useTranslations('auth.loginForm');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
