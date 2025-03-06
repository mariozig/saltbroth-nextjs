"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LLM {
  id: string;
  name: string;
  color: string;
}

interface OutputSample {
  id: string;
  llm: LLM;
  content: string;
}

interface PromptOutputSamplesProps {
  samples: OutputSample[];
}

export default function PromptOutputSamples({ samples }: PromptOutputSamplesProps) {
  const t = useTranslations('prompts');
  const [activeTab, setActiveTab] = useState<string>(samples.length > 0 ? samples[0].llm.id : '');
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({});

  const copyContent = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (samples.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="font-semibold text-lg tracking-tight px-1">{t('exampleOutputs')}</h2>
      
      <div className="flex gap-3 overflow-x-auto pb-2">
        {samples.map(sample => (
          <button 
            key={sample.llm.id} 
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              activeTab === sample.llm.id 
                ? 'bg-white/10' 
                : 'bg-white/5 hover:bg-white/10'
            } transition-colors tracking-tight`}
            onClick={() => setActiveTab(sample.llm.id)}
          >
            {sample.llm.name}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {samples.map(sample => (
          <div 
            key={sample.llm.id} 
            className={activeTab === sample.llm.id ? '' : 'hidden'}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: sample.llm.color }}
                ></span>
                <span className="font-semibold tracking-tight">{sample.llm.name}</span>
              </div>
              <button 
                onClick={() => copyContent(sample.id, sample.content)} 
                className="text-gray-400 hover:text-white"
              >
                <i className={`fas ${copySuccess[sample.id] ? 'fa-check' : 'fa-copy'}`}></i>
              </button>
            </div>
            <pre className="p-4 sm:p-5 font-mono text-[15px] text-gray-400 whitespace-pre-wrap leading-relaxed tracking-tight">
              {sample.content}
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
