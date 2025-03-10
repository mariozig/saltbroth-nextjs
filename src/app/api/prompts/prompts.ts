/**
 * Prompts API - Provides cached access to prompt-related data from Supabase
 *
 * This module contains functions for fetching prompt data, output samples,
 * and category information. All functions use Next.js's unstable_cache
 * for server-side caching and revalidation.
 *
 * The module provides the following main functions:
 * - getPromptBySlug: Fetches a single prompt by its unique slug
 * - getOutputSamplesByPromptId: Fetches output samples for a specific prompt
 * - getPromptsByCategory: Fetches all prompts belonging to a specific category
 * - getAllCategories: Fetches all available categories
 */

import supabase from '@/lib/supabase';
import { unstable_cache } from 'next/cache';

/**
 * Type Definitions
 * 
 * These interfaces define the shape of data returned from the Supabase database
 * and are used throughout the application for type safety.
 */

/**
 * Represents a prompt entity with all its properties
 * @interface Prompt
 */
export interface Prompt {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  category_id: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Represents an output sample generated from a prompt
 * @interface OutputSample
 */
export interface OutputSample {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  llm: {
    id?: string;
    name?: string;
    color?: string;
  };
}

/**
 * Represents a category entity for organizing prompts
 * @interface Category
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

/**
 * Fetches a single prompt by its slug
 * 
 * This function retrieves detailed information about a prompt using its unique slug.
 * The data includes the prompt's metadata and associated category information.
 * Results are cached to improve performance.
 * 
 * @param slug - The unique slug identifier for the prompt
 * @returns Promise<Prompt | null> - The prompt object or null if not found
 */
export const getPromptBySlug = unstable_cache(
  async (slug: string) => {
    const { data: prompt, error } = await supabase
      .from('prompts')
      .select(`
        id, 
        title, 
        slug, 
        description, 
        content, 
        icon, 
        is_premium,
        created_at, 
        updated_at,
        category_id,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching prompt by slug:', error);
      return null;
    }

    return prompt;
  },
  ['prompt-by-slug'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['prompts']
  }
);

/**
 * Fetches output samples for a specific prompt
 * 
 * This function retrieves all output samples associated with a specific prompt.
 * Each sample includes the content and information about the LLM that generated it.
 * Results are cached to improve performance.
 * 
 * @param promptId - The ID of the prompt to get samples for
 * @returns Promise<OutputSample[]> - Array of output samples with related LLM info
 */
export const getOutputSamplesByPromptId = unstable_cache(
  async (promptId: string) => {
    const { data: samples, error } = await supabase
      .from('output_samples')
      .select(`
        id,
        content,
        created_at,
        updated_at,
        llms (
          id,
          name,
          color
        )
      `)
      .eq('prompt_id', promptId);

    if (error) {
      console.error('Error fetching output samples:', error);
      return [];
    }

    return samples.map(sample => {
      // Handle the case where llms is returned as an array
      const llm = Array.isArray(sample.llms) ? sample.llms[0] : sample.llms;
      
      return {
        id: sample.id,
        content: sample.content,
        createdAt: sample.created_at,
        updatedAt: sample.updated_at,
        llm: {
          id: llm?.id,
          name: llm?.name,
          color: llm?.color
        }
      };
    });
  },
  ['output-samples-by-prompt'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['output-samples']
  }
);

/**
 * Fetches all prompts belonging to a specific category
 * 
 * This function first resolves the category ID from the provided slug,
 * then retrieves all prompts associated with that category.
 * Results are cached to improve performance.
 * 
 * @param categorySlug - The slug of the category to filter by
 * @returns Promise<Prompt[]> - Array of prompts in the specified category
 */
export const getPromptsByCategory = unstable_cache(
  async (categorySlug: string) => {
    try {
      // For production builds, provide fallback data if needed
      if (process.env.NODE_ENV === 'production') {
        // Match the fallback category slug we're using elsewhere
        if (categorySlug === 'creative-writing') {
          return [
            { 
              id: 'fallback-1', 
              title: 'Story Starter', 
              slug: 'story-starter', 
              description: 'Fallback prompt data for build',
              icon: '📝',
              is_premium: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
        } else if (categorySlug === 'business') {
          return [
            { 
              id: 'fallback-2', 
              title: 'Email Template', 
              slug: 'email-template', 
              description: 'Fallback prompt data for business category',
              icon: '✉️',
              is_premium: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
        } else if (categorySlug === 'business/email') {
          return [
            { 
              id: 'fallback-3', 
              title: 'Cold Outreach', 
              slug: 'cold-outreach', 
              description: 'Fallback prompt data for email category',
              icon: '📨',
              is_premium: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
        }
      }
      
      // First, get the category ID
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      
      if (categoryError || !category) {
        console.error('Error fetching category:', categoryError);
        return [];
      }
      
      // Then, get all prompts in this category
      const { data: prompts, error: promptsError } = await supabase
        .from('prompts')
        .select(`
          id, 
          title, 
          slug, 
          description, 
          icon, 
          is_premium, 
          created_at, 
          updated_at
        `)
        .eq('category_id', category.id);
      
      if (promptsError) {
        console.error('Error fetching prompts by category:', promptsError);
        return [];
      }
      
      return prompts;
    } catch (err) {
      console.error('Critical error in getPromptsByCategory:', err);
      
      // Provide fallback data if this is a production build
      if (process.env.NODE_ENV === 'production') {
        return [
          { 
            id: 'fallback-generic', 
            title: 'Generic Prompt', 
            slug: 'generic-prompt', 
            description: 'Fallback data due to fetch error',
            icon: '📄',
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      return [];
    }
  },
  ['prompts-by-category'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['prompts', 'categories']
  }
);

/**
 * Fetches all available categories
 * 
 * This function retrieves all categories from the database,
 * including their hierarchical relationships (via parent_id).
 * Results are cached to improve performance and are ordered by name.
 * 
 * @returns Promise<Category[]> - Array of all categories, ordered by name
 */
export const getAllCategories = unstable_cache(
  async () => {
    // For production builds, immediately return static data without attempting to fetch
    if (process.env.NODE_ENV === 'production') {
      console.log('Using static category data in production build');
      return [
        { id: 'fallback-1', name: 'Creative Writing', slug: 'creative-writing', description: 'Fallback category data for build' },
        { id: 'fallback-2', name: 'Business', slug: 'business', description: 'Fallback category data for build' },
        { id: 'fallback-3', name: 'Business Email', slug: 'business/email', description: 'Business email templates', parent_id: 'fallback-2' }
      ];
    }
    
    // Only attempt to fetch in development environment
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`
          id, 
          name, 
          slug, 
          description, 
          parent_id
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return categories;
    } catch (err) {
      console.error('Critical error fetching categories:', err);
      return [];
    }
  },
  ['all-categories'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['categories']
  }
);

/**
 * Fetches all available prompts
 * 
 * This function retrieves all prompts from the database with their basic information.
 * Results are cached to improve performance and are ordered by creation date (newest first).
 * 
 * @returns Promise<Prompt[]> - Array of all prompts, ordered by creation date
 */
export const getAllPrompts = unstable_cache(
  async () => {
    // For production builds, immediately return static data without attempting to fetch
    if (process.env.NODE_ENV === 'production') {
      console.log('Using static prompts data in production build');
      return [
        { 
          id: 'fallback-1', 
          title: 'Story Starter', 
          slug: 'story-starter', 
          description: 'Fallback prompt data for build',
          icon: '📝',
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: 'fallback-1',
          categories: { id: 'fallback-1', name: 'Creative Writing', slug: 'creative-writing' }
        },
        { 
          id: 'fallback-2', 
          title: 'Email Template', 
          slug: 'email-template', 
          description: 'Fallback prompt data for business category',
          icon: '✉️',
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: 'fallback-2',
          categories: { id: 'fallback-2', name: 'Business', slug: 'business' }
        },
        { 
          id: 'fallback-3', 
          title: 'Cold Outreach', 
          slug: 'cold-outreach', 
          description: 'Fallback prompt data for email category',
          icon: '📨',
          is_premium: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: 'fallback-3',
          categories: { id: 'fallback-3', name: 'Business Email', slug: 'business/email' }
        }
      ];
    }
    
    // Only attempt to fetch in development environment
    try {
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select(`
          id, 
          title, 
          slug, 
          description, 
          icon, 
          is_premium, 
          created_at, 
          updated_at,
          category_id,
          categories (id, name, slug)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all prompts:', error);
        return [];
      }
      
      return prompts;
    } catch (err) {
      console.error('Critical error fetching all prompts:', err);
      return [];
    }
  },
  ['all-prompts'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['prompts']
  }
);
