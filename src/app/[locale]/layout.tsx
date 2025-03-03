import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "SALTBROTH - AI Prompts Marketplace",
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
  params: Params;
}) {
  // Get the locale from params
  const locale = (await params).locale;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
