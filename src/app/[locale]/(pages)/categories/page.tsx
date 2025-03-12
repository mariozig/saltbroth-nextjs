import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Locale } from '@/config/i18n';
import Link from 'next/link';
import { getLocalizedHref } from '@/utils/locale';
import { getAllCategories, Category } from '@/lib/content';
import Footer from '@/components/Footer';
import { use } from 'react';

// Separate async function for data fetching with error handling
async function getCategories(locale: Locale): Promise<Category[]> {
  try {
    // Use the MDX-based content loading system
    return await getAllCategories(locale);
  } catch (error) {
    console.error('Error fetching categories for categories page:', error);
    // Provide fallback data in case of error
    return [
      { 
        name: 'Creative Writing', 
        slug: 'creative-writing', 
        description: 'Prompts for creative writing and storytelling',
        icon: 'pen-nib',
        locale: locale,
        content: '',
        path: ['creative-writing']
      },
      { 
        name: 'Business Marketing', 
        slug: 'business-marketing', 
        description: 'Tools to improve your business marketing content',
        icon: 'bullhorn',
        locale: locale,
        content: '',
        path: ['business-marketing']
      },
      { 
        name: 'Professional', 
        slug: 'professional', 
        description: 'Professional communication templates',
        icon: 'briefcase',
        locale: locale,
        content: '',
        path: ['professional']
      }
    ];
  }
}

export default function CategoriesPage() {
  const t = useTranslations('prompts');
  const commonT = useTranslations('common');
  const locale = useLocale();
  
  // Fetch categories data using React's use() hook for data fetching with error handling
  const categories = use(getCategories(locale as Locale));

  // Filter to only show top-level categories (those without a / in the slug)
  const rootCategories = categories.filter(category => !category.slug.includes('/'));

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text glow leading-tight pb-2">
              {t('browseCategories')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('browseCategoriesDescription')}
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="px-6 mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('searchPrompts')}
                className="w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/5 transition-all"
              />
              <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </section>

        {/* Root Categories */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rootCategories.map((category, index) => {
                // Determine accent color based on index
                const accentIndex = (index % 5) + 1;
                const accentClass = `accent-${accentIndex}00`;
                
                return (
                  <Link 
                    key={category.slug}
                    href={getLocalizedHref(`/categories/${category.slug}`, locale)}
                    className={`category-card glass rounded-3xl p-8 hover:bg-${accentClass}/5 cursor-pointer group`}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-${accentClass}/10 flex items-center justify-center`}>
                        <i className={`fas fa-${category.icon} text-2xl text-${accentClass}`}></i>
                      </div>
                      <h3 className={`text-2xl font-bold text-white group-hover:text-${accentClass} transition-colors`}>
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-6">{category.description}</p>
                    
                    {/* Find subcategories for this category */}
                    <div className="space-y-3">
                      {categories
                        .filter(subcat => subcat.slug.startsWith(`${category.slug}/`) && subcat.slug.split('/').length === 2)
                        .slice(0, 3)
                        .map(subcat => (
                          <div key={subcat.slug} className="flex items-center text-sm text-gray-400">
                            <span className={`w-1.5 h-1.5 rounded-full bg-${accentClass}/30 mr-3`}></span>
                            {subcat.name}
                          </div>
                        ))
                      }
                    </div>
                    
                    <div className="flex items-center justify-end mt-6">
                      <span className={`text-${accentClass} border-b border-transparent group-hover:border-${accentClass} pb-0.5`}>
                        {commonT('seeMore')} <i className="fas fa-arrow-right ml-2"></i>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
