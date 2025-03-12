/**
 * Content utilities
 * 
 * This file contains utility functions for loading and processing MDX content files.
 * It provides functions for retrieving categories, prompts, and LLMs from the filesystem.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type Locale, locales } from '@/config/i18n';

// Import fs/promises for file operations instead of glob to avoid typing issues
import { readdir, readFile } from 'fs/promises';

// Define content types
export const CONTENT_TYPES = ['categories', 'prompts', 'llms'] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// Define base content interface
interface BaseContent {
  slug: string;
  locale: Locale;
  content: string;
}

// Define category interface
export interface Category extends BaseContent {
  name: string;
  description: string;
  icon: string;
  accentColor?: string;
  parentSlug?: string;
  path: string[];
}

// Define prompt interface
export interface Prompt extends BaseContent {
  title: string;
  description: string;
  category_slug: string;
  isPremium: boolean;
  icon: string;
  compatible_llms: string[];
  featured_llms?: string[];
  author?: string;
  date?: string;
  tags?: string[];
}

// Define LLM interface
export interface LLM extends BaseContent {
  name: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

/**
 * Get the path to an LLM icon
 */
export function getLlmIconPath(iconName: string): string {
  return `/images/llms/${iconName}`;
}

/**
 * Get the content directory
 */
function getContentDirectory(): string {
  return path.join(process.cwd(), 'content');
}

/**
 * Get the locale directory for the specified content type
 */
function getContentTypeDirectory(locale: Locale, contentType: ContentType): string {
  return path.join(getContentDirectory(), locale, contentType);
}

/**
 * Recursively get all MDX files in a directory
 */
async function getMdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getMdxFiles(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        return [fullPath];
      }
      return [];
    })
  );
  
  return files.flat();
}

/**
 * Get category path from file path
 */
function getCategoryPathFromFile(filePath: string, contentDir: string): string[] {
  const relativePath = path.relative(contentDir, path.dirname(filePath));
  return relativePath.split(path.sep).filter(Boolean);
}

/**
 * Get all content items of the specified type
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
  
  // Get all MDX files recursively
  const files = await getMdxFiles(contentDir);
  
  // Read and parse each file
  const items = await Promise.all(
    files.map(async (filePath: string) => {
      const fileContent = await readFile(filePath, 'utf8');
      const { data, content = '' } = matter(fileContent);
      
      // Get the slug from frontmatter or filename
      const slug = data.slug || path.basename(filePath, '.mdx');
      
      // Get category path for nested categories
      const categoryPath = getCategoryPathFromFile(filePath, contentDir);
      
      // Create base item with required fields
      const baseItem = {
        ...data,
        slug,
        locale,
        content,
      } as BaseContent & Record<string, unknown>;
      
      // Add category-specific fields
      if (contentType === 'categories') {
        const parentPath = categoryPath.slice(0, -1);
        baseItem.path = categoryPath;
        if (parentPath.length > 0) {
          baseItem.parentSlug = parentPath[parentPath.length - 1];
        }
      }
      
      return baseItem as T;
    })
  );
  
  return items;
}

/**
 * Get a specific content item by slug
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
 */
export async function getAllCategories(locale: Locale): Promise<Category[]> {
  return getAllContent<Category>(locale, 'categories');
}

/**
 * Get a category by slug
 * Will find categories regardless of their location in the directory structure
 */
export async function getCategoryBySlug(
  locale: Locale,
  slug: string
): Promise<Category | null> {
  // Get all categories, including nested ones
  const categories = await getAllCategories(locale);
  
  // First try to find an exact match
  const exactMatch = categories.find(category => category.slug === slug);
  if (exactMatch) {
    return exactMatch;
  }
  
  // If no exact match, look for a category in any directory with matching slug
  // This handles the case where we have categories with the same slug in different directories
  const categoryWithMatchingSlug = categories.find(category => {
    // For categories in subdirectories, the path property will include the full path
    const lastSegment = category.path && category.path.length > 0 
      ? category.path[category.path.length - 1] 
      : category.slug;
    
    return lastSegment === slug;
  });
  
  return categoryWithMatchingSlug || null;
}

/**
 * Get category breadcrumbs
 */
export async function getCategoryBreadcrumbs(
  locale: Locale,
  categorySlug: string
): Promise<Category[]> {
  const category = await getCategoryBySlug(locale, categorySlug);
  if (!category) return [];
  
  const breadcrumbs: Category[] = [];
  let currentCategory: Category | null = category;
  
  while (currentCategory) {
    breadcrumbs.unshift(currentCategory);
    if (currentCategory.parentSlug) {
      currentCategory = await getCategoryBySlug(locale, currentCategory.parentSlug);
    } else {
      break;
    }
  }
  
  return breadcrumbs;
}

/**
 * Get prompt breadcrumbs including its category hierarchy
 */
export async function getPromptBreadcrumbs(
  locale: Locale,
  promptSlug: string
): Promise<{ category: Category; prompt: Prompt | null }[]> {
  console.log('==== DEBUG: getPromptBreadcrumbs called with', { locale, promptSlug });
  
  const prompt = await getContentBySlug<Prompt>(locale, 'prompts', promptSlug);
  console.log('==== DEBUG: prompt found:', prompt ? 'YES' : 'NO', prompt ? {
    slug: prompt.slug,
    title: prompt.title,
    category_slug: prompt.category_slug,
    hasContent: !!prompt.content,
    keys: Object.keys(prompt)
  } : 'null');
  
  if (!prompt) return [];
  
  // Get the specified category
  console.log('==== DEBUG: Looking for category with slug:', prompt.category_slug);
  const category = await getCategoryBySlug(locale, prompt.category_slug);
  console.log('==== DEBUG: category found:', category ? 'YES' : 'NO', 
    category ? { slug: category.slug, path: category.path, parentSlug: category.parentSlug } : 'null');
  
  if (!category) {
    console.error('==== DEBUG: Category not found for slug:', prompt.category_slug);
    
    // List all available categories for debugging
    const allCategories = await getAllCategories(locale);
    console.log('==== DEBUG: All available categories:', 
      allCategories.map(c => ({ slug: c.slug, path: c.path, parentSlug: c.parentSlug })));
    
    return [];
  }
  
  // Get breadcrumbs for the category (this will traverse up the hierarchy)
  console.log('==== DEBUG: Getting breadcrumbs for category slug:', prompt.category_slug);
  const breadcrumbs = await getCategoryBreadcrumbs(locale, prompt.category_slug);
  console.log('==== DEBUG: breadcrumbs found:', breadcrumbs.length, 
    breadcrumbs.map(c => ({ slug: c.slug, path: c.path })));
  
  // Map to expected format
  return breadcrumbs.map((cat) => ({
    category: cat,
    prompt: cat.slug === prompt.category_slug ? prompt : null,
  }));
}

/**
 * Get all prompts
 */
export async function getAllPrompts(locale: Locale): Promise<Prompt[]> {
  return getAllContent<Prompt>(locale, 'prompts');
}

/**
 * Get all LLMs
 */
export async function getAllLlms(locale: Locale): Promise<LLM[]> {
  return getAllContent<LLM>(locale, 'llms');
}

/**
 * Get an LLM by slug
 */
export async function getLlmBySlug(
  locale: Locale,
  slug: string
): Promise<LLM | null> {
  return getContentBySlug<LLM>(locale, 'llms', slug);
}

/**
 * Get prompts by compatible LLM
 */
export async function getPromptsByCompatibleLlm(
  locale: Locale,
  llmSlug: string
): Promise<Prompt[]> {
  const prompts = await getAllPrompts(locale);
  return prompts.filter((prompt) => 
    prompt.compatible_llms.includes(llmSlug)
  );
}

/**
 * Check if content exists in all locales
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
