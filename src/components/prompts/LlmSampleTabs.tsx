'use client';

import React, { useState, Children, isValidElement, ReactElement } from 'react';
import { useTranslations } from 'next-intl';

interface LlmSampleProps {
  slug: string;
  color: string;
  children: React.ReactNode;
}

interface LlmSampleTabsProps {
  children: React.ReactElement<LlmSampleProps> | React.ReactElement<LlmSampleProps>[];
}

/**
 * LlmSampleTabs Component
 * 
 * Renders a tabbed interface for displaying sample outputs from different LLMs.
 * Each tab represents a different LLM's output with appropriate styling and color coding.
 */
export function LlmSampleTabs({ children }: LlmSampleTabsProps) {
  const t = useTranslations('prompts');
  const [activeTab, setActiveTab] = useState(0);
  
  // Ensure children is always an array and handle potential undefined values
  const childrenArray = Children.toArray(children);
  const samples = childrenArray.filter(
    (child): child is ReactElement<LlmSampleProps> => {
      if (!isValidElement(child)) return false;
      const props = child.props as Partial<LlmSampleProps>;
      return props && typeof props.slug === 'string' && typeof props.color === 'string';
    }
  );
  
  // If no valid samples, return empty div to prevent errors
  if (samples.length === 0) {
    return <div className="glass-morphism rounded-3xl p-8">No sample outputs available</div>;
  }

  return (
    <div className="glass-morphism rounded-3xl p-8 relative group">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-200/10 via-accent-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <h2 className="font-space text-2xl font-bold tracking-tight mb-6">{t('sampleOutputs')}</h2>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {samples.map((sample, index) => {
            try {
              return (
                <button
                  key={sample.props.slug}
                  onClick={() => setActiveTab(index)}
                  className={`llm-tab px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === index 
                      ? 'bg-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{
                    '--tab-color': sample.props.color,
                    color: activeTab === index ? sample.props.color : undefined,
                    backgroundColor: activeTab === index ? `${sample.props.color}10` : undefined,
                  } as React.CSSProperties}
                >
                  <span className="relative">
                    {sample.props.slug.charAt(0).toUpperCase() + sample.props.slug.slice(1)}
                  </span>
                </button>
              );
            } catch (error) {
              console.error('Error rendering tab button:', error);
              return null;
            }
          })}
        </div>

        {/* Tab Content */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-100/20 via-accent-200/20 to-accent-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          {samples.map((sample, index) => {
            try {
              return (
                <div
                  key={sample.props.slug}
                  className={`transition-all duration-200 ${
                    activeTab === index 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-2 absolute top-0 left-0 pointer-events-none'
                  }`}
                  style={{ display: activeTab === index ? 'block' : 'none' }}
                >
                  <div className="relative flex items-center gap-2 px-4 py-3 rounded-t-xl bg-white/5 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                    </div>
                    <span className="text-xs text-gray-500">{`${sample.props.slug}-output.txt`}</span>
                  </div>
                  <pre 
                    className="font-mono text-[15px] whitespace-pre-wrap leading-relaxed tracking-tight p-6 rounded-b-xl bg-black/20 border border-white/10 border-t-0"
                    style={{ color: `${sample.props.color}dd` }}
                  >
                    {sample.props.children}
                  </pre>
                </div>
              );
            } catch (error) {
              console.error('Error rendering tab content:', error);
              return (
                <div key={`error-${index}`} className="p-4 bg-red-500/20 rounded-xl">
                  Error displaying content
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
