# SALTBROTH Development Plan

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

- [x] **Project Initialization**
  - [x] Set up Next.js project with TypeScript
  - [x] Configure Tailwind CSS with the design system from templates
    - [x] Implemented Plus Jakarta Sans as the primary font using Next.js font module
    - [x] Configured Tailwind to use Plus Jakarta Sans as the default sans-serif font
    - [x] Implement color system from `./docs/design-template/js/tailwind.config.js`
    - [x] Import custom styles from `./docs/design-template/css/styles.css`
  - [x] Set up project structure (pages, components, hooks, utils)
    - [x] Created components directory with UI, layout, and features subdirectories
    - [x] Created hooks and utils directories
    - [x] Created lib directory for external services integration
  - [x] Configure internationalization (i18n) support
    - [x] Installed and configured next-intl package
    - [x] Created translation files for English and Spanish
    - [x] Set up locale-based routing with [locale] parameter
    - [x] Implemented language switcher component
    - [x] Added translations for UI elements and content
    - [x] Configured localized metadata using translation files
  - [x] Set up Supabase client
    - [x] Installed @supabase/supabase-js package
    - [x] Created supabase.ts client in lib directory
    - [x] Configured environment variables for Supabase URL and anon key
  - [x] Set up RevenueCat client for subscription management
    - [x] Installed @revenuecat/purchases-js package
    - [x] Created revenuecat.ts client in lib directory with initialization and helper functions
    - [x] Configured environment variables for RevenueCat API key
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

- [x] **Layout and Navigation**
  - [x] Create responsive layout component with mobile-first approach
    - [x] Implemented basic layout structure with header, main content, and footer
    - [x] Added glass morphism effects for header
  - [x] Implement navigation bar with language switcher
    - [x] Created LanguageSwitcher component with dropdown menu
    - [x] Added locale switching functionality
  - [x] Create footer component
    - [x] Implemented footer with links and copyright information
  - [x] Implement breadcrumb navigation
    - [x] Created Breadcrumbs component with automatic path generation
  - [x] Populate with hardcoded mock navigation content

- [x] **Homepage**
  - [x] Design and implement hero section
  - [x] Create featured categories section
  - [x] Implement popular prompts section
  - [x] Add call-to-action for subscription
  - [x] Add hardcoded mock content for initial development and testing

- [ ] **Categories System**
  - [ ] Implement category listing page based on `./docs/design-template/categories.html`
  - [x] Create category detail page following `./docs/design-template/category-business.html`
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

- [x] **RevenueCat Integration**
  - [x] Set up RevenueCat account and configure products
  - [x] Implement RevenueCat/purchases-js package
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
    - [x] Added metadata section to translation files for SEO
  - [x] Implement language detection and switching
    - [x] Created LanguageSwitcher component with dropdown menu
    - [x] Added locale switching functionality
  - [x] Configure URL structure for localized routes
    - [x] Set up locale prefix in URLs (e.g., /en/, /es/)
    - [x] Configured default locale to work without prefix

- [x] **Content Localization**
  - [x] Localize UI elements and navigation
    - [x] Added translations for common UI elements, navigation, and content
  - [ ] Implement localized content retrieval from database
  - [x] Create language switcher component
    - [x] Implemented with flag icons and language names
    - [x] Added dropdown menu with smooth transitions
  - [ ] Add language preferences to user settings
  - [x] Create hardcoded mock localized content for testing
    - [x] Added translations for homepage, categories, and common elements

## Phase 5: Polish and Optimization

- [x] **UI/UX Refinement**
  - [x] Implement glass morphism effects from design templates
    - [x] Added glass effect to navigation bar
    - [x] Applied to cards and UI elements
  - [x] Add animations and transitions
    - [x] Added hover effects for cards and buttons
    - [x] Implemented smooth transitions for interactive elements
  - [ ] Ensure consistent styling across all pages
  - [ ] Optimize for mobile devices

- [ ] **Performance Optimization**
  - [ ] Implement image optimization
  - [ ] Add lazy loading for components
  - [ ] Configure caching strategies
  - [ ] Optimize bundle size

- [ ] **SEO and Accessibility**
  - [x] Implement comprehensive SEO strategy
    - [x] Create dynamic meta tags for all pages (title, description)
    - [x] Implement canonical URLs for all pages, especially for localized content
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

- [ ] **Deployment**
  - [ ] Set up CI/CD pipeline
  - [ ] Configure production environment
  - [ ] Implement monitoring and error tracking
  - [ ] Deploy to production

- [ ] **Post-Launch**
  - [ ] Gather user feedback
  - [ ] Implement analytics tracking
  - [ ] Plan for future features and improvements
  - [ ] Establish regular maintenance schedule