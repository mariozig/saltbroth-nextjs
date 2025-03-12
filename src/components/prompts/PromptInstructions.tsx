'use client';

interface PromptInstructionsProps {
  children: React.ReactNode;
}

/**
 * PromptInstructions Component
 * 
 * Displays step-by-step instructions for using the prompt.
 * Styled with a subtle background and clear typography for readability.
 */
export function PromptInstructions({ children }: PromptInstructionsProps) {
  return (
    <div className="glass-morphism rounded-3xl p-8 mb-8 relative group">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent-100/5 via-accent-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-accent-100/10 flex items-center justify-center">
            <i className="fas fa-list-ol text-accent-100"></i>
          </div>
          <h2 className="font-space text-2xl font-bold tracking-tight">How to Use</h2>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 space-y-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
