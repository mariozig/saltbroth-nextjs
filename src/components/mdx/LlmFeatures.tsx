/**
 * LlmFeatures Component
 * 
 * This component displays a list of LLM features using translation keys.
 * It renders each feature as a badge with the translated text.
 */

'use client';

import * as React from 'react';
import { Locale } from '@/config/i18n';
import { lookupTranslation, getDictionary } from '@/lib/translation';

interface LlmFeaturesProps {
  features: string[];
  locale: Locale;
}

export default function LlmFeatures({ features, locale }: LlmFeaturesProps) {
  const [translations, setTranslations] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadTranslations() {
      try {
        const dictionary = await getDictionary(locale);
        
        const translatedFeatures = features.reduce<Record<string, string>>((acc, key) => {
          acc[key] = lookupTranslation(key, dictionary);
          return acc;
        }, {});
        
        setTranslations(translatedFeatures);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [features, locale]);

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap mt-3">
        {Array.from({ length: features.length }).map((_, i) => (
          <div 
            key={i} 
            className="h-6 bg-gray-200 animate-pulse rounded-full px-3"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {features.map((key) => (
        <div 
          key={key} 
          className="bg-blue-100 text-blue-800 text-sm font-semibold rounded-full px-3 py-1"
        >
          {translations[key] || key}
        </div>
      ))}
    </div>
  );
}
