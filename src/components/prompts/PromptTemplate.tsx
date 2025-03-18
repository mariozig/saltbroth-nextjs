"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PromptTemplateProps {
  content?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  instructions?: React.ReactNode;
  tips?: React.ReactNode;
}

export default function PromptTemplate({ content, children, description, instructions, tips }: PromptTemplateProps) {
  const t = useTranslations('prompts');
  const [copySuccess, setCopySuccess] = useState(false);

  // Safely determine the content to display - could be from prop or children
  const displayContent = content || (
    typeof children === 'string' ? children : 
    children ? String(children).replace(/\[object Object\]/g, '') : ''
  );

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="glass-morphism rounded-3xl p-8 relative group">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-100/10 via-accent-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="font-space text-2xl font-bold tracking-tight">The Prompt</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyContent}
              className="copy-button bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {copySuccess ? t('copied') : t('copy')}
                <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
              </span>
            </button>
          </div>
        </div>
        
        {/* Description content if available */}
        {description && (
          <div className="mb-6">
            <div className="prose prose-invert prose-sm max-w-none">
              {description}
            </div>
          </div>
        )}
        
        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-400">{t('promptTemplateDescription')}</p>
          
          {/* Include instructions if available, otherwise default instructions */}
          {instructions ? (
            <div className="prose prose-invert prose-sm max-w-none">
              {instructions}
            </div>
          ) : (
            <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1.5">
              <li>{t('promptTemplateStep1')}</li>
              <li>{t('promptTemplateStep2')}</li>
              <li>{t('promptTemplateStep3')}</li>
              <li>{t('promptTemplateStep4')}</li>
            </ol>
          )}
        </div>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-100/20 via-accent-200/20 to-accent-100/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="relative flex items-center gap-2 px-4 py-3 rounded-t-xl bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <span className="text-xs text-gray-500">prompt-template.txt</span>
            <div className="relative ml-auto group/tooltip">
              <button 
                onClick={copyContent} 
                className="copy-btn flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent-100/10 hover:bg-accent-100/20 transition-colors text-sm text-accent-100"
              >
                <i className="fas fa-copy"></i>
                <span className="font-medium">{t('copyToUse')}</span>
              </button>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-xs text-white rounded-md whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                {t('copyTooltip')}
              </div>
            </div>
          </div>
          <pre id="promptContent" className="font-mono text-[15px] text-gray-400 whitespace-pre-wrap leading-relaxed tracking-tight p-6 rounded-b-xl bg-black/20 border border-white/10 border-t-0 select-all">
            {displayContent}
          </pre>
        </div>
        
        {/* Tips section if available */}
        {tips && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-accent-100/10 flex items-center justify-center">
                <i className="fas fa-lightbulb text-accent-100 text-sm"></i>
              </div>
              <h3 className="font-space text-xl font-bold tracking-tight">{t('tipsBestPractices')}</h3>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              {tips}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}