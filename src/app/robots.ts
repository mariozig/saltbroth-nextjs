import { MetadataRoute } from 'next'

/**
 * Generate robots.txt configuration
 * 
 * This function generates a robots.txt file that:
 * 1. Allows crawling of public pages
 * 2. Disallows crawling of auth pages and API routes
 * 3. References the sitemap for better search engine indexing
 * 
 * @returns {MetadataRoute.Robots} The robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saltbroth.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/*',     // Prevent crawling of auth pages
          '/api/*',      // Prevent crawling of API routes
          '*/preview/*', // Prevent crawling of preview pages
          '/private/*',  // Prevent crawling of private pages
        ],
      },
      {
        userAgent: 'GPTBot', // Specific rules for GPT crawler
        disallow: ['/'],     // Opt out of GPT crawling
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
