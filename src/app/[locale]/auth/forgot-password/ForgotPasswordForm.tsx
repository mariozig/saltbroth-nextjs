"use client";

import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPasswordForm');

  const handleResetPassword = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/new-password`,
    });

    if (error) {
      console.error('Reset password error:', error.message);
    } else {
      console.log('Reset password email sent:', data);
    }
  };

  useEffect(() => {
    const form = document.querySelector('form');
    form?.addEventListener('submit', handleResetPassword);

    return () => {
      form?.removeEventListener('submit', handleResetPassword);
    };
  }, []);

  return (
    <form className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="email" className="sr-only">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={t('email')}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('submit')}
        </button>
      </div>
    </form>
  );
}
