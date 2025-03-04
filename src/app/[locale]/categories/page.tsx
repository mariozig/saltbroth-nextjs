import { useTranslations } from 'next-intl';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export default function CategoriesPage() {
  const common = useTranslations('common');
  const categories = useTranslations('common.categories');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <Breadcrumbs />
        
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{common('categoriesNav')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Creative Writing Category */}
          <Link 
            href="/categories/creative" 
            className="category-card glass rounded-xl p-8 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-accent-100 mb-6 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">{categories('creative')}</h2>
            <p className="text-gray-400 mb-4">Enhance your creative writing with AI-powered prompts</p>
            <div className="flex items-center text-accent-100">
              <span>24 prompts</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          {/* Business Category */}
          <Link 
            href="/categories/business" 
            className="category-card glass rounded-xl p-8 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-accent-150 mb-6 flex items-center justify-center">
              <span className="text-2xl">💼</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">{categories('business')}</h2>
            <p className="text-gray-400 mb-4">Professional prompts for business and marketing needs</p>
            <div className="flex items-center text-accent-100">
              <span>32 prompts</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          {/* Visual Arts Category */}
          <Link 
            href="/categories/visual-arts" 
            className="category-card glass rounded-xl p-8 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-accent-200 mb-6 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">{categories('visualArts')}</h2>
            <p className="text-gray-400 mb-4">Prompts designed for visual arts and design</p>
            <div className="flex items-center text-accent-100">
              <span>18 prompts</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
          
          {/* Educational Category */}
          <Link 
            href="/categories/educational" 
            className="category-card glass rounded-xl p-8 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-accent-250 mb-6 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">{categories('educational')}</h2>
            <p className="text-gray-400 mb-4">Educational prompts for learning and teaching</p>
            <div className="flex items-center text-accent-100">
              <span>27 prompts</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 