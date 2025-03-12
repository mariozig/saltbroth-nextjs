'use client';

interface PromptDescriptionProps {
  children: React.ReactNode;
}

/**
 * PromptDescription Component
 * 
 * Renders the main description of a prompt with a modern, glass-morphic design.
 * Used at the top of prompt MDX files to provide context and use cases.
 */
export function PromptDescription({ children }: PromptDescriptionProps) {
  return (
    <div className="glass-morphism rounded-3xl p-8 mb-12 relative group">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-100/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-200/10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <div className="prose prose-invert max-w-none">
          <div className="text-xl md:text-2xl text-gray-200 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
