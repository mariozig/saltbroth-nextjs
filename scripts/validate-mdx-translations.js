#!/usr/bin/env node

/**
 * MDX Translation Validation Script
 * 
 * This script validates that all translation keys used in MDX files exist in the dictionary files.
 * It should be run as part of the build process to catch any missing translations before deployment.
 * 
 * Usage:
 *   node scripts/validate-mdx-translations.js
 */

const { execSync } = require('child_process');

console.log('🔍 Validating translation keys in MDX files...');

try {
  // Run the TypeScript validation script using ts-node
  execSync('npx ts-node scripts/validate-translations.ts', { stdio: 'inherit' });
  console.log('✅ All translation keys are valid!');
  process.exit(0);
} catch (error) {
  console.error('❌ Translation validation failed. Please fix the errors above.');
  process.exit(1);
}
