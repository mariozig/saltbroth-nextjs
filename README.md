# SALTBROTH

## Overview
 [SALTBROTH](https://saltbroth.com/) is a modern, user-friendly marketplace for AI prompts built using Next.js, Tailwind CSS, Supabase, and RevenueCat. It supports both free and premium content, focusing on a mobile-first responsive design.

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

### Working with Supabase Locally
- **Check Confirmation Emails**: Use Inbucket to view emails sent from Supabase. Access it at [http://127.0.0.1:54324](http://127.0.0.1:54324).
- **Migrate Database**: Use Supabase CLI to run migrations:
   ```bash
   supabase db push
   ```
- **Reset Database**: To reset your local database, run:
   ```bash
   supabase db reset
   ```

## Deployment
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

## Learn More
To learn more about the technologies used in this project, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about styling with Tailwind CSS.
- [Supabase Documentation](https://supabase.io/docs) - learn about using Supabase for authentication and database management.
- [RevenueCat Documentation](https://revenuecat.com/docs) - learn about using RevenueCat for in-app purchases.