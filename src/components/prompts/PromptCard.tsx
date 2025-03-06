"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';

interface PromptCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  isPremium?: boolean;
}

export default function PromptCard({ 
  title, 
  slug, 
  description, 
  icon = 'fa-star', 
  isPremium = false 
}: PromptCardProps) {
  const locale = useLocale();
  
  return (
    <Link 
      href={`/${locale}/prompts/${slug}`}
      className="block group"
    >
      <div className="glass rounded-2xl p-4 sm:p-6 h-full transition-transform duration-200 group-hover:translate-y-[-2px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600/20 rounded-full flex items-center justify-center">
              <i className={`fas ${icon} text-primary-400`}></i>
            </div>
            <h3 className="font-semibold text-white tracking-tight">{title}</h3>
          </div>
          {isPremium && (
            <div className="bg-primary-600/20 text-primary-400 px-2 py-0.5 text-xs font-medium rounded">
              Premium
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm leading-relaxed tracking-tight">
          {description}
        </p>
      </div>
    </Link>
  );
}
