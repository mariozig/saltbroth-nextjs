/**
 * Content utilities
 * 
 * This file contains utility functions for loading and processing MDX content files.
 * It provides functions for retrieving categories, prompts, and LLMs from the filesystem.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Locale, locales } from '@/config/i18n';

// Import glob with proper typing
const globImport = require('glob');
const glob = (pattern: string, options: any): Promise<string[]> => {
  return globImport.glob(pattern, options);
};

// Define content types
export const CONTENT_TYPES = ['categories', 'prompts', 'llms'] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// Define base content interface
interface BaseContent {
  slug: string;
  locale: Locale;
}

// Define category interface
export interface Category extends BaseContent {
  name: string;
  description: string;
  icon: string;
  content: string;
}

// Define prompt interface
export interface Prompt extends BaseContent {
  title: string;
  description: string;
  category: string;
  isPremium: boolean;
  icon: string;
  compatible_llms: string[];
  featured_llms?: string[];
  content: string;
}

// Define LLM interface
export interface LLM extends BaseContent {
  name: string;
  description: string;
  icon: string;
  features: string[];
  content: string;
}

/**
 * Get the path to an LLM icon
 * @param iconName - The name of the icon (from the LLM.icon property)
 * @returns The path to the icon
 */
export function getLlmIconPath(iconName: string): string {
  // Icons are stored in the public directory
  return `/images/llms/${iconName}`;
}

/**
 * Validate if an LLM has all required fields
 * @param llm - The LLM to validate
 * @returns Object with validation results
 */
export function validateLlm(llm: LLM): { 
  isValid: boolean; 
  missingFields: string[];
  warnings: string[];
} {
  const requiredFields = ['name', 'description', 'icon', 'features'];
  const missingFields = requiredFields.filter(field => !llm[field as keyof LLM]);
  
  // Check for specific issues
  const warnings: string[] = [];
  
  // Check if features array is empty
  if (llm.features && llm.features.length === 0) {
    warnings.push('Features array is empty');
  }
  
  // Check if icon file exists (this would need to be enhanced to actually check the filesystem)
  if (llm.icon && !llm.icon.includes('.')) {
    warnings.push('Icon filename may be invalid (missing extension)');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings
  };
}

/**
 * Get the content directory
 * @returns Path to the content directory
 */
function getContentDirectory(): string {
  return path.join(process.cwd(), 'content');
}

/**
 * Get the locale directory for the specified content type
 * @param locale - The locale to get the directory for
 * @param contentType - The type of content to get the directory for
 * @returns Path to the locale directory
 */
function getContentTypeDirectory(locale: Locale, contentType: ContentType): string {
  return path.join(getContentDirectory(), locale, contentType);
}

/**
 * Get all content items of the specified type
 * @param locale - The locale to get content for
 * @param contentType - The type of content to get
 * @returns Array of content items
 */
export async function getAllContent<T extends BaseContent>(
  locale: Locale,
  contentType: ContentType
): Promise<T[]> {
  const contentDir = getContentTypeDirectory(locale, contentType);
  
  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  // Get all MDX files
  const files = await glob('**/*.mdx', { cwd: contentDir });
  
  // Read and parse each file
  const items = await Promise.all(
    files.map(async (file: string) => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      return {
        ...data,
        slug: data.slug || path.basename(file, '.mdx'),
        locale,
        content,
      } as T;
    })
  );
  
  return items;
}

/**
 * Get a specific content item by slug
 * @param locale - The locale to get content for
 * @param contentType - The type of content to get
 * @param slug - The slug of the content item to get
 * @returns The content item or null if not found
 */
export async function getContentBySlug<T extends BaseContent>(
  locale: Locale,
  contentType: ContentType,
  slug: string
): Promise<T | null> {
  const items = await getAllContent<T>(locale, contentType);
  return items.find((item) => item.slug === slug) || null;
}

/**
 * Get all categories
 * @param locale - The locale to get categories for
 * @returns Array of categories
 */
export async function getAllCategories(locale: Locale): Promise<Category[]> {
  return getAllContent<Category>(locale, 'categories');
}

/**
 * Get a category by slug
 * @param locale - The locale to get the category for
 * @param slug - The slug of the category to get
 * @returns The category or null if not found
 */
export async function getCategoryBySlug(
  locale: Locale,
  slug: string
): Promise<Category | null> {
  return getContentBySlug<Category>(locale, 'categories', slug);
}

/**
 * Get all LLMs
 * @param locale - The locale to get LLMs for
 * @returns Array of LLMs
 */
export async function getAllLlms(locale: Locale): Promise<LLM[]> {
  return getAllContent<LLM>(locale, 'llms');
}

/**
 * Get an LLM by slug
 * @param locale - The locale to get the LLM for
 * @param slug - The slug of the LLM to get
 * @returns The LLM or null if not found
 */
export async function getLlmBySlug(
  locale: Locale,
  slug: string
): Promise<LLM | null> {
  return getContentBySlug<LLM>(locale, 'llms', slug);
}

/**
 * Get all prompts
 * @param locale - The locale to get prompts for
 * @returns Array of prompts
 */
export async function getAllPrompts(locale: Locale): Promise<Prompt[]> {
  return getAllContent<Prompt>(locale, 'prompts');
}

/**
 * Get a prompt by slug
 * @param locale - The locale to get the prompt for
 * @param slug - The slug of the prompt to get
 * @returns The prompt or null if not found
 */
export async function getPromptBySlug(
  locale: Locale,
  slug: string
): Promise<Prompt | null> {
  return getContentBySlug<Prompt>(locale, 'prompts', slug);
}

/**
 * Get all prompts for a specific category
 * @param locale - The locale to get prompts for
 * @param categorySlug - The slug of the category to get prompts for
 * @returns Array of prompts for the category
 */
export async function getPromptsByCategory(
  locale: Locale,
  categorySlug: string
): Promise<Prompt[]> {
  const prompts = await getAllPrompts(locale);
  return prompts.filter((prompt) => prompt.category === categorySlug);
}

/**
 * Get all prompts compatible with a specific LLM
 * @param locale - The locale to get prompts for
 * @param llmSlug - The slug of the LLM to get compatible prompts for
 * @returns Array of prompts compatible with the LLM
 */
export async function getPromptsByCompatibleLlm(
  locale: Locale,
  llmSlug: string
): Promise<Prompt[]> {
  const prompts = await getAllPrompts(locale);
  return prompts.filter((prompt) => {
    return prompt.compatible_llms && prompt.compatible_llms.includes(llmSlug);
  });
}

/**
 * Get all prompts featuring a specific LLM
 * @param locale - The locale to get prompts for
 * @param llmSlug - The slug of the LLM to get featuring prompts for
 * @returns Array of prompts featuring the LLM
 */
export async function getPromptsByFeaturedLlm(
  locale: Locale,
  llmSlug: string
): Promise<Prompt[]> {
  const prompts = await getAllPrompts(locale);
  return prompts.filter((prompt) => {
    return prompt.featured_llms && prompt.featured_llms.includes(llmSlug);
  });
}

/**
 * Get all compatible LLMs for a prompt
 * @param locale - The locale to get LLMs for
 * @param prompt - The prompt to get compatible LLMs for
 * @returns Array of compatible LLMs
 */
export async function getCompatibleLlms(
  locale: Locale,
  prompt: Prompt
): Promise<LLM[]> {
  if (!prompt.compatible_llms || prompt.compatible_llms.length === 0) {
    return [];
  }
  
  const allLlms = await getAllLlms(locale);
  return allLlms.filter(llm => prompt.compatible_llms.includes(llm.slug));
}

/**
 * Get all featured LLMs for a prompt
 * @param locale - The locale to get LLMs for
 * @param prompt - The prompt to get featured LLMs for
 * @returns Array of featured LLMs
 */
export async function getFeaturedLlms(
  locale: Locale,
  prompt: Prompt
): Promise<LLM[]> {
  if (!prompt.featured_llms || prompt.featured_llms.length === 0) {
    return [];
  }
  
  const allLlms = await getAllLlms(locale);
  return allLlms.filter(llm => prompt.featured_llms?.includes(llm.slug));
}

/**
 * Check if content exists in all locales
 * This is useful for determining if a piece of content has been fully localized
 * @param contentType - The type of content to check
 * @param slug - The slug of the content to check
 * @returns Object mapping locales to boolean indicating existence
 */
export async function checkContentLocalization(
  contentType: ContentType,
  slug: string
): Promise<Record<Locale, boolean>> {
  const localizationStatus: Record<Locale, boolean> = {} as Record<Locale, boolean>;
  
  // Check each locale for the content
  await Promise.all(
    locales.map(async (locale: Locale) => {
      const content = await getContentBySlug(locale, contentType, slug);
      localizationStatus[locale] = content !== null;
    })
  );
  
  return localizationStatus;
}

/**
 * Get all unique LLMs across all locales with their localization status
 * This is useful for displaying a localization status dashboard
 * @returns Array of LLM slugs with their localization status
 */
export async function getAllLlmsWithLocalizationStatus(): Promise<{
  slug: string;
  localization: Record<Locale, boolean>;
  name: Record<Locale, string | null>;
}[]> {
  // Get all LLMs from all locales
  const llmsByLocale = await Promise.all(
    locales.map(async (locale: Locale) => {
      const llms = await getAllLlms(locale);
      return { locale, llms };
    })
  );
  
  // Get all unique LLM slugs
  const allLlmSlugs = new Set<string>();
  llmsByLocale.forEach(({ llms }) => {
    llms.forEach(llm => allLlmSlugs.add(llm.slug));
  });
  
  // Check localization status for each LLM
  const result = await Promise.all(
    Array.from(allLlmSlugs).map(async (slug) => {
      const localization = await checkContentLocalization('llms', slug);
      
      // Get name in each locale if available
      const name: Record<Locale, string | null> = {} as Record<Locale, string | null>;
      await Promise.all(
        locales.map(async (locale: Locale) => {
          const llm = await getLlmBySlug(locale, slug);
          name[locale] = llm ? llm.name : null;
        })
      );
      
      return { slug, localization, name };
    })
  );
  
  return result;
}

/**
 * Get all LLMs
 * @param locale - The locale to get LLMs for
 * @returns Array of LLMs
 */
export async function getAllLLMs(locale: Locale): Promise<LLM[]> {
  return getAllContent<LLM>(locale, 'llms');
}

/**
 * Get an LLM by slug
 * @param locale - The locale to get the LLM for
 * @param slug - The slug of the LLM to get
 * @returns The LLM or null if not found
 */
export async function getLLMBySlug(
  locale: Locale,
  slug: string
): Promise<LLM | null> {
  return getContentBySlug<LLM>(locale, 'llms', slug);
}

/**
 * Get all LLMs compatible with a prompt
 * @param locale - The locale to get LLMs for
 * @param prompt - The prompt to check compatibility for
 * @returns Array of compatible LLMs
 */
export async function getCompatibleLLMs(
  locale: Locale,
  prompt: Prompt
): Promise<LLM[]> {
  const allLLMs = await getAllLLMs(locale);
  return allLLMs.filter((llm) => 
    prompt.compatible_llms.includes(llm.slug)
  );
}

/**
 * Get all prompts compatible with an LLM
 * @param locale - The locale to get prompts for
 * @param llmSlug - The slug of the LLM to check compatibility for
 * @returns Array of compatible prompts
 */
export async function getPromptsByLLM(
  locale: Locale,
  llmSlug: string
): Promise<Prompt[]> {
  const prompts = await getAllPrompts(locale);
  return prompts.filter((prompt) => 
    prompt.compatible_llms.includes(llmSlug)
  );
}

/**
 * Get all featured LLMs for a prompt
 * @param locale - The locale to get LLMs for
 * @param prompt - The prompt to get featured LLMs for
 * @returns Array of featured LLMs
 */
export async function getFeaturedLLMs(
  locale: Locale,
  prompt: Prompt
): Promise<LLM[]> {
  // If no featured LLMs are specified, return compatible LLMs
  if (!prompt.featured_llms || prompt.featured_llms.length === 0) {
    return getCompatibleLLMs(locale, prompt);
  }
  
  const allLLMs = await getAllLLMs(locale);
  return allLLMs.filter((llm) => 
    prompt.featured_llms?.includes(llm.slug)
  );
}
