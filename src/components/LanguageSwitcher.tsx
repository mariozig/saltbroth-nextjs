'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const switchLocale = (newLocale: string) => {
    // Get the current path without the locale prefix
    const currentPath = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
    router.push(`/${newLocale}${currentPath}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-1 text-gray-300 hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{locale === 'en' ? '🇺🇸' : '🇪🇸'}</span>
        <span>{locale === 'en' ? 'EN' : 'ES'}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`block px-4 py-2 text-sm w-full text-left ${locale === 'en' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => switchLocale('en')}
              role="menuitem"
            >
              <span className="flex items-center">
                <span className="mr-2">🇺🇸</span> English
              </span>
            </button>
            <button
              className={`block px-4 py-2 text-sm w-full text-left ${locale === 'es' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              onClick={() => switchLocale('es')}
              role="menuitem"
            >
              <span className="flex items-center">
                <span className="mr-2">🇪🇸</span> Español
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 