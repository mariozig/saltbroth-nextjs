# SaltBroth Development Plan

## Overview
We'll build a modern, user-friendly marketplace for AI prompts using Next.js, Tailwind CSS, Supabase, and RevenueCat. The site will support free and premium content, with a focus on mobile-first responsive design following the provided design templates in `./docs/design-template`.

## Tech Stack
- Next.js (latest version)
- Tailwind CSS (latest)
- Supabase (auth, database)
- RevenueCat (subscription management)
- Markdown for prompts

## Design Philosophy

Use the design templates in `./docs/design-template`. This should have pretty much all of the designs you need to work on this site and the various types of content.

## Content Delivery Philosophy

- Pages must load fast
- Prefer static pages over dynamic pages. Dynamic is fine when appropriate.
- Mock content will be hardcoded into the app until we reach a decision about content management approaches

## Phase 1: Project Setup and Foundation

- [ ] **Project Initialization**
  - [x] Set up Next.js project with TypeScript
  - [ ] Configure Tailwind CSS with the design system from templates
    - [ ] Implement color system from `./docs/design-template/js/tailwind.config.js`
    - [ ] Import custom styles from `./docs/design-template/css/styles.css`
  - [ ] Set up project structure (pages, components, hooks, utils)
  - [x] Configure internationalization (i18n) support
    - [x] Installed and configured next-intl package
    - [x] Created translation files for English and Spanish
    - [x] Set up locale-based routing with [locale] parameter
    - [x] Implemented language switcher component
    - [x] Added translations for UI elements and content
  - [x] Set up Supabase client
  - [x] Set up RevenueCat client for subscription management
  - [ ] Create mock content structure and hardcode initial content

- [ ] **Database Schema Design**
  - [ ] Design and implement users table
  - [ ] Design and implement prompts table (with free/premium flag)
  - [ ] Design and implement categories table (with hierarchical structure)
  - [ ] Design and implement LLM outputs table
  - [ ] Design and implement subscriptions table

- [ ] **Authentication System**
  - [ ] Implement Supabase auth integration
  - [ ] Create sign-up flow (with subscription option)
  - [ ] Create sign-in flow
  - [ ] Implement password reset functionality
  - [ ] Set up protected routes for premium content

## Phase 2: Core Features Development

- [ ] **Layout and Navigation**
  - [x] Create responsive layout component with mobile-first approach
    - [x] Implemented basic layout structure with header, main content, and footer
    - [x] Added glass morphism effects for header
  - [x] Implement navigation bar with language switcher
  - [x] Create footer component
  - [ ] Implement breadcrumb navigation (reference `./docs/design-template/prompt-meeting-follow-up-comprehensive.html`)
  - [ ] Populate with hardcoded mock navigation content

- [ ] **Homepage**
  - [x] Design and implement hero section
    - [x] Created hero section with gradient text and call-to-action button
  - [x] Create featured categories section
    - [x] Implemented category cards with icons and hover effects
  - [ ] Implement popular prompts section
  - [ ] Add call-to-action for subscription
  - [ ] Add hardcoded mock content for initial development and testing

- [ ] **Categories System**
  - [ ] Implement category listing page based on `./docs/design-template/categories.html`
  - [ ] Create category detail page following `./docs/design-template/category-business.html`
  - [ ] Build hierarchical category navigation as shown in `./docs/design-template/category-business-professional-content.html`
  - [ ] Add category filtering and search
  - [ ] Create hardcoded mock categories for development

- [ ] **Prompts System**
  - [ ] Create prompt detail page (free and premium versions)
    - [ ] Reference premium design from `./docs/design-template/prompt-meeting-follow-up-comprehensive.html`
    - [ ] Reference minimal design from `./docs/design-template/prompt-meeting-follow-up-minimal.html`
    - [ ] Reference barebones design from `./docs/design-template/prompt-meeting-follow-up-barebones.html`
  - [ ] Implement prompt listing by category
  - [ ] Add prompt search functionality
  - [ ] Build prompt copy functionality (reference JavaScript in `./docs/design-template/js/main.js`)
  - [ ] Develop sample prompt content as hardcoded mock data

- [ ] **LLM Outputs Display**
  - [ ] Create components to display LLM outputs
  - [ ] Implement tabbed interface for different LLM versions (reference tab system in `./docs/design-template/js/main.js`)
  - [ ] Add copy functionality for outputs
  - [ ] Create hardcoded example outputs for demonstration purposes

## Phase 3: Subscription and Payment Integration

- [ ] **RevenueCat Integration**
  - [ ] Set up RevenueCat account and configure products
  - [ ] Implement RevenueCat/purchases-js package
  - [ ] Create subscription checkout flow
  - [ ] Implement webhook handlers for subscription events

- [ ] **User Account Management**
  - [ ] Create account settings page
  - [ ] Implement email update functionality
  - [ ] Add password change feature
  - [ ] Build subscription management interface (cancel, resubscribe)

- [ ] **Premium Content Access Control**
  - [ ] Implement middleware for checking subscription status
  - [ ] Create premium content preview components
  - [ ] Add upgrade prompts for non-subscribers (reference pricing display in `./docs/design-template/prompt-meeting-follow-up-comprehensive.html`)

## Phase 4: Internationalization and Localization

- [x] **Localization Infrastructure**
  - [x] Set up Next.js internationalization routing
    - [x] Configured middleware.ts for locale detection and routing
    - [x] Implemented [locale] parameter in app directory structure
  - [x] Create translation files for supported languages
    - [x] Created English (en.json) and Spanish (es.json) translation files
    - [x] Organized translations with nested structure for better organization
  - [x] Implement language detection and switching
    - [x] Created LanguageSwitcher component with dropdown menu
    - [x] Added locale switching functionality
  - [x] Configure URL structure for localized routes
    - [x] Set up locale prefix in URLs (e.g., /en/, /es/)
    - [x] Configured default locale to work without prefix

- [ ] **Content Localization**
  - [x] Localize UI elements and navigation
    - [x] Added translations for common UI elements, navigation, and content
  - [ ] Implement localized content retrieval from database
  - [x] Create language switcher component
    - [x] Built dropdown language switcher with flags and language names
  - [ ] Add language preferences to user settings
  - [ ] Create hardcoded mock localized content for testing

## Phase 5: Polish and Optimization

- [x] **UI/UX Refinement**
  - [x] Implement glass morphism effects from design templates
    - [x] Applied `.glass` class styling for header
  - [x] Add animations and transitions
    - [x] Added hover effects for category cards
    - [x] Implemented gradient text effects
  - [ ] Ensure consistent styling across all pages
  - [ ] Optimize for mobile devices

- [ ] **Performance Optimization**
  - [ ] Implement image optimization
  - [ ] Add lazy loading for components
  - [ ] Configure caching strategies
  - [ ] Optimize bundle size

- [ ] **SEO and Accessibility**
  - [ ] Implement comprehensive SEO strategy
    - [ ] Create dynamic meta tags for all pages (title, description, OG tags)
    - [ ] Implement canonical URLs for all pages, especially for localized content
    - [ ] Add structured data (JSON-LD) for prompts and categories
    - [ ] Create XML sitemaps with hreflang tags for all languages
    - [ ] Implement robots.txt with appropriate directives
  - [ ] Optimize for search engines
    - [ ] Ensure semantic HTML structure with proper heading hierarchy
    - [ ] Implement keyword-rich URLs for categories and prompts
    - [ ] Add schema markup for breadcrumbs and product information
    - [ ] Optimize page load speed (Core Web Vitals)
  - [ ] Ensure accessibility compliance
    - [ ] Implement proper ARIA attributes (reference ARIA usage in `./docs/design-template/js/main.js`)
    - [ ] Ensure keyboard navigation
    - [ ] Add appropriate alt text for images
    - [ ] Maintain sufficient color contrast
  - [ ] Set up analytics and monitoring
    - [ ] Implement Google Analytics 4
    - [ ] Set up Google Search Console
    - [ ] Create conversion tracking for subscriptions

## Phase 6: Content Management Decision

- [ ] **Evaluate Content Management Approaches**
  - [ ] Assess the performance of hardcoded mock content
  - [ ] Evaluate Supabase as a content management solution
  - [ ] Consider headless CMS options if needed
  - [ ] Make decision on final content management approach

- [ ] **Content Migration**
  - [ ] Develop migration strategy from hardcoded content to chosen solution
  - [ ] Create content models and schemas for the selected approach
  - [ ] Implement content migration scripts
  - [ ] Test content delivery performance

## Phase 7: Testing and Deployment

- [ ] **Testing**
  - [ ] Write unit tests for critical components
  - [ ] Perform integration testing
  - [ ] Conduct cross-browser testing
  - [ ] Test on various mobile devices

- [ ] **Deployment Preparation**
  - [ ] Set up CI/CD pipeline
  - [ ] Configure environment variables
  - [ ] Set up error monitoring
  - [ ] Implement analytics

- [ ] **Launch**
  - [ ] Deploy to production
  - [ ] Monitor for issues
  - [ ] Gather initial user feedback

## Design Implementation Notes

1. **Mobile-First Approach**
   - All components will be designed for mobile first, then expanded for larger screens
   - Use Tailwind's responsive classes consistently as shown in `./docs/design-template/index.html`
   - Test on multiple device sizes throughout development

2. **Design System**
   - Implement the color system from `./docs/design-template/js/tailwind.config.js`
   - Use the glass morphism effects from `./docs/design-template/css/styles.css`
   - Follow the gradient text and button styles from the templates
   - Maintain consistent spacing and typography

3. **Component Structure**
   - Create reusable components for cards, buttons, and other UI elements
   - Follow the hierarchical structure for categories as shown in `./docs/design-template/categories.html`
   - Implement the tabbed interfaces for LLM outputs as shown in `./docs/design-template/prompt-meeting-follow-up-comprehensive.html`

4. **Interactive Elements**
   - Implement the copy functionality for prompts (reference `initializeCopyPrompt()` in `./docs/design-template/js/main.js`)
   - Create the tab system for example outputs (reference `initializeTabs()` in `./docs/design-template/js/main.js`)
   - Add hover effects for cards and buttons as shown in `./docs/design-template/css/styles.css`

5. **Mock Content Development**
   - Create realistic, high-quality mock content for development
   - Structure mock data to mirror expected database schemas
   - Implement mock content in a way that facilitates easy migration later
   - Ensure mock content covers all expected use cases and edge cases

## SEO Strategy and Requirements

1. **Technical SEO Foundation**
   - Leverage Next.js's built-in performance optimizations
   - Implement server-side rendering (SSR) for dynamic content
   - Use static site generation (SSG) for static pages where possible
   - Configure proper caching headers and CDN integration

2. **Content Strategy**
   - Create unique, descriptive titles and meta descriptions for all pages (reference meta tags in `./docs/design-template/index.html`)
   - Develop keyword strategy targeting AI prompt-related search terms
   - Implement content hierarchy with proper H1-H6 usage as shown in design templates
   - Create rich, informative content for category pages (reference `./docs/design-template/category-business.html`)

3. **International SEO**
   - Implement hreflang tags for all localized content
   - Create language-specific sitemaps
   - Ensure proper URL structure for localized content
   - Implement language detection and redirection

4. **Structured Data Implementation**
   - Add Product schema for premium prompts
   - Implement BreadcrumbList schema for navigation paths
   - Add FAQPage schema for FAQ sections
   - Implement Organization schema for brand information

5. **Performance Optimization**
   - Optimize Core Web Vitals (LCP, FID, CLS)
   - Implement responsive images with proper sizing
   - Minimize render-blocking resources
   - Optimize JavaScript and CSS delivery

6. **Monitoring and Improvement**
   - Set up regular SEO audits
   - Monitor keyword rankings and organic traffic
   - Analyze user behavior and adjust strategy accordingly
   - Implement A/B testing for key landing pages