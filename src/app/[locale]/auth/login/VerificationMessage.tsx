"use client";

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function VerificationMessage() {
  const t = useTranslations('auth.loginForm');
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  
  if (verified !== 'pending') return null;

  return (
    <div className="mt-4 rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            {t('verificationPending.title')}
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>{t('verificationPending.message')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
