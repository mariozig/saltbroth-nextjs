import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

// Load the font with a consistent configuration
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: "SaltBroth - AI Prompts Marketplace",
  description: "Discover the best AI prompts for your projects",
};

// Generate static params for locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// Define the type for params
type Params = {
  locale: string;
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Get the locale from params - we need to await it
  const locale = await Promise.resolve(params.locale);
  
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
