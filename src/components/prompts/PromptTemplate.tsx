"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PromptTemplateProps {
  content?: string;
  children?: React.ReactNode;
}

export default function PromptTemplate({ content, children }: PromptTemplateProps) {
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
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-space text-2xl font-bold tracking-tight">{t('promptTemplate')}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyContent}
              className="copy-button bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {copySuccess ? t('copied') : t('copy')}
                <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
              </span>
            </button>
          </div>
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
          </div>
          <pre className="font-mono text-[15px] text-gray-400 whitespace-pre-wrap leading-relaxed tracking-tight p-6 rounded-b-xl bg-black/20 border border-white/10 border-t-0">
            {displayContent}
          </pre>
        </div>
      </div>
    </section>
  );
}