'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment } from 'react';

type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent?: boolean;
};

type BreadcrumbsProps = {
  items?: BreadcrumbItem[];
  homeLabel?: string;
};

export default function Breadcrumbs({ items = [], homeLabel }: BreadcrumbsProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  
  // If no items are provided, generate them from the pathname
  const breadcrumbItems = items.length > 0 
    ? items 
    : generateBreadcrumbsFromPath(pathname, locale, homeLabel || t('home'));
  
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm">
      <ol className="flex flex-wrap items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && (
              <li className="text-gray-400 mx-1">
                <span>/</span>
              </li>
            )}
            <li>
              {item.isCurrent ? (
                <span className="text-gray-200 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="text-accent-100 hover:text-accent-50 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from the current path
function generateBreadcrumbsFromPath(pathname: string, locale: string, homeLabel: string): BreadcrumbItem[] {
  // Remove locale prefix from pathname
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
  
  // Split the path into segments
  const segments = pathWithoutLocale.split('/').filter(Boolean);
  
  // Create the home item
  const items: BreadcrumbItem[] = [
    { label: homeLabel, href: `/${locale}`, isCurrent: segments.length === 0 }
  ];
  
  // Build the breadcrumb items
  let currentPath = `/${locale}`;
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format the label (capitalize and replace hyphens with spaces)
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    items.push({
      label,
      href: currentPath,
      isCurrent: index === segments.length - 1
    });
  });
  
  return items;
} 