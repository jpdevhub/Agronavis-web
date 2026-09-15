'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';

const categories = ['All', 'Case studies', 'Field tips', 'Product'];

const posts = [
  {
    category: 'Field tips',
    date: 'Oct 12',
    readTime: '4 min read',
    title: 'Precision irrigation, explained without using the word synergy',
    excerpt: 'Where every drop actually goes, and the three habits that waste most of it.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    href: '/blog/precision-irrigation-guide',
  },
  {
    category: 'Case studies',
    date: 'Oct 08',
    readTime: '8 min read',
    title: 'Three seasons of soil repair in the Midwest',
    excerpt: 'Organic matter went up, inputs went down, and nothing about it was fast.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    href: '/blog/restoring-soil-health',
  },
  {
    category: 'Product',
    date: 'Sep 29',
    readTime: '3 min read',
    title: 'What shipped in V3, including the part we got wrong first',
    excerpt: 'Real-time spectral analysis, 14 consult languages, and an app that finally opens fast.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    href: '/blog/agronavis-v3',
  },
];

export default function PostFilter() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* FILTERS */}
      <section className="px-6 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap gap-1 border-b border-hairline">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-[0.9375rem] transition-colors ${
                  cat === active
                    ? 'border-accent font-semibold text-ink'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <Stagger key={active} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <StaggerItem key={post.title} className="h-full">
                <Link
                  href={post.href}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-colors hover:border-hairline-strong"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-2.5 text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-accent">
                      {post.category}
                    </span>
                    <h3 className="text-[1.0625rem] font-bold leading-snug text-ink">{post.title}</h3>
                    <p className="mt-2.5 flex-1 text-[0.875rem] font-light leading-[1.7] text-ink-muted">
                      {post.excerpt}
                    </p>
                    <p className="mt-4 text-[0.8rem] text-ink-faint">
                      {post.date} · {post.readTime}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-ink-faint">Nothing here yet. We have been outside.</p>
          )}
        </div>
      </section>

    </>
  );
}
