import { getContentBySlug, getPromptBreadcrumbs, type Prompt, type LLM } from '@/lib/content';
import { type Locale } from '@/config/i18n';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { LlmSampleTabs } from '@/components/prompts/LlmSampleTabs';
import { LlmSample } from '@/components/prompts/LlmSample';
import { extractComponentContent } from '@/lib/mdx-utils';
import PromptTemplate from '@/components/prompts/PromptTemplate';
import { Metadata } from 'next';

function getLlmColor(slug: string): string {
  // Sample colors for different LLMs
  const colors: Record<string, string> = {
    'chatgpt': '#10a37f',
    'claude': '#965df5',
    'llama': '#ff6700',
    'default': '#ffffff'
  };
  return colors[slug] || colors.default;
}

function getLlmSampleContent(slug: string): string {
  // Sample content for different LLMs
  const samples: Record<string, string> = {
    'chatgpt': 'This is a sample output from ChatGPT...',
    'claude': 'Claude AI responding to your prompt...',
    'llama': 'Llama 3 generating creative content...',
    'default': 'Sample LLM output text'
  };
  return samples[slug] || samples.default;
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
  console.log('==== DEBUG: Starting prompt page with manual content extraction');
  
  // Await params before using them
  const { locale, slug } = await params;
  console.log('==== DEBUG: Got params', { locale, slug });
  
  // Get prompt and its breadcrumbs
  console.log('==== DEBUG: Loading prompt', { locale, slug });
  const prompt = await getContentBySlug<Prompt>(locale, 'prompts', slug);
  console.log('==== DEBUG: Prompt loaded', prompt ? 'YES' : 'NO');
  
  if (!prompt) {
    console.log('==== DEBUG: Prompt not found, returning 404');
    notFound();
  }

  // Manually extract component content from the MDX
  const descriptionContent = extractComponentContent(prompt.content, 'PromptDescription');
  const instructionsContent = extractComponentContent(prompt.content, 'PromptInstructions');
  const templateContent = extractComponentContent(prompt.content, 'PromptTemplate');
  const tipsContent = extractComponentContent(prompt.content, 'PromptTips');

  console.log('==== DEBUG: Extracted content sections');

  // Safely get breadcrumbs, handling potential errors
  let breadcrumbItems = [];
  try {
    console.log('==== DEBUG: Getting breadcrumbs');
    const breadcrumbs = await getPromptBreadcrumbs(locale, slug);
    console.log('==== DEBUG: Breadcrumbs loaded', { count: breadcrumbs.length });
    
    // Start with Home
    breadcrumbItems = [
      { label: 'Home', href: '/' },
      // Add category hierarchy
      ...breadcrumbs.map(({ category }) => ({
        label: category.name,
        href: `/categories/${category.slug}`,
      })),
      // Add the current prompt as the final item (marked as current)
      { label: prompt.title, href: `/prompts/${prompt.slug}`, isCurrent: true }
    ];
  } catch (error) {
    console.error(`==== DEBUG: Error getting breadcrumbs for prompt ${slug}:`, error);
    breadcrumbItems = [{ label: 'Home', href: '/' }];
  }

  // Get featured LLMs if specified in frontmatter
  const featuredLlms = prompt.featured_llms || [];
  const llmSamples = await Promise.all(
    featuredLlms.map(async (llmSlug) => {
      try {
        return await getContentBySlug<LLM>(locale, 'llms', llmSlug);
      } catch (error) {
        console.error(`==== DEBUG: Error loading LLM ${llmSlug}:`, error);
        return null;
      }
    })
  );

  // Filter out null values and ensure we have valid LLMs
  const validLlms = llmSamples.filter((llm): llm is LLM => llm !== null);

  console.log('==== DEBUG: Rendering page');
  
  try {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {prompt.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-12">
          {prompt.compatible_llms && prompt.compatible_llms.map((llmSlug: string) => (
            <span
              key={llmSlug}
              className="px-3 py-1 rounded-full bg-white/5 text-sm font-medium"
            >
              {llmSlug}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none mb-16">
          {/* Display extracted content sections */}
          {descriptionContent && (
            <div className="glass-morphism rounded-3xl p-8 mb-12 relative">
              <div className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                {descriptionContent}
              </div>
            </div>
          )}
          
          {instructionsContent && (
            <div className="glass-morphism rounded-3xl p-8 mb-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-accent-100/10 flex items-center justify-center">
                  <i className="fas fa-list-ol text-accent-100"></i>
                </div>
                <h2 className="text-2xl font-bold">Instructions</h2>
              </div>
              <div className="prose prose-invert">
                {instructionsContent}
              </div>
            </div>
          )}
          
          {templateContent && (
            <PromptTemplate content={templateContent} />
          )}
          
          {tipsContent && (
            <div className="glass-morphism rounded-3xl p-8 mt-8 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-accent-100/10 flex items-center justify-center">
                  <i className="fas fa-lightbulb text-accent-100"></i>
                </div>
                <h2 className="text-2xl font-bold">Tips & Tricks</h2>
              </div>
              <div className="prose prose-invert">
                {tipsContent}
              </div>
            </div>
          )}
        </div>

        {/* LLM Sample Outputs */}
        {validLlms.length > 0 && (
          <LlmSampleTabs>
            {validLlms.map((llm) => (
              <LlmSample
                key={llm.slug}
                slug={llm.name || llm.slug}
                color={getLlmColor(llm.slug)}
              >
                {getLlmSampleContent(llm.slug)}
              </LlmSample>
            ))}
          </LlmSampleTabs>
        )}
      </div>
    );
  } catch (error) {
    console.error('==== DEBUG: Error in final rendering:', error);
    return <div>Error rendering page: {error instanceof Error ? error.message : String(error)}</div>;
  }
}