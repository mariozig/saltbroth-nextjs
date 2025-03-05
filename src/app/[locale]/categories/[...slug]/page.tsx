import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export default async function CategoryPage(props: PageProps) {
  const { slug = [] } = await props.params;
  const slugPath = slug.join('/');
  
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slugPath)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      notFound();
    }

    if (!category) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{category.name}</h1>
          <p className="text-gray-400">{category.description}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('slug');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return categories?.map((category) => ({
      slug: category.slug.split('/'),
    })) || [];
  } catch (error) {
    console.error('Unexpected error in generateStaticParams:', error);
    return [];
  }
}
