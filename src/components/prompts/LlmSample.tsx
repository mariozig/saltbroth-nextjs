'use client';

interface LlmSampleProps {
  slug: string;
  color: string;
  children: React.ReactNode;
}

/**
 * LlmSample Component
 * 
 * Represents a single LLM's sample output within the LlmSampleTabs component.
 * Each sample can be styled with its own color scheme based on the LLM's branding.
 */
export function LlmSample({ children }: LlmSampleProps) {
  return children;
}
