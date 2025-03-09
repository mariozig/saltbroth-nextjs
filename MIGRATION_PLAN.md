# Content Migration Plan: Supabase to MDX-based File System

## Summary

This document outlines the plan to migrate content management from Supabase to a file system-based approach using MDX files. The migration will cover all non-authentication content types including prompts, categories, output samples, and LLMs, while maintaining multi-language support.

## Overview

### Current System
- Content stored in Supabase database tables
- Separate tables for categories, prompts, LLMs, and output samples
- Relational structure with foreign key relationships

### Target System
- Content stored as MDX files in the file system
- Directory structure based on content type and locale
- Rich, interactive content using MDX components
- Metadata stored in frontmatter and validated via schema

### Benefits
- **Developer Experience**: Edit content directly in code editor
- **Version Control**: Track content changes alongside code
- **Localization**: Clear separation of content by locale
- **Interactivity**: Custom components via MDX for rich content
- **Performance**: Static generation at build time
- **Simplified Architecture**: Reduced dependency on external database

## File Structure

```
/content
  /en                         # English content
    /categories
      creative-writing.mdx
      business-marketing.mdx
      business/
        index.mdx             # Parent category info
        writing.mdx           # Child category
        proposals.mdx
        professional-content/
          index.mdx           # Parent subcategory info
          email-templates.mdx # Child subcategory
    /prompts
      professional-email-template.mdx
      creative-story-starter.mdx
      meeting-follow-up.mdx
    /llms
      index.mdx               # Collection info
      chatgpt.mdx
      claude.mdx
      llama.mdx
  /es                         # Spanish content (same structure)
    /categories
      ...
    /prompts
      ...
```

## MDX Content Examples

### Categories (categories/creative-writing.mdx)
```mdx
---
name: "Creative Writing"
slug: "creative-writing"
description: "Prompts for creative writing and storytelling"
---

<CategoryDescription>
  Explore our creative writing prompts to spark your imagination and develop your storytelling skills.
</CategoryDescription>

<FeaturedPrompts category="creative-writing" />
```

### Prompts (prompts/professional-email-template.mdx)
```mdx
---
title: "Professional Email Template"
slug: "professional-email-template"
description: "Create polished and effective professional emails"
category: "business-marketing"
isPremium: false
icon: "fa-envelope"
compatible_llms:     # LLMs this prompt works well with
  - "chatgpt"
  - "claude"
  - "llama"
featured_llms:       # LLMs to highlight with this prompt (optional)
  - "chatgpt"
  - "claude"
---

<PromptTemplate>
  Write a professional email about: {topic}. Tone should be {tone} and length should be {length}.
</PromptTemplate>

## Samples

<LlmSampleTabs>
  <LlmSample slug="chatgpt" color="#10a37f">
    Dear [Name],

    I hope this email finds you well...
  </LlmSample>

  <LlmSample slug="claude" color="#8e44ef">
    Subject: Project Update

    Dear [Name],

    I wanted to provide you with...
  </LlmSample>
</LlmSampleTabs>
```

### LLMs (llms/chatgpt.mdx)
```mdx
---
name: "ChatGPT"
slug: "chatgpt"
description: "OpenAI's conversational AI model"
provider: "OpenAI"
model_name: "gpt-4-turbo"              # Technical model identifier
features: ["llm.feature.writing", "llm.feature.code", "llm.feature.math"]  # Translation keys
max_tokens: 16000                     # Technical specifications (optional)
api_endpoint: "https://api.openai.com/v1/chat/completions"  # Optional
---

<LlmDescription>
  ChatGPT is a large language model from OpenAI that can engage in natural conversations and assist with various tasks.
</LlmDescription>

<RecommendedPrompts llm="chatgpt" />
```

## Content Localization

To handle localization properly, especially for array content like LLM features, we'll use a translation key approach:

1. **Translation Keys in Arrays**: Use dot-notation translation keys instead of raw strings in arrays
   ```typescript
   // Example: features: ["llm.feature.writing", "llm.feature.code", "llm.feature.math"] 
   ```

2. **Translation Files**: Create JSON translation files for each supported locale
   ```typescript
   // translations/en.json
   {
     "llm": {
       "feature": {
         "writing": "General writing",
         "code": "Code generation",
         "math": "Math problems"
       }
     }
   }
   
   // translations/es.json
   {
     "llm": {
       "feature": {
         "writing": "Escritura general",
         "code": "Generación de código",
         "math": "Problemas matemáticos"
       }
     }
   }
   ```

3. **Translation Utility**: Create a helper function to process translation keys
   ```typescript
   // lib/i18n.ts
   import translations from './translations';
   
   export function translate(key: string, locale: string): string {
     const path = key.split('.');
     let current = translations[locale];
     
     for (const segment of path) {
       if (!current[segment]) return key; // Fallback to the key itself
       current = current[segment];
     }
     
     return current;
   }
   ```

4. **Component Integration**: Use the translation utility in components that display localized content
   ```tsx
   // components/LlmFeatures.tsx
   import { translate } from '../lib/i18n';
   
   export function LlmFeatures({ features, locale }: { features: string[], locale: string }) {
     return (
       <ul>
         {features.map((featureKey, index) => (
           <li key={index}>{translate(featureKey, locale)}</li>
         ))}
       </ul>
     );
   }
   ```

5. **Validation**: Add build-time validation to ensure translation keys exist
   ```typescript
   // scripts/validate-translations.js
   const fs = require('fs');
   const path = require('path');
   const matter = require('gray-matter');
   const glob = require('glob');
   
   // Load all translation keys from translation files
   const availableKeys = getAvailableTranslationKeys();
   
   // Check all MDX files for valid translation keys
   const mdxFiles = glob.sync('content/**/*.mdx');
   const invalidKeys = [];
   
   mdxFiles.forEach(file => {
     const content = fs.readFileSync(file, 'utf8');
     const { data } = matter(content);
     
     if (data.features) {
       data.features.forEach(key => {
         if (!isValidTranslationKey(key)) {
           invalidKeys.push({ file, key });
         }
       });
     }
   });
   
   if (invalidKeys.length > 0) {
     console.error('Invalid translation keys found:', invalidKeys);
     process.exit(1);
   }
   ```

## Frontmatter Schema Validation

To ensure content integrity and prevent errors in frontmatter, we need to implement a schema validation approach. Some options include:

1. **Zod** - TypeScript-first schema validation with runtime checks and detailed error messages
2. **ContentLayer** - Purpose-built content management solution for Next.js with built-in schema validation
3. **Git Hooks w/ Husky** - Pre-commit validation to prevent invalid content from being committed
4. **API Middleware** - Validation layer in API routes that serve content to catch errors before rendering
5. **Build-time Validation** - Custom Next.js plugin to validate all content during the build process
6. **TypeScript Interfaces** - Type-safe content loading with TypeScript interfaces and type checking

> **Note:** Final validation approach to be determined during implementation phase.

## Implementation Checklist

### 1. Setup & Planning
- [x] Analyze current Supabase schema
- [x] Design file system structure
- [x] Define MDX file formats for each content type
- [ ] Create sample MDX files to test structure

### 2. MDX Component Development
- [ ] Install required packages:
  ```
  npm install next-mdx-remote @mdx-js/react @mdx-js/mdx gray-matter glob
  ```
- [ ] Create MDX component library:
  - [ ] CategoryDescription component
  - [ ] PromptTemplate component
  - [ ] LlmSample and LlmSampleTabs components (update to use LLM slugs instead of names)
  - [ ] FeaturedPrompts component
  - [ ] CompatibleLlms component (to display LLMs compatible with a prompt)
  - [ ] LlmCard component (for displaying LLM details)
  - [ ] PromptsByLlm component (to list prompts compatible with an LLM)
  - [ ] LlmFeatures component (to display localized features)
- [ ] Create MDX component provider
- [ ] Create translation utility functions and integration

### 3. Content Utility Functions
- [ ] Create base content utility file (lib/content.ts)
- [ ] Implement getAllCategories function with MDX support
- [ ] Implement getCategoryBySlug function
- [ ] Implement getAllPrompts function
- [ ] Implement getPromptBySlug function
- [ ] Implement getAllLLMs function
- [ ] Implement getLLMBySlug function
- [ ] Implement getPromptsByLLM function (filter prompts compatible with a specific LLM)
- [ ] Implement getFeaturedLLMs function (retrieve featured LLMs for a prompt)
- [ ] Add proper error handling and caching

### 4. Localization System
- [ ] Set up translation files structure
  - [ ] Create base translation files for each locale (en.json, es.json, etc.)
  - [ ] Add translation keys for features and other localized content
- [ ] Implement translation utility functions
  - [ ] Create `translate` function to resolve translation keys
  - [ ] Create helper components for displaying translated content
- [ ] Add translation key validation script
  - [ ] Build validation to check translation keys in frontmatter
  - [ ] Add validation to the build process

### 5. Migration Script
- [ ] Create export script to pull data from Supabase
- [ ] Add frontmatter generation for each content type
- [ ] Implement category hierarchy preservation
- [ ] Add output sample formatting to prompt files
- [ ] Establish LLM relationships in prompt frontmatter (`compatible_llms` and `featured_llms`)
- [ ] Implement LLM metadata extraction (provider, model_name, etc.)
- [ ] Implement localization handling
- [ ] Test migration script on development data

### 6. Next.js Integration
- [ ] Update page components to use new content utilities
- [ ] Implement category listing page
- [ ] Implement category detail page
- [ ] Implement prompt listing page
- [ ] Implement prompt detail page
- [ ] Update all import paths
- [ ] Add proper typing for frontmatter data

### 7. Testing
- [ ] Test content rendering in all locales
- [ ] Verify relationships between content types
- [ ] Test dynamic routes
- [ ] Test build process
- [ ] Test MDX components in different contexts
- [ ] Performance testing

### 8. Automated Testing & Validation
- [ ] Create automated tests to verify content migration accuracy:
  - [ ] Count validation (ensure all content items are migrated)
  - [ ] Content integrity validation (checksums or content sampling)
  - [ ] Relationship validation (ensure parent/child relationships are preserved)
- [ ] Create snapshot tests for new MDX components
- [ ] Set up content validation script to identify malformed MDX files
- [ ] Create visual regression tests for key pages
- [ ] Document validation procedure for content authors
- [ ] Benchmark performance comparison between database and filesystem approaches

### 9. Deployment
- [ ] Run migration in staging environment
- [ ] Verify production build
- [ ] Deploy to production
- [ ] Monitor for issues

### 10. Cleanup & Code Removal
- [ ] Identify and catalog all Supabase content-related code for removal
- [ ] Remove Supabase database calls in API routes:
  - [ ] Remove `/api/categories` endpoints
  - [ ] Remove `/api/prompts` endpoints
  - [ ] Remove `/api/llms` endpoints
  - [ ] Remove `/api/output-samples` endpoints
- [ ] Remove Supabase client instances for content operations
- [ ] Remove Supabase database schema for content tables:
  - [ ] `categories` table
  - [ ] `prompts` table
  - [ ] `llms` table
  - [ ] `output_samples` table
- [ ] Remove Supabase data fetching hooks:
  - [ ] `useCategories` hook
  - [ ] `usePrompts` hook
  - [ ] `useLLMs` hook
  - [ ] `useOutputSamples` hook
- [ ] Remove Supabase RLS policies for content tables
- [ ] Remove unnecessary environment variables related to content DB
- [ ] Remove migration and seed scripts for content tables
- [ ] Update database triggers that reference content tables
- [ ] Update TypeScript types to reflect new content structure
- [ ] Update CI/CD pipelines to exclude content DB operations
- [ ] Audit any scheduled jobs or cron tasks related to content DB

### 11. Documentation & Training
- [ ] Update README with new content management approach
- [ ] Create content authoring guidelines for MDX
- [ ] Document content directory structure
- [ ] Create templates for new content types
- [ ] Document component props and interfaces
- [ ] Update contributor documentation
- [ ] Create content migration status report

## Content Loading Implementation

```typescript
// lib/content.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx';

// Base content directory
const contentDirectory = path.join(process.cwd(), 'content');

// Get all categories for a locale
export async function getAllCategories(locale: string = 'en') {
  const categoriesDir = path.join(contentDirectory, locale, 'categories');
  const categoryFiles = await glob('**/*.mdx', { cwd: categoriesDir });
  
  return Promise.all(
    categoryFiles.map(async (fileName) => {
      const filePath = path.join(categoriesDir, fileName);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      // Handle nested paths
      const slugPath = fileName.replace(/\.mdx$/, '').replace(/\/index$/, '');
      
      return {
        ...data,
        slug: slugPath,
        id: slugPath // Use slug as id for consistency
      };
    })
  );
}

// Get a specific category by slug
export async function getCategoryBySlug(slug: string, locale: string = 'en') {
  // Handle index files for directories
  const possiblePaths = [
    path.join(contentDirectory, locale, 'categories', `${slug}.mdx`),
    path.join(contentDirectory, locale, 'categories', slug, 'index.mdx')
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const { content, data } = matter(fileContent);
      
      // Compile MDX content
      const { content: mdxContent } = await compileMDX({
        source: content,
        components: mdxComponents,
        options: { parseFrontmatter: false }
      });
      
      return { ...data, content: mdxContent, slug };
    }
  }
  
  return null;
}

// Get all prompts for a locale
export async function getAllPrompts(locale: string = 'en') {
  const promptsDir = path.join(contentDirectory, locale, 'prompts');
  const promptFiles = await glob('*.mdx', { cwd: promptsDir });
  
  return Promise.all(
    promptFiles.map(async (fileName) => {
      const filePath = path.join(promptsDir, fileName);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        ...data,
        id: data.slug,
        slug: fileName.replace(/\.mdx$/, '')
      };
    })
  );
}

// Get a specific prompt by slug
export async function getPromptBySlug(slug: string, locale: string = 'en') {
  const filePath = path.join(contentDirectory, locale, 'prompts', `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = await fs.promises.readFile(filePath, 'utf8');
  const { content, data } = matter(fileContent);
  
  // Compile MDX content
  const { content: mdxContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: { parseFrontmatter: false }
  });
  
  return {
    ...data,
    content: mdxContent,
    id: slug
  };
}

// Get all LLMs
export async function getAllLLMs(locale: string = 'en') {
  const llmsDir = path.join(contentDirectory, locale, 'llms');
  const llmFiles = await glob('*.mdx', { cwd: llmsDir, ignore: 'index.mdx' });
  
  return Promise.all(
    llmFiles.map(async (fileName) => {
      const filePath = path.join(llmsDir, fileName);
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        ...data,
        id: fileName.replace(/\.mdx$/, '')
      };
    })
  );
}
```

## MDX Components Setup

```tsx
// components/mdx/index.tsx
import PromptTemplate from './PromptTemplate';
import LlmSample from './LlmSample';
import LlmSampleTabs from './LlmSampleTabs';
import CategoryDescription from './CategoryDescription';
import FeaturedPrompts from './FeaturedPrompts';

export const mdxComponents = {
  PromptTemplate,
  LlmSample,
  LlmSampleTabs,
  CategoryDescription,
  FeaturedPrompts
};
```

## Migration Script Example

```typescript
// scripts/migrate-content.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Base directory for content
const contentDir = path.join(process.cwd(), 'content');

// Supported locales
const locales = ['en', 'es'];

async function migrateCategories() {
  // Fetch all categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }
  
  // Create directory structure
  for (const locale of locales) {
    const categoryDir = path.join(contentDir, locale, 'categories');
    fs.mkdirSync(categoryDir, { recursive: true });
    
    // Create all category files
    for (const category of categories) {
      // Handle nested categories with directories
      const slugParts = category.slug.split('/');
      const fileName = slugParts.pop() || category.slug;
      
      let categoryPath = categoryDir;
      if (slugParts.length > 0) {
        const nestedDir = path.join(categoryDir, ...slugParts);
        fs.mkdirSync(nestedDir, { recursive: true });
        categoryPath = nestedDir;
      }
      
      // Create frontmatter
      const frontmatter = {
        name: category.name,
        slug: category.slug.split('/').pop(),
        description: category.description
      };
      
      // Basic MDX content
      const mdxContent = `
<CategoryDescription>
  ${category.description}
</CategoryDescription>

<FeaturedPrompts category="${category.slug}" />
      `;
      
      // Write to file
      const fileContent = matter.stringify(mdxContent, frontmatter);
      fs.writeFileSync(path.join(categoryPath, `${fileName}.mdx`), fileContent);
    }
  }
  
  console.log('Categories migrated successfully');
}

async function migratePrompts() {
  // Fetch all prompts with related output samples
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select(`
      *,
      output_samples(
        content,
        llm_id
      )
    `);
    
  if (error) {
    console.error('Error fetching prompts:', error);
    return;
  }
  
  // Get LLMs for reference
  const { data: llms } = await supabase.from('llms').select('*');
  const llmMap = llms?.reduce((acc, llm) => {
    acc[llm.id] = { name: llm.name, color: llm.color };
    return acc;
  }, {}) || {};
  
  // Create prompt files
  for (const locale of locales) {
    const promptDir = path.join(contentDir, locale, 'prompts');
    fs.mkdirSync(promptDir, { recursive: true });
    
    for (const prompt of prompts) {
      // Create frontmatter
      const frontmatter = {
        title: prompt.title,
        slug: prompt.slug,
        description: prompt.description,
        category: prompt.category_id, // You'll need to map this to category slug
        isPremium: prompt.is_premium,
        icon: prompt.icon
      };
      
      // Generate template
      let mdxContent = `
<PromptTemplate>
  ${prompt.content}
</PromptTemplate>
`;
      
      // Generate samples MDX
      if (prompt.output_samples && prompt.output_samples.length > 0) {
        mdxContent += `
## Samples

<LlmSampleTabs>
`;
        
        for (const sample of prompt.output_samples) {
          const llm = llmMap[sample.llm_id] || { name: 'Unknown LLM', color: '#cccccc' };
          mdxContent += `
  <LlmSample name="${llm.name}" color="${llm.color}">
    ${sample.content}
  </LlmSample>
`;
        }
        
        mdxContent += `</LlmSampleTabs>`;
      }
      
      // Write to file
      const fileContent = matter.stringify(mdxContent, frontmatter);
      fs.writeFileSync(path.join(promptDir, `${prompt.slug}.mdx`), fileContent);
    }
  }
  
  console.log('Prompts migrated successfully');
}

async function migrateLLMs() {
  // Fetch all LLMs
  const { data: llms, error } = await supabase.from('llms').select('*');
    
  if (error) {
    console.error('Error fetching LLMs:', error);
    return;
  }
  
  // Create LLM files
  for (const locale of locales) {
    const llmDir = path.join(contentDir, locale, 'llms');
    fs.mkdirSync(llmDir, { recursive: true });
    
    for (const llm of llms) {
      // Create frontmatter
      const frontmatter = {
        name: llm.name,
        color: llm.color
      };
      
      // Write to file
      const fileContent = matter.stringify('', frontmatter);
      fs.writeFileSync(path.join(llmDir, `${llm.name.toLowerCase()}.mdx`), fileContent);
    }
  }
  
  console.log('LLMs migrated successfully');
}

// Run migration
async function migrate() {
  await migrateCategories();
  await migratePrompts();
  await migrateLLMs();
  console.log('Migration completed successfully');
}

migrate().catch(console.error);

/**
 * File Cleanup List Generator
 * 
 * This function generates a list of files that should be removed or modified
 * after the content migration is complete.
 */
async function generateCleanupList() {
  // Create a file to track what needs to be removed
  const cleanupFile = path.join(process.cwd(), 'migration-cleanup.md');
  
  let cleanupContent = `# Migration Cleanup List\n\n`;
  cleanupContent += `Generated: ${new Date().toISOString()}\n\n`;
  cleanupContent += `## Files to Remove\n\n`;
  
  // Common patterns for content-related files
  const patterns = [
    'src/api/*/categories.*',
    'src/api/*/prompts.*',
    'src/api/*/llms.*',
    'src/api/*/output-samples.*',
    'src/hooks/use*Categories*',
    'src/hooks/use*Prompts*',
    'src/hooks/use*LLMs*',
    'src/hooks/use*OutputSamples*',
    'src/types/*Categories*',
    'src/types/*Prompts*',
    'src/types/*LLMs*',
    'src/types/*OutputSamples*',
    'supabase/migrations/*_categories_*',
    'supabase/migrations/*_prompts_*',
    'supabase/migrations/*_llms_*',
    'supabase/migrations/*_output_samples_*',
  ];
  
  // Output cleanup suggestions
  cleanupContent += patterns.map(pattern => `- [ ] \`${pattern}\``).join('\n');
  
  cleanupContent += `\n\n## Files to Modify\n\n`;
  cleanupContent += `- [ ] \`src/lib/supabase.ts\` - Remove content-related queries\n`;
  cleanupContent += `- [ ] \`supabase/seed.sql\` - Remove content seeding\n`;
  cleanupContent += `- [ ] \`src/app/[locale]/page.tsx\` - Update to use new content API\n`;
  cleanupContent += `- [ ] \`src/app/[locale]/categories/page.tsx\` - Update to use new content API\n`;
  cleanupContent += `- [ ] \`src/app/[locale]/prompts/page.tsx\` - Update to use new content API\n`;
  cleanupContent += `- [ ] \`.env.example\` - Remove content DB variables\n`;
  cleanupContent += `- [ ] \`README.md\` - Update content management documentation\n`;
  
  // Write the cleanup list file
  fs.writeFileSync(cleanupFile, cleanupContent);
  console.log(`Cleanup list generated at: ${cleanupFile}`);
}

// Add to migration script
if (process.argv.includes('--generate-cleanup')) {
  generateCleanupList().catch(console.error);
}
````
