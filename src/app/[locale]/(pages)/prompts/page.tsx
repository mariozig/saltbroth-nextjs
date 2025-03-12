import { getTranslations } from 'next-intl/server';
import { getAllContent, type Prompt } from '@/lib/content';
import { type Locale } from '@/config/i18n';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

// Next.js 15 uses Promise-based params
export default async function PromptsPage({ params }: {
  params: Promise<{ locale: string }>
}) {
  // Await params before using them
  const { locale } = await params;
  
  // Get translations for prompts namespace
  const t = await getTranslations('prompts');
  
  const prompts = await getAllContent<Prompt>(locale as Locale, 'prompts');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: t('prompts'), href: '/prompts' },
        ]}
      />

      <h1 className="font-space text-4xl font-bold tracking-tight mb-6">
        {t('prompts')}
      </h1>

      <p className="text-lg text-white/60 mb-12">
        {t('browseCategoriesDescription')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <Link
            key={prompt.slug}
            href={`/prompts/${prompt.slug}`}
            className="block p-6 rounded-3xl bg-white/5 backdrop-blur hover:bg-white/10 transition-colors"
          >
            <h2 className="font-medium text-xl mb-2">{prompt.title}</h2>
            <p className="text-white/60">{prompt.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
