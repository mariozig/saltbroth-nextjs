import Navbar from '@/components/Navbar';

/**
 * Pages Layout
 * 
 * This layout is applied to all pages in the (pages) route group.
 * It includes the Navbar component, which will appear on all pages except the home page.
 */
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
