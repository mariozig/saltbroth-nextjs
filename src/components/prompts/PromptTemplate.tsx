"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PromptTemplateProps {
  content: string;
}

export default function PromptTemplate({ content }: PromptTemplateProps) {
  const t = useTranslations('prompts');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="glass rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg tracking-tight">{t('promptTemplate')}</h2>
        <button 
          onClick={copyContent} 
          className="copy-btn flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <i className={`fas ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
          <span className="font-medium">{copySuccess ? t('copied') : t('copy')}</span>
        </button>
      </div>
      <pre className="font-mono text-[15px] text-gray-400 whitespace-pre-wrap leading-relaxed tracking-tight">
        {content}
      </pre>
    </section>
  );
}
