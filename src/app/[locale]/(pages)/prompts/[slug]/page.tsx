import { getContentBySlug, getPromptBreadcrumbs, type Prompt, type LLM } from '@/lib/content';
import { type Locale, defaultLocale } from '@/config/i18n';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LlmSampleTabs } from '@/components/prompts/LlmSampleTabs';
import { LlmSample } from '@/components/prompts/LlmSample';
import { extractComponentContent, extractLlmSamples } from '@/lib/mdx-utils';
import PromptTemplate from '@/components/prompts/PromptTemplate';
import { Metadata } from 'next';
import React from 'react';

function getLlmColor(slug: string): string {
  // Sample colors for different LLMs
  const colors: Record<string, string> = {
    'chatgpt': '#10a37f',
    'claude': '#8e44ef',
    'llama': '#4f46e5',
    'default': '#ffffff'
  };
  return colors[slug] || colors.default;
}

/**
 * Generate metadata for the prompt page
 * 
 * This function creates SEO-friendly metadata for the prompt page, including:
 * - A title in the format "{prompt title} - {category} | SALTBROTH Prompts"
 * - Description based on the prompt's description
 * - Open Graph and Twitter card metadata
 * 
 * @param {Object} props - The component props
 * @param {Promise<{ locale: Locale; slug: string }>} props.params - The route parameters
 * @returns {Promise<Metadata>} - The metadata object
 */
export async function generateMetadata({ params }: { 
  params: Promise<{ locale: Locale; slug: string }> 
}): Promise<Metadata> {
  // Await params before using them
  const { locale, slug } = await params;
  
  // Get prompt data
  const prompt = await getContentBySlug<Prompt>(locale, 'prompts', slug);
  
  // If prompt not found, return basic metadata
  if (!prompt) {
    const messages = (await import(`../../../../../dictionaries/${locale}.json`)).default;
    return {
      title: messages.metadata.notFound,
      description: `The requested prompt could not be found.`,
    };
  }
  
  // Get breadcrumbs to extract category
  const breadcrumbs = await getPromptBreadcrumbs(locale, slug);
  const categoryName = breadcrumbs.length > 0 ? breadcrumbs[0].category.name : '';
  
  // Import messages for the current locale
  const messages = (await import(`../../../../../dictionaries/${locale}.json`)).default;
  
  // Format title using the template from messages
  const title = messages.metadata.promptTitleTemplate
    .replace('{title}', prompt.title)
    .replace('{category}', categoryName);
  
  // Extract description from prompt content or use the first 160 characters
  const description = prompt.description || prompt.content.substring(0, 160).replace(/[#*]/g, '');
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      publishedTime: prompt.date,
      authors: prompt.author ? [prompt.author] : undefined,
      tags: prompt.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  };
}

// Next.js 15 uses Promise-based params
export default async function PromptPage({ params }: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  // Await params before using them
  const { locale, slug } = await params;
  
  // Get prompt and its breadcrumbs
  const prompt = await getContentBySlug<Prompt>(locale, 'prompts', slug);
  
  if (!prompt) {
    notFound();
  }

  // Manually extract component content from the MDX
  const descriptionContent = extractComponentContent(prompt.content, 'PromptDescription');
  const instructionsContent = extractComponentContent(prompt.content, 'PromptInstructions');
  const templateContent = extractComponentContent(prompt.content, 'PromptTemplate');
  
  // Debug the extracted content
  console.log('Extracted content:');
  console.log('- Description:', descriptionContent ? 'Found' : 'Not found');
  console.log('- Instructions:', instructionsContent ? 'Found' : 'Not found');
  console.log('- Template:', templateContent ? 'Found' : 'Not found');
  
  // Extract LLM samples from the MDX content
  const llmSamples = extractLlmSamples(prompt.content);

  // Import messages for the current locale
  const messages = (await import(`../../../../../dictionaries/${locale}.json`)).default;

  // Helper function to create locale-aware URLs
  const getLocalizedPath = (path: string) => {
    // Only add locale prefix for non-default locales
    return locale === defaultLocale ? path : `/${locale}${path}`;
  };

  // Safely get breadcrumbs, handling potential errors
  let breadcrumbItems: Array<{ label: string; href: string; isCurrent?: boolean }> = [];
  try {
    const breadcrumbs = await getPromptBreadcrumbs(locale, slug);
    
    // Start with Home
    breadcrumbItems = [
      { label: 'Home', href: getLocalizedPath('/') },
      // Add category hierarchy
      ...breadcrumbs.map(({ category }) => ({
        label: category.name,
        href: getLocalizedPath(`/categories/${category.slug}`),
      })),
      // Add the current prompt as the final item (marked as current)
      { label: prompt.title, href: getLocalizedPath(`/prompts/${prompt.slug}`), isCurrent: true }
    ];
  } catch (error) {
    console.error(`Error getting breadcrumbs for prompt ${slug}:`, error);
    breadcrumbItems = [{ label: 'Home', href: getLocalizedPath('/') }];
  }

  // Get featured LLMs if specified in frontmatter
  const featuredLlms = prompt.featured_llms || [];
  const llmData = await Promise.all(
    featuredLlms.map(async (llmSlug) => {
      try {
        return await getContentBySlug<LLM>(locale, 'llms', llmSlug);
      } catch (error) {
        console.error(`Error loading LLM ${llmSlug}:`, error);
        return null;
      }
    })
  );

  // Filter out null values and ensure we have valid LLMs
  const validLlms = llmData.filter((llm): llm is LLM => llm !== null);
  
  try {
    return (
      <>
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-accent-100/5 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)]"></div>
          <div className="noise-pattern"></div>
        </div>

        <main className="pt-32 px-4 pb-12">
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-100/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-200/10 rounded-full blur-3xl"></div>
              
              {/* Main content */}
              <div className="relative">
                {/* Breadcrumbs */}
                <nav aria-label="Category navigation" className="mb-4">
                  <div className="flex items-center gap-3 opacity-80">
                    {breadcrumbItems.map((item, index) => (
                      <React.Fragment key={item.href}>
                        {index > 0 && (
                          <svg className="w-2.5 h-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {item.isCurrent ? (
                          <span className="relative text-sm text-accent-100 font-medium">
                            <span className="relative">{item.label}</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-accent-100/0 via-accent-100 to-accent-100/0"></span>
                          </span>
                        ) : (
                          <a href={item.href} className="relative text-sm text-gray-400 hover:text-white transition-colors group">
                            <span className="relative">{item.label}</span>
                            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 group-hover:via-white/40 transition-all"></span>
                          </a>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </nav>
                
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-space font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 mb-8">
                  {prompt.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-normal leading-relaxed mb-4">
                  {prompt.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-12">
                  {prompt.compatible_llms && prompt.compatible_llms.map((llmSlug: string) => (
                    <span
                      key={llmSlug}
                      className="px-3 py-1 rounded-full bg-white/5 text-sm font-medium"
                    >
                      {llmSlug}
                    </span>
                  ))}
                  {prompt.isPremium && (
                    <span className="px-3 py-1 rounded-full bg-accent-100/20 text-accent-100 text-sm font-medium">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Two-column layout */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Prompt Section */}
            {templateContent && (
              <PromptTemplate 
                content={templateContent}
                description={descriptionContent}
                instructions={instructionsContent}
              />
            )}

            {/* LLM Outputs */}
            {llmSamples.length > 0 ? (
              <LlmSampleTabs>
                {llmSamples.map((sample) => (
                  <LlmSample
                    key={sample.slug}
                    slug={sample.slug}
                    color={sample.color}
                  >
                    {sample.content}
                  </LlmSample>
                ))}
              </LlmSampleTabs>
            ) : (
              validLlms.length > 0 && (
                <div className="glass-morphism rounded-3xl p-8 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-accent-100/10 flex items-center justify-center">
                      <i className="fas fa-robot text-accent-100"></i>
                    </div>
                    <h2 className="text-2xl font-bold font-space">No LLM Samples</h2>
                  </div>
                  <p className="text-gray-400">
                    This prompt has compatible LLMs but no sample outputs have been provided.
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error('Error in final rendering:', error);
    return <div>Error rendering page: {error instanceof Error ? error.message : String(error)}</div>;
  }
}