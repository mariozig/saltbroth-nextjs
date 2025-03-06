/**
 * Prompts API - Provides cached access to prompt-related data from Supabase
 *
 * This module contains functions for fetching prompt data, output samples,
 * and category information. All functions use Next.js's unstable_cache
 * for server-side caching and revalidation.
 */

import supabase from '@/lib/supabase';
import { unstable_cache } from 'next/cache';

/**
 * Type Definitions
 */

interface Prompt {
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

interface OutputSample {
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

/**
 * Fetches a single prompt by its slug
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
 * @param categorySlug - The slug of the category to filter by
 * @returns Promise<Prompt[]> - Array of prompts in the specified category
 */
export const getPromptsByCategory = unstable_cache(
  async (categorySlug: string) => {
    
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
  },
  ['prompts-by-category'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['prompts', 'categories']
  }
);

/**
 * Fetches all available categories
 * @returns Promise<Category[]> - Array of all categories, ordered by name
 */
export const getAllCategories = unstable_cache(
  async () => {
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
  },
  ['all-categories'],
  {
    revalidate: 60 * 60, // Revalidate every hour
    tags: ['categories']
  }
);
