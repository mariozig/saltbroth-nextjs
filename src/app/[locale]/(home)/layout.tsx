/**
 * Home Layout
 * 
 * This layout is applied to all pages in the (home) route group.
 * It intentionally does not include the Navbar component, ensuring
 * the home page is displayed without a navigation bar.
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
