/**
 * LlmSample Component
 * 
 * This component displays a sample output from a specific LLM.
 * It's designed to be used within the LlmSampleTabs component.
 */

'use client';

import * as React from 'react';
import { getLLMBySlug } from '@/lib/content';
import { Locale, defaultLocale } from '@/config/i18n';

interface LlmSampleProps {
  slug: string;
  children: React.ReactNode;
}

export function LlmSample({ slug, children }: LlmSampleProps) {
  // This component is mainly a container for the sample content
  // The actual rendering is handled by the parent LlmSampleTabs component
  return <div>{children}</div>;
}

/**
 * LlmSampleTabs Component
 * 
 * This component provides a tabbed interface for viewing sample outputs
 * from different LLMs for the same prompt.
 */


interface LlmSampleTabsProps {
  children: React.ReactNode;
  locale?: Locale;
}

export function LlmSampleTabs({ 
  children, 
  locale = defaultLocale 
}: LlmSampleTabsProps) {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [llmNames, setLlmNames] = React.useState<Record<string, string>>({});
  
  // Extract LlmSample components from children
  const samples = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === LlmSample
  ) as React.ReactElement<LlmSampleProps>[];
  
  // Set the first sample as active if none is selected
  React.useEffect(() => {
    if (samples.length > 0 && !activeTab) {
      const firstSample = samples[0];
      if (firstSample && firstSample.props) {
        setActiveTab(firstSample.props.slug);
      }
    }
  }, [samples, activeTab]);
  
  // Load LLM names
  React.useEffect(() => {
    async function loadLlmNames() {
      const slugs = samples.map(sample => sample.props?.slug || '');
      const llmData: Record<string, string> = {};
      
      for (const slug of slugs) {
        try {
          const llm = await getLLMBySlug(locale, slug);
          if (llm) {
            llmData[slug] = llm.name;
          } else {
            llmData[slug] = slug; // Fallback to slug if LLM not found
          }
        } catch (error) {
          console.error(`Error loading LLM ${slug}:`, error);
          llmData[slug] = slug; // Fallback to slug on error
        }
      }
      
      setLlmNames(llmData);
    }
    
    loadLlmNames();
  }, [samples, locale]);
  
  // Render nothing if no samples
  if (samples.length === 0) {
    return null;
  }
  
  return (
    <div className="my-6 border border-gray-200 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {samples.map((sample) => (
          <button
            key={sample.props?.slug || ''}
            onClick={() => sample.props?.slug && setActiveTab(sample.props.slug)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === sample.props?.slug
                ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                : 'bg-gray-50 text-gray-600 hover:text-gray-900'
            }`}
          >
            {sample.props?.slug && (llmNames[sample.props.slug] || sample.props.slug)}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-4 bg-white">
        {samples.map((sample) => (
          <div
            key={sample.props?.slug || ''}
            className={activeTab === sample.props?.slug ? 'block' : 'hidden'}
          >
            {sample.props?.children}
          </div>
        ))}
      </div>
    </div>
  );
}
