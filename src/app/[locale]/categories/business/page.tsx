import { useTranslations } from 'next-intl';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export default function BusinessCategoryPage() {
  const t = useTranslations('home');
  const common = useTranslations('common');
  const categories = useTranslations('common.categories');
  
  // Sample business prompts
  const businessPrompts = [
    {
      id: 'meeting-follow-up',
      title: 'Comprehensive Meeting Follow-up',
      description: 'Create detailed and actionable meeting follow-up emails',
      icon: '📝',
      color: 'bg-accent-150',
      premium: true,
      count: 4.2
    },
    {
      id: 'marketing-copy',
      title: 'Marketing Copy Generator',
      description: 'Generate compelling marketing copy for various channels',
      icon: '📢',
      color: 'bg-accent-150',
      premium: false,
      count: 4.8
    },
    {
      id: 'business-plan',
      title: 'Business Plan Creator',
      description: 'Develop comprehensive business plans with financial projections',
      icon: '📊',
      color: 'bg-accent-150',
      premium: true,
      count: 4.5
    },
    {
      id: 'sales-email',
      title: 'Sales Email Sequence',
      description: 'Create effective sales email sequences that convert',
      icon: '📧',
      color: 'bg-accent-150',
      premium: false,
      count: 4.3
    },
    {
      id: 'social-media',
      title: 'Social Media Content Calendar',
      description: 'Plan and create engaging social media content',
      icon: '📱',
      color: 'bg-accent-150',
      premium: true,
      count: 4.7
    },
    {
      id: 'pitch-deck',
      title: 'Investor Pitch Deck',
      description: 'Create compelling investor pitch decks',
      icon: '💼',
      color: 'bg-accent-150',
      premium: true,
      count: 4.9
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <Breadcrumbs />
        
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent-150 mr-6 flex items-center justify-center">
            <span className="text-2xl">💼</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{categories('business')}</h1>
            <p className="text-gray-400 mt-2">Professional prompts for business and marketing needs</p>
          </div>
        </div>
        
        <div className="mb-10">
          <p className="text-lg text-gray-300">
            Our business prompts help professionals create compelling content, streamline communication, 
            and enhance productivity across various business functions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessPrompts.map((prompt) => (
            <Link 
              key={prompt.id}
              href={`/categories/business/${prompt.id}`}
              className="prompt-card glass rounded-xl p-6 cursor-pointer transition-transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-full ${prompt.color} flex items-center justify-center`}>
                  <span className="text-xl">{prompt.icon}</span>
                </div>
                {prompt.premium && (
                  <span className="bg-accent-100 text-black text-xs font-bold px-2 py-1 rounded">
                    {common('premium')}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{prompt.title}</h3>
              <p className="text-gray-400 mb-4">{prompt.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{prompt.count}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent-100" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 