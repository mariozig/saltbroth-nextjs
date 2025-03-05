import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';

export default function Home() {
  const t = useTranslations('home');
  const common = useTranslations('common');
  const categories = useTranslations('common.categories');
  const footer = useTranslations('common.footer');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      <main className="pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <section className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold gradient-text glow mb-6">{t('hero.title')}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">{t('hero.subtitle')}</p>
          <button className="gradient-button px-8 py-3 rounded-full text-lg font-medium">{t('hero.cta')}</button>
        </section>

        <section className="mb-20">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('featuredCategories.title')}</h3>
              <p className="text-gray-400">{t('featuredCategories.subtitle')}</p>
            </div>
            <a href="#" className="text-accent-100 hover:underline">{common('viewAll')}</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="category-card glass rounded-xl p-6 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-accent-100 mb-4 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{categories('creative')}</h4>
              <p className="text-gray-400">24 prompts</p>
            </div>

            <div className="category-card glass rounded-xl p-6 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-accent-150 mb-4 flex items-center justify-center">
                <span className="text-xl">💼</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{categories('business')}</h4>
              <p className="text-gray-400">32 prompts</p>
            </div>

            <div className="category-card glass rounded-xl p-6 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-accent-200 mb-4 flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{categories('visualArts')}</h4>
              <p className="text-gray-400">18 prompts</p>
            </div>

            <div className="category-card glass rounded-xl p-6 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-accent-250 mb-4 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">{categories('educational')}</h4>
              <p className="text-gray-400">27 prompts</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black/30 py-10">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          <div className="divider mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold gradient-text">{common('appName')}</h2>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white">{footer('about')}</a>
              <a href="#" className="text-gray-400 hover:text-white">{footer('contact')}</a>
              <a href="#" className="text-gray-400 hover:text-white">{footer('terms')}</a>
              <a href="#" className="text-gray-400 hover:text-white">{footer('privacy')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
