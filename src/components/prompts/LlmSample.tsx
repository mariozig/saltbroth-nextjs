'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LlmSampleProps {
  // Keeping these in the interface for future use and API consistency
  slug?: string;
  color?: string;
  children: React.ReactNode;
}

/**
 * Component for displaying a sample output from a specific LLM
 * Used within LlmSampleTabs on prompt detail pages
 */
export function LlmSample({ children }: LlmSampleProps) {
  const t = useTranslations('prompts');
  const [copied, setCopied] = useState(false);
  
  // Function to copy content to clipboard
  const copyContent = async () => {
    try {
      // Get text content from children
      let content = '';
      if (typeof children === 'string') {
        content = children;
      } else if (React.isValidElement(children)) {
        content = React.Children.toArray(children)
          .map(child => {
            if (typeof child === 'string') return child;
            if (
              React.isValidElement(child) && 
              typeof child.props === 'object' && 
              child.props !== null &&
              'children' in child.props
            ) {
              const childContent = child.props.children;
              return typeof childContent === 'string' ? childContent : '';
            }
            return '';
          })
          .join('');
      }
      
      await navigator.clipboard.writeText(content);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };
  
  return (
    <div className="relative">
      {/* Copy button */}
      <button
        onClick={copyContent}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        aria-label={t('copyToClipboard')}
      >
        {copied ? (
          <i className="fas fa-check text-green-400"></i>
        ) : (
          <i className="fas fa-copy"></i>
        )}
      </button>
      
      {/* LLM sample content */}
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}
