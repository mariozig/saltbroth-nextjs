# SALTBROTH - AI Prompt Marketplace

## Overview
[SALTBROTH](https://saltbroth.com/) is a modern, user-friendly marketplace for AI prompts built using Next.js, Tailwind CSS, and RevenueCat. It supports both free and premium content, focusing on a mobile-first responsive design and multilingual support through a filesystem-based MDX content approach.

## Features
- Next.js 15 with App Router
- Internationalization (i18n) with JSON dictionaries
- MDX-based content management with localization support
- Interactive MDX components for rich content presentation
- File-based content organization by locale and type
- Automatic translation key validation
- RevenueCat subscription management

## MDX Content Management

SALTBROTH uses a file-based MDX content system to store and display all content with localization support. This approach offers several advantages:

- **Simplified content management**: Content is stored in MDX files within a structured directory hierarchy
- **Built-in localization**: Content is organized by locale for easy translation
- **Interactive components**: MDX supports React components for rich interactive content
- **Version control**: Content changes can be tracked in git
- **Validation**: Automatic validation of translation keys ensures content integrity

### Directory Structure

```
content/
  ├── en/                   # English content
  │   ├── categories/       # Categories content
  │   ├── prompts/          # Prompts content
  │   └── llms/             # LLMs content
  │       └── gpt-4.mdx     # Example LLM file
  └── es/                   # Spanish content
      ├── categories/       # Categories content
      ├── prompts/          # Prompts content
      └── llms/             # LLMs content
          └── gpt-4.mdx     # Example LLM file
```

### MDX Components

The following custom components are available for MDX content:

- `<LlmFeatures>`: Displays LLM features using translation keys
- `<PromptTemplate>`: Formats and displays prompt templates
- `<LlmSample>`: Displays sample outputs from an LLM
- `<LlmSampleTabs>`: Provides a tabbed interface for viewing multiple LLM samples

### Translation Keys

Translation keys are used throughout the MDX content to ensure proper localization. These keys are defined in the dictionary files (`src/dictionaries/en.json` and `src/dictionaries/es.json`).

Example frontmatter with translation keys:

```yaml
---
name: GPT-4
slug: gpt-4
description: "OpenAI's most advanced large language model, optimized for complex tasks."
features:
  - llm.features.reasoning
  - llm.features.creativity
  - llm.features.knowledge
---
```

### Validation

Translation keys are validated during the build process using the `validate-translations` script. This ensures that all translation keys used in MDX files are defined in the dictionary files.

```bash
npm run validate-translations
```

## Configuration

### Environment Variables

#### Development (.env.local)
```bash
# NextJS Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # Required for authentication callbacks

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-local-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key

# RevenueCat Configuration
NEXT_PUBLIC_REVENUECAT_API_KEY=your-sandbox-key
```

#### Production (.env.production)
```bash
# NextJS Configuration
NEXT_PUBLIC_SITE_URL=https://saltbroth.com     # Required for authentication callbacks

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-prod-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key

# RevenueCat Configuration
NEXT_PUBLIC_REVENUECAT_API_KEY=your-prod-key
```

The `NEXT_PUBLIC_SITE_URL` is crucial for:
- Authentication callback URLs
- OAuth redirects
- Absolute URL generation

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Supabase account for authentication and database management

### Local Development
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd saltbroth
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Management with Supabase

#### Environment Management
Supabase CLI uses project references to determine which environment to target. Here's how to switch between environments:

1. **Local Development** (default after `supabase start`):
   ```bash
   # No explicit reference needed for local development
   supabase start    # Starts local services
   supabase db ...   # Commands target local by default
   ```

2. **Production Environment**:
   ```bash
   # Link to production project (one-time setup)
   supabase link --project-ref your-project-ref
   
   # Run commands against production
   supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Switch Between Environments**:
   ```bash
   # For local development
   supabase db reset --local
   
   # For production
   supabase db reset --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

#### Local Development
1. **Start Supabase Services**:
   ```bash
   supabase start
   ```

2. **Create New Migration**:
   ```bash
   supabase migration new my_migration_name
   ```
   This creates a new timestamped SQL file in `supabase/migrations/`

3. **Apply Migrations Locally**:
   ```bash
   supabase db reset    # Reset and reapply all migrations
   # or
   supabase db push     # Apply pending migrations only
   ```

4. **Check Migration Status**:
   ```bash
   supabase db status   # View pending migrations
   ```

5. **View Database Changes**:
   - Studio UI: [http://127.0.0.1:54323](http://127.0.0.1:54323)
   - Email Testing: [http://127.0.0.1:54324](http://127.0.0.1:54324)

#### Production Deployment
1. **Link to Production Project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. **Deploy Migrations to Production**:
   ```bash
   supabase db push     # Apply pending migrations
   ```

3. **View Migration History**:
   ```bash
   supabase migration list
   ```

4. **Revert Last Migration** (if needed):
   ```bash
   supabase db reset --db-only   # Local development only
   ```

#### Best Practices
- Always test migrations locally first
- Use meaningful migration names
- Include `down` migrations for reversibility
- Back up production data before major migrations

## Development Setup
```bash
npm install
npm run dev
```

## Deployment
```bash
npm run build
npm start
```

## Deployment (Vercel)
SALTBROTH is hosted on Vercel. To deploy your app via command line:
1. Install the Vercel CLI globally:
   ```bash
   brew install vercel-cli
   ```
2. Navigate to your project directory:
   ```bash
   cd path/to/your/saltbroth
   ```
3. Run the following command to deploy:
   ```bash
   vercel
   ```
4. Follow the prompts to complete the deployment process. Your app will be live at [https://saltbroth.com/](https://saltbroth.com/).

## Vercel Deployment
1. Connect the GitHub repository
2. Set environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_REVENUECAT_API_KEY
3. Enable Automatic CI/CD

## Learn More
To learn more about the technologies used in this project, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about styling with Tailwind CSS.
- [Supabase Documentation](https://supabase.io/docs) - learn about using Supabase for authentication and database management.
- [RevenueCat Documentation](https://revenuecat.com/docs) - learn about using RevenueCat for in-app purchases.