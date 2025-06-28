/**
 * Root Layout Component
 * 
 * This file defines the root layout for the internationalized application.
 * It handles locale-specific rendering, font loading, and provides the NextIntlClientProvider
 * for internationalization throughout the application.
 * 
 * @module RootLayout
 */

import { Analytics } from '@vercel/analytics/next';
import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getLocaleParams, getLocaleAlternates } from '@/config/i18n';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import "../globals.css";

/**
 * Font configuration for the application
 * 
 * These font objects are used to load and configure the fonts used throughout the application.
 * They are applied to the body element and made available via CSS variables.
 */

// Primary sans-serif font for general text
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font for code and technical content
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Alternative sans-serif font with multiple weights
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
});

/**
 * Type definition for route parameters
 * 
 * @typedef {Object} Params
 * @property {string} locale - The language code for the current locale (e.g., 'en', 'es')
 */
type Params = {
  locale: string;
};

/**
 * Generates metadata for the application based on the current locale
 * 
 * This function dynamically imports the appropriate translation dictionary based on
 * the current locale and uses it to set page metadata like title and description.
 * It also defines canonical URLs and language alternates for SEO purposes.
 * 
 * @param {Object} props - The component props
 * @param {Promise<Params>} props.params - The route parameters containing the locale
 * @returns {Promise<Metadata>} - The localized metadata object
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  
  // Import the messages for the current locale
  const messages = (await import(`../../dictionaries/${locale}.json`)).default;
  
  return {
    title: {
      default: messages.metadata.title,
      template: messages.metadata.titleTemplate,
    },
    description: messages.metadata.description,
    metadataBase: new URL(messages.metadata.siteUrl),
    alternates: {
      canonical: '/',
      languages: getLocaleAlternates(),
    },
    openGraph: {
      title: messages.metadata.title,
      description: messages.metadata.description,
      url: messages.metadata.siteUrl,
      siteName: messages.metadata.title,
      images: [
        {
          url: messages.metadata.siteImage,
          width: 1200,
          height: 630,
          alt: messages.metadata.title,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [messages.metadata.siteImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generates static parameters for all supported locales
 * 
 * This function is used by Next.js during the build process to pre-render pages
 * for all supported locales. It returns an array of locale objects that will be
 * used to generate static pages at build time.
 * 
 * @returns {Array<{locale: string}>} - Array of locale objects for static generation
 */
export function generateStaticParams() {
  // Use centralized locale config from our config file
  return getLocaleParams();
}

/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps all pages in the application.
 * It handles:
 * 1. Setting up the HTML document with the correct language attribute
 * 2. Applying font variables to the body element
 * 3. Providing the NextIntlClientProvider for client-side translations
 * 4. Setting the request locale for server components
 * 
 * The layout is rendered for each locale specified in the route parameters.
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render within the layout
 * @param {Promise<Params>} props.params - The route parameters containing the locale
 * @returns {JSX.Element} - The rendered layout component
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  // Get the locale from params
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
