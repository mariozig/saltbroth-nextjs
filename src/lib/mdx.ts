/**
 * MDX Processing Utilities
 * 
 * This file contains utility functions for processing MDX content.
 */

import { compile } from '@mdx-js/mdx'

/**
 * Process MDX content to HTML
 * 
 * @param content - The MDX content to process
 * @returns The processed HTML content
 */
export async function processMdxToHtml(content: string): Promise<string> {
  if (!content || content.trim() === '') {
    return '';
  }

  try {
    // Compile MDX to JavaScript
    await compile(content, {
      outputFormat: 'function-body',
      development: false,
      jsx: true,
    })
    
    // For now, we'll just return the original content with some basic Markdown processing
    // This is a fallback until we implement full MDX rendering
    return processBasicMarkdown(content);
  } catch (error) {
    console.error('Error processing MDX content:', error);
    return `<p>Error processing content</p>`;
  }
}

/**
 * Process basic Markdown syntax
 * This is a simple implementation for basic Markdown features
 * 
 * @param markdown - The Markdown content to process
 * @returns The processed HTML content
 */
function processBasicMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // First, let's handle lists separately to ensure they're processed correctly
  let processedMarkdown = '';
  let inList = false;
  let listContent = '';
  
  // Split by lines and process
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    
    // Check if this line is a list item (starts with - or *)
    const isListItem = /^[-*]\s+(.+)$/.test(line);
    const isNextLineListItem = /^[-*]\s+(.+)$/.test(nextLine);
    
    if (isListItem) {
      if (!inList) {
        // Start a new list
        inList = true;
        listContent = '<ul>\n';
      }
      
      // Add this item to the list
      const itemContent = line.replace(/^[-*]\s+(.+)$/, '$1');
      listContent += `  <li>${itemContent}</li>\n`;
      
      // If the next line is not a list item, close this list
      if (!isNextLineListItem) {
        listContent += '</ul>';
        processedMarkdown += listContent + '\n';
        inList = false;
        listContent = '';
      }
    } else {
      // Not a list item, add the line as is
      processedMarkdown += line + '\n';
    }
  }
  
  // Now process the rest of the markdown
  let html = processedMarkdown;
  
  // Process headings
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  // Process inline formatting
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Process links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Process paragraphs (lines that aren't headings, lists, or empty)
  const paragraphLines = html.split('\n');
  const processedLines = [];
  
  for (const line of paragraphLines) {
    if (
      line.trim() === '' || 
      line.startsWith('<h') || 
      line.startsWith('<ul') || 
      line.startsWith('</ul') || 
      line.startsWith('<li') || 
      line.startsWith('</li')
    ) {
      processedLines.push(line);
    } else {
      processedLines.push(`<p>${line}</p>`);
    }
  }
  
  return processedLines.join('\n');
}
