/**
 * MDX Provider Component
 * 
 * This component provides all the custom MDX components to the MDX content.
 * It's used to wrap MDX content with the appropriate components and context.
 */

import * as React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Locale } from '@/config/i18n';

// Import custom MDX components
import PromptTemplate from './PromptTemplate';
import { LlmSample, LlmSampleTabs } from './LlmSample';
import LlmFeatures from './LlmFeatures';

// Define the components object for MDX
const components = {
  PromptTemplate,
  LlmSample,
  LlmSampleTabs,
  LlmFeatures,
};

interface MDXContentProps {
  source: string;
  locale: Locale;
  frontmatter?: Record<string, any>;
}

/**
 * Render MDX content with custom components
 */
export async function MDXContent({ 
  source, 
  locale,
  frontmatter 
}: MDXContentProps) {
  // Add locale to all components that need it
  const componentsWithContext = {
    ...components,
    LlmSampleTabs: (props: any) => (
      <LlmSampleTabs {...props} locale={locale} />
    ),
    LlmFeatures: (props: any) => (
      <LlmFeatures {...props} locale={locale} />
    ),
  };

  // Serialize the MDX content
  const mdxSource = await serialize(source, {
    parseFrontmatter: false, // We already parsed frontmatter
  });

  return (
    <div className="mdx-content">
      <MDXRemote {...mdxSource} components={componentsWithContext} />
    </div>
  );
}

/**
 * Process and render MDX content with frontmatter
 */
export async function processMDX(
  source: string,
  locale: Locale,
  frontmatter?: Record<string, any>
) {
  // Return the processed data for the MDXContent component
  return {
    source,
    locale,
    frontmatter,
  };
}
