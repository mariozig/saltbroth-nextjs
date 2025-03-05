"use client";

import { useTranslations } from 'next-intl';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function Page() {
  const t = useTranslations('auth.forgotPasswordForm');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {t('title')}
          </h2>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
