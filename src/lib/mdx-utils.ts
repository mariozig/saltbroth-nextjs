/**
 * Utility functions for handling MDX content
 */

/**
 * Extracts content from MDX custom components
 * This is a fallback mechanism in case MDX rendering fails
 */
export function extractComponentContent(mdxContent: string, componentName: string): string {
  try {
    // Use a more robust regex pattern that can match across multiple lines
    // The [\s\S]*? pattern matches any character (including newlines) in a non-greedy way
    const pattern = `<${componentName}>[\\s\\S]*?<\\/${componentName}>`;
    const regex = new RegExp(pattern, 's');
    const match = regex.exec(mdxContent);
    
    if (!match || !match[0]) return '';
    
    // Extract the content between the opening and closing tags
    const fullMatch = match[0];
    const openingTagLength = componentName.length + 2; // +2 for < and >
    const closingTagLength = componentName.length + 3; // +3 for </ and >
    
    // Remove the opening and closing tags to get just the content
    const content = fullMatch.substring(
      openingTagLength,
      fullMatch.length - closingTagLength
    ).trim();
    
    return content;
  } catch (error) {
    console.error(`Error extracting ${componentName} content:`, error);
    return '';
  }
}

/**
 * Extracts LlmSample components from MDX content
 * Returns an array of objects with slug, color, and content properties
 */
export function extractLlmSamples(mdxContent: string): Array<{ slug: string; color: string; content: string }> {
  try {
    const samples: Array<{ slug: string; color: string; content: string }> = [];
    
    // First, extract the entire LlmSampleTabs section
    const tabsRegex = /<LlmSampleTabs>([\s\S]*?)<\/LlmSampleTabs>/g;
    const tabsMatch = tabsRegex.exec(mdxContent);
    
    if (!tabsMatch || !tabsMatch[1]) return samples;
    
    const tabsContent = tabsMatch[1];
    
    // Then extract individual LlmSample components
    const sampleRegex = /<LlmSample\s+slug="([^"]+)"\s+color="([^"]+)">([\s\S]*?)<\/LlmSample>/g;
    
    let sampleMatch;
    while ((sampleMatch = sampleRegex.exec(tabsContent)) !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [fullMatch, slug, color, content] = sampleMatch;
      samples.push({
        slug,
        color,
        content: content.trim()
      });
    }
    
    return samples;
  } catch (error) {
    console.error('Error extracting LLM samples:', error);
    return [];
  }
}

/**
 * Enhance MDX content to ensure custom components are properly closed
 * This helps prevent rendering issues with MDX custom components
 */
export function enhanceMdxContent(content: string): string {
  if (!content) return '';
  
  // List of our custom components that might be used in MDX
  const components = [
    'PromptDescription',
    'PromptInstructions',
    'PromptTemplate',
    'PromptTips',
    'LlmSampleTabs',
    'LlmSample'
  ];
  
  let enhancedContent = content;
  
  // Ensure components have proper closing tags
  components.forEach(component => {
    // Replace self-closing tags with opened/closed pairs
    const selfClosingPattern = new RegExp(`<${component}\\s*\/>`, 'g');
    enhancedContent = enhancedContent.replace(selfClosingPattern, `<${component}><\/${component}>`);
    
    // Check for components that are opened but not closed
    const openTag = `<${component}>`;
    const closeTag = `</${component}>`;
    
    if (enhancedContent.includes(openTag) && !enhancedContent.includes(closeTag)) {
      enhancedContent += closeTag;
    }
  });
  
  return enhancedContent;
}