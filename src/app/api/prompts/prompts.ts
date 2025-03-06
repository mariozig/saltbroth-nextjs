import supabase from '@/lib/supabase';
import { unstable_cache } from 'next/cache';

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
