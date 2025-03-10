/**
 * LlmSample Component
 * 
 * This component displays a sample output from a specific LLM.
 * It's designed to be used within the LlmSampleTabs component.
 */

'use client';

import * as React from 'react';
import { Locale } from '@/config/i18n';

interface LlmSampleProps {
  slug: string;
  children: React.ReactNode;
}

export function LlmSample({ children }: Omit<LlmSampleProps, 'slug'>) {
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
  // Keeping locale as parameter for future use in translations
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
  
  // In a client component, we can't directly fetch server data with Node.js modules
  // Instead, we'll use the slugs directly as names or fetch from an API endpoint if needed
  React.useEffect(() => {
    // Create a mapping of slugs to display names
    // This is a simplified version that uses the slug as the display name
    const llmData: Record<string, string> = {};
    
    samples.forEach(sample => {
      const slug = sample.props?.slug || '';
      // Convert slug to a readable name (e.g., "llama-2" -> "Llama 2")
      const displayName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      llmData[slug] = displayName;
    });
    
    setLlmNames(llmData);
  }, [samples]);
  
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
