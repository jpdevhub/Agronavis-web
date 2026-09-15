import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import PostFilter from '@/components/blog/PostFilter';
import NewsletterForm from '@/components/blog/NewsletterForm';

export const metadata: Metadata = {
  title: 'Field Notes: stuff we learned in the dirt',
  description:
    'Case studies, field tips and product notes from Agronavis. Including the experiments that went badly, because those are the useful ones.',
};

const featured = {
  category: 'Case study',
  author: 'Sarah Thompson',
  readTime: '6 min read',
  title: 'We cut a Rajasthan farm’s water use by 40% and nobody had to buy equipment',
  excerpt:
    'Four generations farmed this land by feel. One season of orbital data later, the irrigation schedule looks completely different, and the yield went up.',
  image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
  href: '/blog/rajasthan-case-study',
};


export default function BlogPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-6 pt-[calc(var(--spacing-nav)+6rem)] pb-14">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal y={40}>
            <EyebrowLabel>Field notes</EyebrowLabel>
            <h1 className="type-display max-w-[14ch] text-balance">Stuff we learned in the dirt.</h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-[50ch] text-[1.0625rem] font-light leading-[1.75] text-ink-muted">
              Case studies, field tips and product notes. Including the experiments that went badly, because
              those are the useful ones.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <Link
              href={featured.href}
              className="group grid overflow-hidden rounded-xl border border-hairline transition-colors hover:border-hairline-strong lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px]">
                <Image
                  src={featured.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between bg-surface p-8 md:p-10">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-accent">
                      {featured.category}
                    </span>
                    <span className="text-[0.8125rem] text-ink-faint">
                      {featured.author} · {featured.readTime}
                    </span>
                  </div>
                  <h2 className="type-h2 text-balance">{featured.title}</h2>
                  <p className="mt-5 text-base font-light leading-[1.75] text-ink-muted">{featured.excerpt}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-accent">
                  Read the whole thing{' '}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <PostFilter />

      {/* NEWSLETTER */}
      <section className="border-t border-hairline bg-surface px-6 py-20">
        <div className="mx-auto w-full max-w-6xl text-center">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">One email a week. That is the deal.</h2>
            <p className="mx-auto mt-3 max-w-[44ch] text-[0.9375rem] font-light text-ink-muted">
              Five thousand farmers read it. Unsubscribe whenever, we will not take it personally.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
