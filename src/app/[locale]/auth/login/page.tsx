"use client";

import { useTranslations } from 'next-intl';
import LoginForm from './LoginForm';
import { Suspense } from 'react';
import VerificationMessage from './VerificationMessage';

export default function Page() {
  const t = useTranslations('auth.loginForm');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
          <Suspense fallback={null}>
            <VerificationMessage />
          </Suspense>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
