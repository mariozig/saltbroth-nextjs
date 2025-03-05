"use client";

import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

export default function LoginForm() {
  const t = useTranslations('auth.loginForm');

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
    } else {
      console.log('Logged in:', data);
    }
  };

  useEffect(() => {
    const form = document.querySelector('form');
    form?.addEventListener('submit', handleLogin);

    return () => {
      form?.removeEventListener('submit', handleLogin);
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
        <div>
          <label htmlFor="password" className="sr-only">
            {t('password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={t('password')}
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
      <div className="text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {t('resetPassword')}
        </Link>
      </div>
    </form>
  );
}
