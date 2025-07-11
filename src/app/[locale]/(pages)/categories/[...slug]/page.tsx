import { useTranslations } from 'next-intl';
import { Locale } from '@/config/i18n';
import Link from 'next/link';
import { getLocalizedHref } from '@/utils/locale';
import { getAllCategories, getAllPrompts, Category, Prompt } from '@/lib/content';
import { processMdxToHtml } from '@/lib/mdx';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Separate async function for data fetching with error handling
async function getCategoryData(locale: Locale, slugArray: string[]): Promise<{
  category: Category | null;
  subcategories: Category[];
  prompts: Prompt[];
  breadcrumbs: { name: string; slug: string }[];
  processedContent: string;
}> {
  try {
    // Join the slug array to form the full slug
    const fullSlug = slugArray.join('/');
    
    // Get all categories and prompts
    const allCategories = await getAllCategories(locale);
    const allPrompts = await getAllPrompts(locale);
    
    // Find the current category
    const category = allCategories.find(cat => cat.slug === fullSlug) || null;
    
    if (!category) {
      return {
        category: null,
        subcategories: [],
        prompts: [],
        breadcrumbs: [],
        processedContent: ''
      };
    }
    
    // Process MDX content
    const processedContent = await processMdxToHtml(category.content);
    
    // Find subcategories (categories whose slug starts with the current category's slug + '/')
    const subcategories = allCategories.filter(cat => 
      cat.slug.startsWith(`${fullSlug}/`) && 
      cat.slug.split('/').length === fullSlug.split('/').length + 1
    );
    
    // Find prompts that belong to this category
    const prompts = allPrompts.filter(prompt => prompt.category_slug === fullSlug);
    
    // Build breadcrumbs
    const breadcrumbs: { name: string; slug: string }[] = [];
    
    // Add each level of the category hierarchy to breadcrumbs
    const slugParts = fullSlug.split('/');
    for (let i = 0; i < slugParts.length; i++) {
      const partialSlug = slugParts.slice(0, i + 1).join('/');
      const breadcrumbCategory = allCategories.find(cat => cat.slug === partialSlug);
      
      if (breadcrumbCategory) {
        breadcrumbs.push({
          name: breadcrumbCategory.name,
          slug: breadcrumbCategory.slug
        });
      }
    }
    
    return {
      category,
      subcategories,
      prompts,
      breadcrumbs,
      processedContent
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      category: null,
      subcategories: [],
      prompts: [],
      breadcrumbs: [],
      processedContent: ''
    };
  }
}

/**
 * Generate metadata for the category page
 * 
 * This function creates SEO-friendly metadata for the category page, including:
 * - A title in the format "{category name} | SALTBROTH Prompts"
 * - Description based on the category's description
 * - Open Graph and Twitter card metadata
 * 
 * @param {Object} props - The component props
 * @param {Promise<{ slug: string[] }>} props.params - The route parameters
 * @returns {Promise<Metadata>} - The metadata object
 */
export async function generateMetadata({ params }: { 
  params: Promise<{ locale: Locale; slug: string[] }> 
}): Promise<Metadata> {
  // Await params before using them
  const { locale, slug } = await params;
  
  // Get category data
  const { category } = await getCategoryData(locale, slug);
  
  // If category not found, return basic metadata
  if (!category) {
    const messages = (await import(`../../../../../dictionaries/${locale}.json`)).default;
    return {
      title: messages.metadata.notFound,
      description: `The requested category could not be found.`,
    };
  }
  
  // Import messages for the current locale
  const messages = (await import(`../../../../../dictionaries/${locale}.json`)).default;
  
  // Format title using the template from messages
  const title = messages.metadata.titleTemplate.replace('{title}', category.name);
  
  return {
    title: title,
    description: category.description,
    openGraph: {
      title: title,
      description: category.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: Locale; slug: string[] }> }) {
  // Await the params promise to get the slug array
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const slug = resolvedParams.slug;
  
  // Fetch category data
  const { category, subcategories, prompts, breadcrumbs, processedContent } = 
    await getCategoryData(locale, slug);
  
  // If category not found, return 404
  if (!category) {
    notFound();
  }
  
  // Determine accent color based on the category depth
  const depth = category.slug.split('/').length;
  
  return (
    <CategoryPageContent 
      locale={locale}
      category={category}
      subcategories={subcategories}
      prompts={prompts}
      breadcrumbs={breadcrumbs}
      processedContent={processedContent}
      depth={depth}
    />
  );
}

// Client component for rendering with hooks
function CategoryPageContent({ 
  locale,
  category, 
  subcategories, 
  prompts, 
  breadcrumbs, 
  processedContent,
  depth
}: { 
  locale: Locale;
  category: Category;
  subcategories: Category[];
  prompts: Prompt[];
  breadcrumbs: { name: string; slug: string }[];
  processedContent: string;
  depth: number;
}) {
  const t = useTranslations('prompts');
  const commonT = useTranslations('common');
  const categoriesT = useTranslations('Categories');
  const accentIndex = ((depth - 1) % 5) + 1;
  const accentClass = `accent-${accentIndex}00`;
  
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-24 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-2 text-base font-medium text-gray-400">
            <Link href={getLocalizedHref('/categories', locale)} className="hover:text-white transition-colors">
              {categoriesT('categories')}
            </Link>
            
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.slug} className="flex items-center">
                <span className="mx-2">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.name}</span>
                ) : (
                  <Link 
                    href={getLocalizedHref(`/categories/${crumb.slug}`, locale)}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-3xl p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-${accentClass}/10 flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas fa-${category.icon} text-3xl sm:text-4xl text-${accentClass}`}></i>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{category.name}</h1>
                  <p className="text-xl text-gray-400 max-w-3xl">
                    {category.description}
                  </p>
                  
                  {/* Display processed MDX content if available */}
                  {processedContent && (
                    <div className="mt-6 text-gray-300 prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Grid (if any) */}
        {subcategories.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">{categoriesT('subcategories')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subcategories.map((subcat, index) => {
                  // Determine accent color based on index
                  const subcatAccentIndex = ((depth + index) % 5) + 1;
                  const subcatAccentClass = `accent-${subcatAccentIndex}00`;
                  
                  return (
                    <Link 
                      key={subcat.slug}
                      href={getLocalizedHref(`/categories/${subcat.slug}`, locale)}
                      className={`category-card glass rounded-3xl p-8 hover:bg-${subcatAccentClass}/5 cursor-pointer group`}
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-${subcatAccentClass}/10 flex items-center justify-center`}>
                          <i className={`fas fa-${subcat.icon} text-2xl text-${subcatAccentClass}`}></i>
                        </div>
                        <h3 className={`text-2xl font-bold text-white group-hover:text-${subcatAccentClass} transition-colors`}>
                          {subcat.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-6">{subcat.description}</p>
                      
                      <div className="flex items-center justify-end mt-6">
                        <span className={`text-${subcatAccentClass} border-b border-transparent group-hover:border-${subcatAccentClass} pb-0.5`}>
                          {commonT('seeMore')} <i className="fas fa-arrow-right ml-2"></i>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Prompts Grid (if any) */}
        {prompts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">{t('promptsInCategory')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {prompts.map((prompt, index) => {
                  // Determine accent color based on index
                  const promptAccentIndex = ((depth + index) % 5) + 1;
                  const promptAccentClass = `accent-${promptAccentIndex}00`;
                  
                  return (
                    <Link 
                      key={prompt.slug}
                      href={getLocalizedHref(`/prompts/${prompt.slug}`, locale)}
                      className={`prompt-card glass rounded-3xl p-8 hover:bg-${promptAccentClass}/5 cursor-pointer group`}
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-${promptAccentClass}/10 flex items-center justify-center`}>
                          <i className={`fas fa-${prompt.icon || 'file-alt'} text-2xl text-${promptAccentClass}`}></i>
                        </div>
                        <h3 className={`text-2xl font-bold text-white group-hover:text-${promptAccentClass} transition-colors`}>
                          {prompt.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 mb-6">{prompt.description}</p>
                      
                      {prompt.isPremium && (
                        <div className="mb-4">
                          <span className="bg-yellow-600/20 text-yellow-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {t('premium')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end mt-6">
                        <span className={`text-${promptAccentClass} border-b border-transparent group-hover:border-${promptAccentClass} pb-0.5`}>
                          {commonT('seeMore')} <i className="fas fa-arrow-right ml-2"></i>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        
        {/* No content message if no subcategories and no prompts */}
        {subcategories.length === 0 && prompts.length === 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto text-center">
              <div className="glass rounded-3xl p-8 sm:p-12">
                <h2 className="text-2xl font-bold mb-4">{categoriesT('noContentYet')}</h2>
                <p className="text-gray-400">
                  {categoriesT('contentComingSoon')}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
