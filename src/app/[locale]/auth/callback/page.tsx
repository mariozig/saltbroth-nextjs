"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabase';
import { useTranslations } from 'next-intl';

// Component that handles the auth callback logic
function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Process the hash fragment that Supabase Auth returns
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error with auth callback:', error.message);
        router.push('/auth/login?error=callback_failed');
        return;
      }
      
      // Get the type parameter from URL to determine the redirect
      const type = searchParams.get('type');
      
      if (data?.session) {
        // User is now logged in
        console.log('Auth callback successful, user signed in');
        
        if (type === 'recovery') {
          // This was a password reset
          router.push('/auth/login?reset=success');
        } else if (type === 'signup') {
          // This was an email confirmation after signup
          router.push('/auth/login?verified=success');
        } else {
          // Default redirect to home page
          router.push('/');
        }
      } else {
        // No session but no error - could be email confirmation without auto-login
        console.log('Auth callback processed but no session established');
        router.push('/auth/login?action=completed');
      }
    };
    
    handleAuthCallback();
  }, [router, searchParams]);
  
  return (
    <div className="text-center">
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        {t('callback.processing')}
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {t('callback.pleaseWait')}
      </p>
      {/* Add a loading spinner or animation here */}
      <div className="mt-5 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Suspense fallback={
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Processing</h2>
            <p className="mt-2 text-sm text-gray-600">Please wait...</p>
            <div className="mt-5 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        }>
          <AuthCallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
