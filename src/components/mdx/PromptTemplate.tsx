/**
 * PromptTemplate Component
 * 
 * This component displays a prompt template with proper formatting and styling.
 * It renders the prompt in a card with a copy button and syntax highlighting.
 */

'use client';

import * as React from 'react';

interface PromptTemplateProps {
  children: React.ReactNode;
}

export default function PromptTemplate({ children }: PromptTemplateProps) {
  const [copied, setCopied] = React.useState(false);
  
  const copyToClipboard = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 relative">
      <div className="absolute top-3 right-3">
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Copy prompt to clipboard"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="font-mono text-sm whitespace-pre-wrap text-gray-800">
        {children}
      </div>
    </div>
  );
}
