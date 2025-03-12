'use client';

interface PromptTipsProps {
  children: React.ReactNode;
}

/**
 * PromptTips Component
 * 
 * Displays best practices and usage tips for the prompt.
 * Features a clean, modern design with clear sections for different types of tips.
 */
export function PromptTips({ children }: PromptTipsProps) {
  return (
    <div className="glass-morphism rounded-3xl p-8 relative group">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-200/5 via-accent-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-accent-100/10 flex items-center justify-center">
            <i className="fas fa-lightbulb text-accent-100"></i>
          </div>
          <h2 className="font-space text-2xl font-bold tracking-tight">Tips & Best Practices</h2>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
