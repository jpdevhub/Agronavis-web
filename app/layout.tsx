import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Agronavis: satellite intel for people who actually farm',
    template: '%s | Agronavis',
  },
  description:
    'Agronavis reads your field from orbit and tells you what it means in plain language. Free for small farms, serious at national scale.',
  keywords: ['precision agriculture', 'satellite farming', 'crop monitoring', 'AgTech', 'Agronavis'],
  openGraph: {
    siteName: 'Agronavis',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="bg-canvas text-ink font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
