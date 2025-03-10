import { MetadataRoute } from 'next'
import { getAllLocalizedUrls } from '@/config/i18n'
import { getAllCategories, getAllPrompts } from '@/app/api/prompts/prompts'

/**
 * Generate a localized sitemap with hreflang tags
 * 
 * This function creates a sitemap.xml file that includes:
 * 1. All major application routes
 * 2. Alternate language versions for each URL (hreflang)
 * 
 * In a production environment, you would want to dynamically fetch:
 * - All category slugs from the database
 * - All prompt slugs from the database
 * 
 * @returns A sitemap configuration with localized URLs
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saltbroth.com'
  
  // Define primary routes (static routes that exist for all locales)
  const routes = [
    '', // homepage
    '/categories', 
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ]

  // For production builds, always use static data to prevent fetch failures
  let categories = []
  let prompts = []
  
  if (process.env.NODE_ENV === 'production') {
    console.log('Using static data for sitemap in production build')
    categories = [
      { slug: 'creative-writing' },
      { slug: 'business' },
      { slug: 'business/email' }
    ]
    prompts = [
      { slug: 'story-starter' },
      { slug: 'email-template' },
      { slug: 'cold-outreach' }
    ]
  } else {
    // Only attempt to fetch data in development environment
    try {
      categories = await getAllCategories()
    } catch (error) {
      console.error('Error fetching categories for sitemap:', error)
      // Provide fallback for development
      categories = [
        { slug: 'creative-writing' },
        { slug: 'business' },
        { slug: 'business/email' }
      ]
    }
    
    try {
      prompts = await getAllPrompts()
    } catch (error) {
      console.error('Error fetching prompts for sitemap:', error)
      // Provide fallback for development
      prompts = [
        { slug: 'story-starter' },
        { slug: 'email-template' },
        { slug: 'cold-outreach' }
      ]
    }
  }
  
  // Generate routes for each category
  const categoryRoutes = categories.map(category => `/categories/${category.slug}`)
  
  // Generate routes for each prompt
  const promptRoutes = prompts.map(prompt => `/prompts/${prompt.slug}`)
  
  // Combine all routes
  const allRoutes = [...routes, ...categoryRoutes, ...promptRoutes]
  
  // Create a localized sitemap entry for each route with alternates
  const sitemapEntries = allRoutes.map(route => {
    // Generate localized URLs for all supported languages
    const alternateLanguages = getAllLocalizedUrls(route, baseUrl)
    
    // Default URL is the one with the default locale
    const url = `${baseUrl}${route}`
    
    // Determine appropriate change frequency and priority based on route type
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
    let priority = 0.7
    
    if (route === '') {
      // Homepage
      changeFrequency = 'daily'
      priority = 1.0
    } else if (route === '/categories') {
      // Categories landing page
      changeFrequency = 'weekly'
      priority = 0.9
    } else if (route.startsWith('/categories/')) {
      // Individual category pages
      changeFrequency = 'weekly'
      priority = 0.8
    } else if (route.startsWith('/prompts/')) {
      // Individual prompt pages
      changeFrequency = 'monthly'
      priority = 0.6
    }
    
    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
      // Add hreflang alternate URLs
      alternates: {
        languages: alternateLanguages,
      },
    }
  })
  
  return sitemapEntries
}
