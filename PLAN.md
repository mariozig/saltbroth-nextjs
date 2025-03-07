# SALTBROTH Development Plan

## Overview
A modern, user-friendly marketplace for AI prompts built using Next.js, Tailwind CSS, Supabase, and RevenueCat. Supports free and premium content, with a focus on mobile-first responsive design following the provided design templates in `./docs/design-template`. 

Hosting is handled by Vercel.

Localization is supported for English and Spanish (right now). Localized content should look like this: 

- site.com/page-title (for English)
- site.com/es/page-title-es (for Spanish)
- site.com/it/page-title (for Italian)
- ...etc

## Tech Stack
- Next.js (latest version)
- Tailwind CSS (latest)
- Supabase (auth, database)
- RevenueCat (subscription management)
- Markdown for prompts
- Vercel (hosting)

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

- [x] **UI Structure and Basic Components**
  - [x] **Layout and Navigation**
    - [x] Create responsive layout component with mobile-first approach
    - [x] Implemented basic layout structure with header, main content, and footer
    - [x] Added glass morphism effects for header
    - [x] Implement navigation bar with language switcher
    - [x] Created LanguageSwitcher component with dropdown menu
    - [x] Added locale switching functionality
    - [x] Create footer component
    - [x] Implement breadcrumb navigation
    - [x] Created Breadcrumbs component with automatic path generation
    - [x] Populate with hardcoded mock navigation content

  - [x] **Homepage**
    - [x] Design and implement hero section
    - [x] Create featured categories section
    - [x] Implement popular prompts section
    - [x] Add call-to-action for subscription
    - [x] Add hardcoded mock content for initial development and testing

  - [x] **Content Localization**
    - [x] Localize UI elements and navigation
    - [x] Added translations for common UI elements, navigation, and content
    - [x] Create language switcher component
    - [x] Implemented with flag icons and language names
    - [x] Added dropdown menu with smooth transitions
    - [x] Create hardcoded mock localized content for testing
    - [x] Added translations for homepage, categories, and common elements

- [x] **Database Schema Design**
  - [x] Design and implement users table
    - [x] Define user fields (id, email, name, created_at, etc.)
    - [x] Set up proper indexes and constraints
    - [x] Implement RLS policies for user access control
  - [x] Design and implement prompts table (with free/premium flag)
    - [x] Define prompt fields (id, title, content, user_id, category_id, premium_flag, etc.)
    - [x] Add support for versioning of prompts
    - [x] Implement RLS policies for premium content access
  - [x] Design and implement categories table (with hierarchical structure)
    - [x] Define category fields (id, name, parent_id, slug, description, etc.)
    - [x] Add support for multi-level categorization via parent_id
    - [x] Implement RLS policies for category management
  - [x] Design and implement LLM outputs table
    - [x] Define output fields (id, prompt_id, model_name, output_text, created_at)
    - [x] Set up proper foreign key constraints
  - [x] Design and implement subscriptions table
    - [x] Define subscription fields (id, user_id, plan_id, status, start_date, end_date)
    - [x] Implement subscription status checks
  - [x] Create database migration scripts
    - [x] Initial schema migration with tables and RLS policies
    - [x] Automatic updated_at triggers for all tables
  - [ ] Set up seed data for development and testing

- [x] **Authentication System**
  - [x] Implement Supabase auth integration
    - [x] Set up Supabase client with environment variables
    - [x] Create auth pages with proper localization support
    - [x] Configure email verification flow
    - [x] Implement auth callback page for handling verification tokens
  - [x] Create sign-up flow (with subscription option)
    - [x] Implement signup form with proper validation
    - [x] Add support for localized content
    - [x] Configure proper email verification redirect URLs
    - [x] Add clear user feedback during signup and verification process
    - [ ] Integrate with subscription options
  - [x] Create sign-in flow
    - [x] Implement login form with validation
    - [x] Add status messages for various auth states (verification pending, verified success, reset success)
    - [x] Support both email and password authentication
  - [x] Implement password reset functionality
    - [x] Create forgot password form
    - [x] Configure password reset email flow
    - [x] Implement callback handling for password reset tokens
  - [ ] Set up protected routes for premium content

## Phase 2: Core Features Development

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

## Phase 3: User Management and Subscription

- [ ] **User Account Management**
  - [ ] Create account settings page
  - [ ] Implement email update functionality
  - [ ] Add password change feature
  - [ ] Create user profile page
  - [ ] Implement user avatar upload and management

- [x] **RevenueCat Integration**
  - [x] Set up RevenueCat account and configure products
  - [x] Implement RevenueCat/purchases-js package
  - [ ] Create subscription checkout flow
  - [ ] Implement webhook handlers for subscription events

- [ ] **Premium Content Access Control**
  - [ ] Implement middleware for checking subscription status
  - [ ] Create premium content preview components
  - [ ] Add upgrade prompts for non-subscribers (reference pricing display in `./docs/design-template/prompt-meeting-follow-up-comprehensive.html`)
  - [ ] Create subscription management interface (cancel, resubscribe)

## Phase 4: Polish and Optimization

- [x] **UI/UX Refinement**
  - [x] Implement glass morphism effects from design templates
    - [x] Added glass effect to navigation bar
    - [x] Applied to cards and UI elements
  - [x] Add animations and transitions
    - [x] Added hover effects for cards and buttons
    - [x] Implemented smooth transitions for interactive elements
  - [ ] Ensure consistent styling across all pages
  - [ ] Optimize for mobile devices
  - [ ] Implement dark mode toggle
  - [ ] Add loading states and skeleton screens

- [ ] **Performance Optimization**
  - [ ] Implement image optimization
  - [ ] Add lazy loading for components
  - [ ] Configure caching strategies
  - [ ] Optimize bundle size
  - [ ] Implement code splitting

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

## Development Roadmap

## Completed (Q1 2025)
- Core marketplace functionality
- Subscription system integration
- Internationalization support
- Production environment setup
