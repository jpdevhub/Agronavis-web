import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  Product: [
    { label: 'Platform', href: '/features' },
    { label: 'For Farmers', href: '/for-farmers' },
    { label: 'Enterprise', href: '/for-enterprise' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Field Notes', href: '/blog' },
    { label: 'Talk to an expert', href: '/consult' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Satellite status', href: '/status' },
  ],
};

const bottomLinks = [
  { label: 'Careers', href: '/careers' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Satellite status', href: '/status' },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface px-6 pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={64} height={64} className="h-8 w-8" />
              <span className="text-[1.0625rem] font-bold tracking-tight text-ink">Agronavis</span>
            </Link>
            <p className="max-w-[28ch] text-sm font-light leading-relaxed text-ink-muted">
              We watch your field from space so you can go do literally anything else.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-ink-faint">{group}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[0.9375rem] text-ink-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-hairline" />

        <div className="flex flex-col gap-5 pt-6">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {bottomLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.8125rem] text-ink-faint transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.8125rem] text-ink-faint">© {new Date().getFullYear()} Agronavis. Touch grass responsibly.</p>
            <p className="text-[0.8125rem] text-ink-faint">Made for people with dirt under their nails.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
