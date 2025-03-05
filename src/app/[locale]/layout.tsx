import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
});

// Define the type for params
type Params = {
  locale: string;
};

// Generate metadata based on locale
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
