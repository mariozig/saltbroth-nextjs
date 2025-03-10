/**
 * Translation Key Validation Script
 * 
 * This script validates that all translation keys used in MDX files exist in the translations.
 * It checks all locales to ensure content is properly localized.
 * 
 * Usage:
 *   npx ts-node scripts/validate-translations.ts
 */

import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { createRequire } from 'node:module';

// Create require for CommonJS modules
const require = createRequire(import.meta.url);

// Use a more modern approach instead of the glob library
async function glob(pattern: string, options: { cwd: string }): Promise<string[]> {
  const cwd = options.cwd;
  const allFiles: string[] = [];
  
  async function scanDir(dir: string) {
    const entries = await fs.readdir(path.join(cwd, dir), { withFileTypes: true });
    
    for (const entry of entries) {
      const relativePath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(relativePath);
      } else if (entry.isFile() && relativePath.endsWith('.mdx')) {
        allFiles.push(relativePath);
      }
    }
  }
  
  await scanDir('');
  return allFiles;
}

// Get the current file path and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import from relative paths with file extensions
import { Locale, locales } from '../src/config/i18n.js';

// Import types but implement locally to avoid ESM JSON import issues
type ValidationResult = {
  key: string;
  valid: boolean;
  file?: string;
};

// Function to read dictionary files directly using fs instead of ESM imports
async function getDictionary(locale: Locale) {
  const filePath = path.join(process.cwd(), 'src', 'dictionaries', `${locale}.json`);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

// Look up a translation key in the specified locale
function lookupTranslation(key: string, dictionary: Record<string, any>): string {
  const parts = key.split('.');
  let result = dictionary;
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      // Translation not found, return the key itself
      return key;
    }
  }
  
  return typeof result === 'string' ? result : key;
}

// Validate a list of translation keys
async function validateTranslationKeys(
  keys: string[],
  locale: Locale
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  const dictionary = await getDictionary(locale);
  
  for (const key of keys) {
    const translation = lookupTranslation(key, dictionary);
    results.push({
      key,
      valid: translation !== key
    });
  }
  
  return results;
}

// Extract translation keys from MDX frontmatter
function extractTranslationKeys(frontmatter: Record<string, any>): string[] {
  const keys: string[] = [];
  
  // Look for translation keys in the features array
  if (Array.isArray(frontmatter.features)) {
    keys.push(...frontmatter.features);
  }
  
  // Add more frontmatter fields that might contain translation keys as needed
  
  return keys;
}

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

interface ValidationError {
  file: string;
  key: string;
  locale: Locale;
}

/**
 * Validate translation keys in MDX files
 */
async function validateMdxTranslationKeys() {
  console.log(`${colors.cyan}Validating translation keys in MDX files...${colors.reset}\n`);
  
  const contentDir = path.join(process.cwd(), 'content');
  const errors: ValidationError[] = [];
  
  // Process each locale
  for (const locale of locales) {
    console.log(`\n${colors.blue}╒═════════════════════════════════════════════╕${colors.reset}`);
    console.log(`${colors.blue}│ Locale: ${locale.toUpperCase().padEnd(34)} │${colors.reset}`);
    console.log(`${colors.blue}╘═════════════════════════════════════════════╛${colors.reset}`);
    
    // Get all MDX files for this locale
    const localeDir = path.join(contentDir, locale);
    
    if (!fsSync.existsSync(localeDir)) {
      console.log(`${colors.yellow}  No content directory for locale: ${locale}${colors.reset}`);
      continue;
    }
    
    const mdxFiles = await glob('**/*.mdx', { cwd: localeDir });
    console.log(`${colors.cyan}  Found ${mdxFiles.length} MDX file(s) for ${locale}${colors.reset}`);
    
    // Print paths to MDX files
    if (mdxFiles.length > 0) {
      console.log(`${colors.magenta}  MDX files in ${locale}:${colors.reset}`);
      mdxFiles.forEach(file => {
        console.log(`    → ${file}`);
      });
    }
    
    // Process each MDX file
    for (const file of mdxFiles) {
      const filePath = path.join(localeDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);
      
      // Extract translation keys from frontmatter
      const keys = extractTranslationKeys(frontmatter);
      
      if (keys.length === 0) {
        continue; // No translation keys in this file
      }
      
      // Validate translation keys
      const results = await validateTranslationKeys(keys, locale);
      
      // Collect errors
      const fileErrors = results.filter(result => !result.valid);
      
      if (fileErrors.length > 0) {
        fileErrors.forEach(error => {
          errors.push({
            file: filePath,
            key: error.key,
            locale,
          });
        });
      }
    }
  }
  
  // Print results
  if (errors.length === 0) {
    console.log(`\n${colors.green}All translation keys are valid!${colors.reset}`);
    return true;
  } else {
    console.log(`\n${colors.red}Found ${errors.length} invalid translation keys:${colors.reset}`);
    
    errors.forEach(error => {
      console.log(`${colors.red}Error:${colors.reset} Missing translation for key "${error.key}" in locale "${error.locale}"`);
      console.log(`${colors.yellow}File:${colors.reset} ${error.file}`);
      console.log('---');
    });
    
    return false;
  }
}

// Run the validation
validateMdxTranslationKeys()
  .then(isValid => {
    if (!isValid) {
      process.exit(1); // Exit with error code to fail CI/CD pipelines
    }
  })
  .catch(error => {
    console.error(`${colors.red}Error:${colors.reset}`, error);
    process.exit(1);
  });
