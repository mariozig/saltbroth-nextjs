/**
 * Translation Key Validation Script
 * 
 * This script validates that all translation keys used in MDX files exist in the translations.
 * It checks all locales to ensure content is properly localized.
 * 
 * Usage:
 *   npx ts-node scripts/validate-translations.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Import glob with proper typing
const globImport = require('glob');
const glob = (pattern: string, options: any): Promise<string[]> => {
  return globImport.glob(pattern, options);
};
import { Locale, locales } from '../src/config/i18n';
import { 
  validateTranslationKeys, 
  extractTranslationKeys,
  ValidationResult
} from '../src/lib/translation';

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
    console.log(`${colors.blue}Checking locale: ${locale}${colors.reset}`);
    
    // Get all MDX files for this locale
    const localeDir = path.join(contentDir, locale);
    
    if (!fs.existsSync(localeDir)) {
      console.log(`${colors.yellow}No content directory for locale: ${locale}${colors.reset}`);
      continue;
    }
    
    const mdxFiles = await glob('**/*.mdx', { cwd: localeDir });
    console.log(`Found ${mdxFiles.length} MDX files`);
    
    // Process each MDX file
    for (const file of mdxFiles) {
      const filePath = path.join(localeDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
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
