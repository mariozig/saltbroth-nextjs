/**
 * Translation utilities
 * 
 * This file contains utility functions for handling translation keys and localized content.
 * It supports accessing nested translation keys using dot notation and handles fallbacks.
 */

import * as React from 'react';
import { Locale } from '@/config/i18n';

/**
 * Get a dictionary for the specified locale
 * @param locale - The locale to get the dictionary for
 */
export async function getDictionary(locale: Locale) {
  return (await import(`../dictionaries/${locale}.json`)).default;
}

/**
 * Look up a translation key in the specified locale
 * @param key - Translation key in dot notation (e.g., "llm.feature.writing")
 * @param dictionary - Dictionary to find the translation in
 * @returns The translated string or the key itself if not found
 */
export function lookupTranslation(key: string, dictionary: Record<string, any>): string {
  const parts = key.split('.');
  let result = dictionary;
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      // Translation not found, return the key itself
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

/**
 * React component for displaying a translated key
 */
export function Translate({ 
  keyName, 
  locale 
}: { 
  keyName: string; 
  locale: Locale;
}) {
  const [translation, setTranslation] = React.useState(keyName);
  
  React.useEffect(() => {
    const fetchTranslation = async () => {
      const dictionary = await getDictionary(locale);
      setTranslation(lookupTranslation(keyName, dictionary));
    };
    
    fetchTranslation();
  }, [keyName, locale]);
  
  return React.createElement(React.Fragment, null, translation);
}

/**
 * Validate if a translation key exists in the given locale
 * @param key - Translation key to validate
 * @param locale - Locale to check
 * @returns True if the key exists, false otherwise
 */
export async function validateTranslationKey(
  key: string, 
  locale: Locale
): Promise<boolean> {
  const dictionary = await getDictionary(locale);
  const translation = lookupTranslation(key, dictionary);
  
  // If the translation is the same as the key, it was not found
  return translation !== key;
}

/**
 * Translation key validation result
 */
export interface ValidationResult {
  key: string;
  valid: boolean;
  file?: string;
}

/**
 * Validate a list of translation keys
 * @param keys - List of translation keys to validate
 * @param locale - Locale to check
 * @returns Validation results for each key
 */
export async function validateTranslationKeys(
  keys: string[],
  locale: Locale
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  const dictionary = await getDictionary(locale);
  
  for (const key of keys) {
    const translation = lookupTranslation(key, dictionary);
    results.push({
      key,
      valid: translation !== key
    });
  }
  
  return results;
}

/**
 * Extract translation keys from MDX frontmatter
 * @param frontmatter - MDX frontmatter object
 * @returns List of translation keys found in the frontmatter
 */
export function extractTranslationKeys(frontmatter: Record<string, any>): string[] {
  const keys: string[] = [];
  
  // Look for translation keys in the features array
  if (Array.isArray(frontmatter.features)) {
    keys.push(...frontmatter.features);
  }
  
  // Add more frontmatter fields that might contain translation keys as needed
  
  return keys;
}
