import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';

// Define the type for params
type Params = {
  locale: string;
};

// Generate metadata based on locale
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  
  // Import the messages for the current locale
  const messages = (await import(`../../dictionaries/${locale}.json`)).default;
  
  return {
    title: messages.metadata.title,
    description: messages.metadata.description,
    // Add other metadata properties as needed
    alternates: {
      canonical: '/',
      languages: {
        'en': '/',
        'es': '/es',
      },
    },
  };
}

// Generate static params for locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  // Get the locale from params
  const { locale } = await params;
  
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
