import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Certificates',
  robots: { index: false, follow: false },
};

/**
 * Admin layout: strips the main site Navbar and Footer so the dashboard
 * fills the screen. The root layout still provides the font and global CSS.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
