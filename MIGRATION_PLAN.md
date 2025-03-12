# Content Architecture Plan: MDX-based File System

## Summary

This document outlines the plan to implement a file system-based approach for content management using MDX files. This architecture will cover all non-authentication content types including prompts, categories, output samples, and LLMs, while maintaining multi-language support.

## Overview

### New System
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
- [x] Set up translation files structure
  - [x] Create base translation files for each locale (en.json, es.json, etc.)
  - [x] Add translation keys for features and other localized content
- [x] Implement translation utility functions
  - [x] Create `translate` function to resolve translation keys
  - [x] Create helper components for displaying translated content
- [x] Add translation key validation script
  - [x] Build validation to check translation keys in frontmatter
  - [x] Add validation to the build process
  - [x] Fix ESM JSON imports in validation script
  - [x] Update getDictionary function to be ESM compatible

### 5. Content Creation
- [x] Establish LLM relationships in prompt frontmatter (`compatible_llms` and `featured_llms`)
  - [x] Added necessary fields to interfaces
  - [x] Added utility functions to get compatible/featured LLMs
  - [x] Added utility functions to get prompts by compatible/featured LLM
- [x] Implement LLM metadata (name, description, icon, features)
- [x] Implement localization handling
  - [x] Created utility functions to check localization status
  - [x] Added support for translation keys in LLM features
- [ ] Create sample content files for development and testing
  - [ ] Create sample categories in MDX format
  - [ ] Create sample prompts in MDX format
  - [ ] Create sample LLMs in MDX format
- [x] Test content loading on development data
  - [x] Verified MDX content loading for LLMs in both English and Spanish

### 6. Next.js Integration
- [ ] Update page components to use new content utilities
- [ ] Implement category listing page
- [ ] Implement category detail page
- [ ] Implement prompt listing page
- [ ] Implement prompt detail page
- [x] Implement LLM routes:
  - [x] Create [locale]/llms/page.tsx for LLM listing
  - [x] Create [locale]/llms/[slug]/page.tsx for LLM details
  - [x] Add admin view to display localization status
- [ ] Update all import paths
- [x] Add proper typing for frontmatter data

#### LLM Pages Implementation Details

**LLM Listing Page ([locale]/llms/page.tsx)**
- Display all available LLMs for the current locale
- Include name, icon, and short description
- Link to detail pages for each LLM
- Add filters for features

**LLM Detail Page ([locale]/llms/[slug]/page.tsx)**
- Display full LLM information including all features
- Show compatibility with prompts
- Link to compatible prompts
- Display localization status for admin users

**LLM Admin Page**
- Display localization status for all LLMs across all locales
- Show missing translations
- Provide links to edit content

### 7. Testing
- [ ] Test content rendering in all locales
- [ ] Verify relationships between content types
- [ ] Test dynamic routes
- [ ] Test build process
- [ ] Test MDX components in different contexts
- [ ] Performance testing

### 8. Automated Testing & Validation
- [ ] Create automated tests for the MDX content system:
  - [ ] Schema validation for MDX frontmatter
  - [ ] Content structure validation
  - [ ] Relationship validation (ensure parent/child relationships are correctly defined)
- [ ] Create snapshot tests for new MDX components
- [x] Set up content validation script to identify malformed MDX files
- [x] Implement translation key validation for MDX files
- [ ] Create visual regression tests for key pages
- [x] Document validation procedure for content authors
- [ ] Benchmark performance of the filesystem-based approach

### 9. Deployment
- [ ] Test in development environment
- [ ] Verify production build
- [ ] Deploy to production
- [ ] Monitor for issues

### 10. Cleanup & Code Removal
- [ ] Identify and catalog all Supabase content-related code for removal
- [ ] Update pages to use the new MDX-based content system:
  - [ ] Update `/app/[locale]/categories` pages
  - [ ] Update `/app/[locale]/prompts_legacy` pages to use MDX content
  - [ ] Update `/app/[locale]/llms` pages
- [ ] Remove or repurpose Supabase API routes:
  - [ ] Remove or repurpose `/api/categories` endpoints
  - [ ] Remove or repurpose `/api/prompts` endpoints
  - [ ] Remove or repurpose `/api/llms` endpoints
  - [ ] Remove or repurpose `/api/output-samples` endpoints
- [ ] Remove Supabase client instances used solely for content operations
- [ ] Adapt or replace data fetching hooks with MDX content loading:
  - [ ] Replace `useCategories` hook
  - [ ] Replace `usePrompts` hook
  - [ ] Replace `useLLMs` hook
  - [ ] Replace `useOutputSamples` hook
- [ ] Remove unnecessary environment variables related to content DB
- [ ] Update TypeScript types to reflect new content structure
- [ ] Update CI/CD pipelines to exclude content DB operations

### 11. Documentation & Training
- [ ] Update README with new content management approach
- [ ] Create content authoring guidelines for MDX
- [ ] Document content directory structure
- [ ] Create templates for new content types
- [ ] Document component props and interfaces
- [ ] Update contributor documentation
- [ ] Create implementation status report

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

## Sample Content Creation Script

```typescript
// scripts/create-sample-content.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Base directory for content
const contentDir = path.join(process.cwd(), 'content');

// Supported locales
const locales = ['en', 'es'];

/**
 * Create sample categories for development and testing
 */
async function createSampleCategories() {
  // Sample categories data
  const sampleCategories = [
    {
      name: "Creative Writing",
      slug: "creative-writing",
      description: "Prompts for creative writing and storytelling"
    },
    {
      name: "Business Marketing",
      slug: "business-marketing",
      description: "Tools to improve your business marketing content"
    },
    {
      name: "Academic Writing",
      slug: "academic-writing",
      description: "Research and academic content creation"
    },
    // Nested category example
    {
      name: "Professional",
      slug: "professional",
      description: "Professional communication templates",
      children: [
        {
          name: "Email Templates",
          slug: "email-templates",
          description: "Professional email templates for various situations"
        },
        {
          name: "Reports",
          slug: "reports",
          description: "Business and technical report templates"
        }
      ]
    }
  ];
  
  // Create directory structure and files
  for (const locale of locales) {
    const categoryDir = path.join(contentDir, locale, 'categories');
    fs.mkdirSync(categoryDir, { recursive: true });
    
    // Create regular category files
    for (const category of sampleCategories) {
      // Create category file
      const filePath = path.join(categoryDir, `${category.slug}.mdx`);
      const mdxContent = `
<CategoryDescription>
  ${category.description}
</CategoryDescription>

<FeaturedPrompts category="${category.slug}" />
      `;
      
      // Create frontmatter
      const frontmatter = {
        name: category.name,
        slug: category.slug,
        description: category.description
      };
      
      // Write to file
      const fileContent = matter.stringify(mdxContent.trim(), frontmatter);
      fs.writeFileSync(filePath, fileContent);
      console.log(`Created category: ${filePath}`);
      
      // Process nested categories if any
      if (category.children && category.children.length > 0) {
        const nestedDir = path.join(categoryDir, category.slug);
        fs.mkdirSync(nestedDir, { recursive: true });
        
        // Create index.mdx for the parent category
        const indexPath = path.join(nestedDir, 'index.mdx');
        const indexContent = matter.stringify(mdxContent.trim(), frontmatter);
        fs.writeFileSync(indexPath, indexContent);
        console.log(`Created category index: ${indexPath}`);
        
        // Create child category files
        for (const child of category.children) {
          const childPath = path.join(nestedDir, `${child.slug}.mdx`);
          const childContent = `
<CategoryDescription>
  ${child.description}
</CategoryDescription>

<FeaturedPrompts category="${category.slug}/${child.slug}" />
          `;
          
          const childFrontmatter = {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parent: category.slug
          };
          
          const childFileContent = matter.stringify(childContent.trim(), childFrontmatter);
          fs.writeFileSync(childPath, childFileContent);
          console.log(`Created nested category: ${childPath}`);
        }
      }
    }
  }
  
  console.log('Sample categories created successfully');
}

/**
 * Create sample prompts for development and testing
 */
async function createSamplePrompts() {
  // Sample prompts data
  const samplePrompts = [
    {
      title: "Professional Email Template",
      slug: "professional-email-template",
      description: "Create polished and effective professional emails",
      category: "professional/email-templates",
      isPremium: false,
      icon: "fa-envelope",
      compatible_llms: ["chatgpt", "claude", "llama"],
      featured_llms: ["chatgpt", "claude"],
      content: "Write a professional email about: {topic}. Tone should be {tone} and length should be {length}.",
      samples: [
        {
          llm: "chatgpt",
          color: "#10a37f",
          content: "Dear [Name],\n\nI hope this email finds you well...\n\nBest regards,\nYour Name"
        },
        {
          llm: "claude",
          color: "#8e44ef",
          content: "Subject: Project Update\n\nDear [Name],\n\nI wanted to provide you with...\n\nSincerely,\nYour Name"
        }
      ]
    },
    {
      title: "Creative Story Starter",
      slug: "creative-story-starter",
      description: "Jump-start your creative writing with an engaging opening paragraph",
      category: "creative-writing",
      isPremium: false,
      icon: "fa-book",
      compatible_llms: ["chatgpt", "claude", "llama"],
      featured_llms: ["claude"],
      content: "Write an engaging opening paragraph for a {genre} story set in {setting} with a {character_type} protagonist.",
      samples: [
        {
          llm: "claude",
          color: "#8e44ef",
          content: "The wind howled through the abandoned streets of Neo-Tokyo as Kai adjusted his cybernetic implants. The year was 2157, and humanity had long since merged with the machines they once feared..."
        }
      ]
    }
  ];
  
  // Create prompt files
  for (const locale of locales) {
    const promptDir = path.join(contentDir, locale, 'prompts');
    fs.mkdirSync(promptDir, { recursive: true });
    
    for (const prompt of samplePrompts) {
      const filePath = path.join(promptDir, `${prompt.slug}.mdx`);
      
      // Create frontmatter
      const frontmatter = {
        title: prompt.title,
        slug: prompt.slug,
        description: prompt.description,
        category: prompt.category,
        isPremium: prompt.isPremium,
        icon: prompt.icon,
        compatible_llms: prompt.compatible_llms,
        featured_llms: prompt.featured_llms
      };
      
      // Generate MDX content
      let mdxContent = `
<PromptTemplate>
  ${prompt.content}
</PromptTemplate>
`;
      
      // Add samples if available
      if (prompt.samples && prompt.samples.length > 0) {
        mdxContent += `
## Samples

<LlmSampleTabs>
`;
        
        for (const sample of prompt.samples) {
          mdxContent += `
  <LlmSample slug="${sample.llm}" color="${sample.color}">
    ${sample.content}
  </LlmSample>
`;
        }
        
        mdxContent += `
</LlmSampleTabs>
`;
      }
      
      // Write to file
      const fileContent = matter.stringify(mdxContent.trim(), frontmatter);
      fs.writeFileSync(filePath, fileContent);
      console.log(`Created prompt: ${filePath}`);
    }
  }
  
  console.log('Sample prompts created successfully');
}

/**
 * Create sample LLMs for development and testing
 */
async function createSampleLLMs() {
  // Sample LLMs data
  const sampleLLMs = [
    {
      name: "ChatGPT",
      slug: "chatgpt",
      description: "OpenAI's conversational AI model",
      provider: "OpenAI",
      model_name: "gpt-4-turbo",
      features: ["llm.feature.writing", "llm.feature.code", "llm.feature.math"],
      max_tokens: 16000,
      color: "#10a37f"
    },
    {
      name: "Claude",
      slug: "claude",
      description: "Anthropic's helpful and safe AI assistant",
      provider: "Anthropic",
      model_name: "claude-3-opus",
      features: ["llm.feature.writing", "llm.feature.reasoning", "llm.feature.math"],
      max_tokens: 32000,
      color: "#8e44ef"
    },
    {
      name: "Llama",
      slug: "llama",
      description: "Meta's open source large language model",
      provider: "Meta",
      model_name: "llama-3",
      features: ["llm.feature.writing", "llm.feature.code"],
      max_tokens: 8000,
      color: "#0066cc"
    }
  ];
  
  // Create LLM files
  for (const locale of locales) {
    const llmDir = path.join(contentDir, locale, 'llms');
    fs.mkdirSync(llmDir, { recursive: true });
    
    for (const llm of sampleLLMs) {
      const filePath = path.join(llmDir, `${llm.slug}.mdx`);
      
      // Create frontmatter
      const frontmatter = {
        name: llm.name,
        slug: llm.slug,
        description: llm.description,
        provider: llm.provider,
        model_name: llm.model_name,
        features: llm.features,
        max_tokens: llm.max_tokens,
        color: llm.color
      };
      
      // Generate MDX content
      const mdxContent = `
<LlmDescription>
  ${llm.description} from ${llm.provider} that can assist with various tasks.
</LlmDescription>

<RecommendedPrompts llm="${llm.slug}" />
      `;
      
      // Write to file
      const fileContent = matter.stringify(mdxContent.trim(), frontmatter);
      fs.writeFileSync(filePath, fileContent);
      console.log(`Created LLM: ${filePath}`);
    }
  }
  
  console.log('Sample LLMs created successfully');
}

/**
 * Create all sample content
 */
async function createAllSampleContent() {
  // Ensure content directory exists
  fs.mkdirSync(contentDir, { recursive: true });
  
  // Create sample content
  await createSampleCategories();
  await createSamplePrompts();
  await createSampleLLMs();
  
  console.log('All sample content created successfully');
}

// Run the script
createAllSampleContent().catch(console.error);

/**
 * Implementation Guide Generator
 * 
 * This function generates a guide to help with the implementation of the new MDX content system.
 */
async function generateImplementationGuide() {
  // Create a file with implementation guidelines
  const guideFile = path.join(process.cwd(), 'mdx-implementation-guide.md');
  
  let guideContent = `# MDX Implementation Guide\n\n`;
  guideContent += `Generated: ${new Date().toISOString()}\n\n`;
  guideContent += `## Files to Remove\n\n`;
  
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
  guideContent += patterns.map(pattern => `- [ ] \`${pattern}\``).join('\n');
  
  guideContent += `\n\n## Files to Modify\n\n`;
  guideContent += `- [ ] \`src/lib/supabase.ts\` - Remove content-related queries\n`;
  guideContent += `- [ ] \`supabase/seed.sql\` - Remove content seeding\n`;
  guideContent += `- [ ] \`src/app/[locale]/page.tsx\` - Update to use new content API\n`;
  guideContent += `- [ ] \`src/app/[locale]/categories/page.tsx\` - Update to use new content API\n`;
  guideContent += `- [ ] \`src/app/[locale]/prompts/page.tsx\` - Update to use new content API\n`;
  guideContent += `- [ ] \`.env.example\` - Remove content DB variables\n`;
  guideContent += `- [ ] \`README.md\` - Update content management documentation\n`;
  
  // Write the cleanup list file
  fs.writeFileSync(guideFile, guideContent);
  console.log(`Cleanup list generated at: ${guideFile}`);
}

// Add to migration script
if (process.argv.includes('--generate-cleanup')) {
  generateCleanupList().catch(console.error);
}

## Content Loading Implementation

### Core Components 
1. Unified Content Loading System
   - `content.ts`: Central content management for all content types
   - Type-safe content loading with TypeScript generics
   - Locale-aware content management
   - MDX content processing with frontmatter
   - Content validation and error handling

2. Content Types
   - Categories: Navigation and organization
   - Prompts: User-facing content with LLM compatibility
   - LLMs: Model information and features

3. File Structure
   - `/content/{locale}/` - Base content directory
   - `/content/{locale}/categories/` - Category MDX files
   - `/content/{locale}/prompts/` - Prompt MDX files
   - `/content/{locale}/llms/` - LLM MDX files

4. Type System
   - `BaseContent`: Common fields (slug, locale)
   - `Category`: Category-specific fields
   - `Prompt`: Prompt-specific fields with LLM compatibility
   - `LLM`: LLM-specific fields with features

### Migration Status
1. Implemented unified content loading system
2. Migrated all content types to MDX
3. Added type-safe content interfaces
4. Removed standalone content loading files
5. Updated components to use unified system

### Next Steps
1. [ ] Add content validation
   - Validate frontmatter schema
   - Check required fields
   - Verify file structure
   - Test content loading

2. [ ] Enhance error handling
   - Add detailed error messages
   - Implement fallback content
   - Log content loading issues
   - Add development warnings

3. [ ] Implement prompt category filtering
   - Add category sidebar or dropdown
   - Create category-specific views
   - Add category icons and descriptions

4. [ ] Add premium prompt gating
   - Implement authentication system
   - Add premium badge to prompts
   - Create premium preview/teaser UI
   - Add upgrade CTA for premium prompts

5. [ ] Add prompt analytics tracking
   - Track prompt usage and copy events
   - Monitor LLM preferences
   - Gather user feedback
   - Create analytics dashboard

6. [ ] Enhance accessibility
   - Add ARIA labels and roles
   - Implement keyboard navigation
   - Add screen reader descriptions
   - Test with accessibility tools

## Prompts Section 

### File Structure
- `/content/{locale}/prompts/*.mdx` - MDX files for each prompt
- `/src/components/prompts/` - Reusable prompt components
- `/src/app/[locale]/(pages)/prompts/` - Page and layout components
- `/src/lib/prompts.ts` - Utility functions for prompt management
- `/src/styles/prompt.css` - Prompt-specific styles

### Components
1. Base Components 
   - `PromptDescription` - Main description with glass-morphic design
   - `PromptTemplate` - Code-like display with copy functionality
   - `LlmSampleTabs` - Tabbed interface for different LLM outputs
   - `LlmSample` - Individual LLM output with branded colors
   - `PromptInstructions` - Step-by-step usage guide
   - `PromptTips` - Best practices section

2. Pages 
   - `/prompts` - Main prompts listing page
   - `/prompts/[slug]` - Individual prompt pages (dynamic routes)

3. Design System 
   - Glass-morphic UI elements
   - Consistent rounded corners
   - Font hierarchy (Space Grotesk, JetBrains Mono)
   - Color system with LLM-specific branding
   - Interactive elements and animations

### Completed Tasks
1. Implemented MDX components with consistent design
2. Added copy functionality to prompt templates
3. Created glass-morphic design system
4. Added dynamic routing for individual prompts
5. Implemented locale-aware content loading
6. Added breadcrumb navigation
7. Created responsive grid layout for prompts listing

### Next Steps
1. [ ] Add search functionality
   - Implement client-side search with fuzzy matching
   - Add search filters for categories and LLM compatibility
   - Create search results UI with highlighting

2. [ ] Implement prompt category filtering
   - Add category sidebar or dropdown
   - Create category-specific views
   - Add category icons and descriptions

3. [ ] Add premium prompt gating
   - Implement authentication system
   - Add premium badge to prompts
   - Create premium preview/teaser UI
   - Add upgrade CTA for premium prompts

4. [ ] Add prompt analytics tracking
   - Track prompt usage and copy events
   - Monitor LLM preferences
   - Gather user feedback
   - Create analytics dashboard

5. [ ] Enhance accessibility
   - Add ARIA labels and roles
   - Implement keyboard navigation
   - Add screen reader descriptions
   - Test with accessibility tools
