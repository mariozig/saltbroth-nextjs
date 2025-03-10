/**
 * MDX Provider Component
 * 
 * This component provides all the custom MDX components to the MDX content.
 * It's used to wrap MDX content with the appropriate components and context.
 */

import * as React from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { Locale } from '@/config/i18n';

// Import custom MDX components
import PromptTemplate from './PromptTemplate';
import { LlmSample, LlmSampleTabs } from './LlmSample';
import LlmFeatures from './LlmFeatures';

interface MDXContentProps {
  source: string;
  locale: Locale;
  frontmatter?: Record<string, unknown>;
}

/**
 * Render MDX content with custom components
 */
export async function MDXContent({ 
  source, 
  locale,
  // Removed unused frontmatter parameter
}: MDXContentProps) {
  try {
    // Create the components object with proper context
    const components = {
      // Standard components
      PromptTemplate,
      LlmSample,
      
      // Components that need locale
      LlmSampleTabs: (props: { children: React.ReactNode }) => (
        <LlmSampleTabs locale={locale}>
          {props.children}
        </LlmSampleTabs>
      ),
      LlmFeatures: (props: { features: string[] }) => (
        <LlmFeatures features={props.features} locale={locale} />
      ),
    };

    // Evaluate the MDX content to a React component
    const { default: Content } = await evaluate(source, {
      ...runtime,
      development: process.env.NODE_ENV === 'development',
    });
    
    // Create component with components passed to it
    const MdxContent = () => <Content components={components} />;

    // Return the rendered content
    return (
      <div className="mdx-content">
        <MdxContent />
      </div>
    );
  } catch (error) {
    console.error('Error rendering MDX content:', error);
    return <div className="text-red-500">Error rendering content: {String(error)}</div>;
  }
}

/**
 * Process and render MDX content with frontmatter
 */
export async function processMDX(
  source: string,
  locale: Locale,
  frontmatter?: Record<string, unknown>
) {
  // Process and render the MDX content directly
  return MDXContent({
    source,
    locale,
    frontmatter
  });
}
