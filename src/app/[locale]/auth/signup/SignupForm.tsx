"use client";

import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const t = useTranslations('auth.signupForm');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0], // Default name from email
            role: 'user',
            is_verified: false
          }
        }
      });

      if (error) {
        // Map Supabase error messages to our translation keys
        if (error.message.includes('already registered')) {
          setError(t('error.emailTaken'));
        } else if (error.message.includes('valid email')) {
          setError(t('error.invalidEmail'));
        } else if (error.message.includes('password')) {
          setError(t('error.weakPassword'));
        } else {
          setError(t('error.generic'));
        }
        console.error('Signup error:', error.message);
      } else {
        console.log('Signed up:', data);
        router.push('/auth/login?verified=pending');
      }
    } catch (err) {
      setError(t('error.generic'));
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
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
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={t('password')}
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
