/**
 * Utility functions for handling MDX content
 */

/**
 * Extracts content from MDX custom components
 * This is a fallback mechanism in case MDX rendering fails
 */
export function extractComponentContent(mdxContent: string, componentName: string): string {
  try {
    const regex = new RegExp(`<${componentName}>(.*?)<\/${componentName}>`, 'gs');
    const match = regex.exec(mdxContent);
    return match ? match[1].trim() : '';
  } catch (error) {
    console.error(`Error extracting ${componentName} content:`, error);
    return '';
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
    'PromptTips'
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