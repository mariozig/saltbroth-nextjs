import Navbar from '@/components/Navbar';

/**
 * Pages Layout
 * 
 * This layout is applied to all pages in the (pages) route group.
 * It includes the Navbar component and ensures proper spacing below it
 * to prevent content overlap with the fixed navbar.
 */
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-[72px]"> {/* Add padding-top to account for navbar height */}
        {children}
      </div>
    </>
  );
}
