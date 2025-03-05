"use client";

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function VerificationMessage() {
  const t = useTranslations('auth.loginForm');
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');
  
  // No message to show
  if (!verified && !reset) return null;

  // Success message styles (green)
  const successStyles = {
    bg: 'bg-green-50',
    iconColor: 'text-green-400',
    titleColor: 'text-green-800',
    textColor: 'text-green-700'
  };
  
  // Info message styles (blue)
  const infoStyles = {
    bg: 'bg-blue-50',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700'
  };

  // Determine message and styles based on query parameters
  let title = '';
  let message = '';
  let styles = infoStyles;
  let icon = null;

  if (verified === 'success') {
    // Email verification successful
    title = t('verificationSuccess.title');
    message = t('verificationSuccess.message');
    styles = successStyles;
    icon = (
      <svg className={`h-5 w-5 ${styles.iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  } else if (verified === 'pending') {
    // Email verification pending
    title = t('verificationPending.title');
    message = t('verificationPending.message');
    styles = infoStyles;
    icon = (
      <svg className={`h-5 w-5 ${styles.iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    );
  } else if (reset === 'success') {
    // Password reset successful
    title = t('resetSuccess.title');
    message = t('resetSuccess.message');
    styles = successStyles;
    icon = (
      <svg className={`h-5 w-5 ${styles.iconColor}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );
  }

  // If no message determined, return null
  if (!title || !message) return null;

  return (
    <div className={`mt-4 rounded-md ${styles.bg} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${styles.textColor}`}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
