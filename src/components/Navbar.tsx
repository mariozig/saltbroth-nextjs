"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const common = useTranslations('common');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold gradient-text">{common('appName')}</h1>
        <p className="ml-4 text-gray-400">{common('tagline')}</p>
      </div>
      <nav className="hidden md:flex space-x-6">
        <Link href="/categories" className="text-gray-300 hover:text-white">
          {common('categoriesNav')}
        </Link>
      </nav>
      <div className="flex space-x-4 items-center">
        <LanguageSwitcher />
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">{user.email}</span>
            <button
              onClick={handleLogout}
              className="gradient-button px-4 py-2 rounded-full"
            >
              {common('logout')}
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="gradient-button px-4 py-2 rounded-full"
            >
              {common('login')}
            </Link>
            <Link
              href="/auth/signup"
              className="gradient-button px-4 py-2 rounded-full"
            >
              {common('signup')}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
