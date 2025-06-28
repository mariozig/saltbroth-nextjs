'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LlmSampleProps {
  slug: string;
  color: string;
  children: React.ReactNode;
}

// Define a type for the props we expect to extract from children
interface LlmSampleChildProps {
  slug: string;
  color: string;
  children?: React.ReactNode;
}

type LlmSampleTabsProps = {
  children: React.ReactNode;
};

type TabInfo = {
  slug: string;
  color: string;
};

/**
 * Component for displaying LLM sample outputs in a tabbed interface
 * Used on prompt detail pages to show different LLM responses
 */
export function LlmSampleTabs({ children }: LlmSampleTabsProps) {
  const t = useTranslations('prompts');
  const [activeTab, setActiveTab] = useState(0);
  
  // Convert children to array for easier handling
  const childrenArray = React.Children.toArray(children);
  
  // Extract tab information from children
  const tabs: TabInfo[] = childrenArray.map((child) => {
    if (
      React.isValidElement(child) && 
      child.props && 
      typeof child.props === 'object' && 
      'slug' in child.props && 
      'color' in child.props
    ) {
      return {
        slug: child.props.slug as string,
        color: child.props.color as string,
      };
    }
    return { slug: '', color: '' };
  });
  
  // Handle tab click
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  
  return (
    <section className="glass-morphism rounded-3xl p-8 relative group">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-200/10 via-accent-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative space-y-6">
        {/* Example Outputs Title */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="font-space text-2xl font-bold tracking-tight">{t('exampleOutputs')}</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6">{t('sampleOutputsDescription')}</p>
        
        {/* Output Tabs */}
        <div className="relative flex flex-col">
          <div className="flex flex-wrap gap-0 relative">
            {tabs.map((tab, index) => (
              <button 
                key={`${tab.slug}-${index}`}
                className={`llm-tab ${activeTab === index ? 'active' : ''} group`} 
                data-tab={tab.slug}
                onClick={() => handleTabClick(index)}
                style={activeTab === index ? {"--tab-color": tab.color} as React.CSSProperties : undefined}
              >
                <span className="relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: tab.color}}></span>
                  {tab.slug ? (tab.slug.charAt(0).toUpperCase() + tab.slug.slice(1)) : 'Sample'}
                  <span 
                    className={`absolute inset-x-0 -bottom-px h-0.5 ${activeTab === index ? '' : 'opacity-0 transition-opacity group-hover:opacity-100'}`} 
                    style={{backgroundColor: tab.color}}
                  ></span>
                </span>
              </button>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
          </div>
          <div className="relative mt-4">
            <div className="absolute -inset-3 bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity"></div>
          </div>
        </div>
        
        {/* Output Panels */}
        <div className="relative">
          {childrenArray.map((child, index) => {
            if (
              React.isValidElement(child) && 
              child.props && 
              typeof child.props === 'object' && 
              'slug' in child.props && 
              'color' in child.props
            ) {
              // Cast child.props to the expected type to handle TS type checking
              const childProps = child.props as LlmSampleChildProps;
              const slug = childProps.slug;
              const color = childProps.color;
              const content = childProps.children;
              
              return (
                <div 
                  key={`${slug}-panel-${index}`}
                  id={`${slug}-panel`}
                  className={`llm-panel ${activeTab !== index ? 'hidden' : ''}`}
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></span>
                      <span className="font-space font-bold tracking-tight">
                        {slug ? (slug.charAt(0).toUpperCase() + slug.slice(1)) : 'Sample'}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        if (content) {
                          navigator.clipboard.writeText(String(content));
                          // Could add a toast notification here
                        }
                      }} 
                      className="copy-btn text-gray-400 hover:text-white transition-colors"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-[15px] text-gray-400 whitespace-pre-wrap leading-relaxed tracking-tight">
                    {content}
                  </pre>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Component for displaying a single LLM sample output
 * Used within the LlmSampleTabs component
 */
export function LlmSample({ children }: LlmSampleProps) {
  // This component serves as a data container for LlmSampleTabs
  // The actual rendering is handled by LlmSampleTabs
  return <>{children}</>;
}
