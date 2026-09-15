<img src="public/logo.png" alt="Agronavis" width="72" />

# Agronavis — web

Marketing site for Agronavis, a satellite crop-intelligence platform for farmers.
Twelve static pages, dark by default, built on the App Router.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build (all routes prerender static) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript) |

## Pages

| Route | Page |
| --- | --- |
| `/` | Landing |
| `/features` | Platform |
| `/for-farmers` | For farmers |
| `/for-enterprise` | Enterprise |
| `/consult` | Talk to an expert |
| `/pricing` | Plans, comparison table, FAQ |
| `/about` | About |
| `/blog` | Field Notes |
| `/careers` | Open roles |
| `/privacy` · `/terms` | Legal |
| `/status` | Satellite status (ISR, 5 min) |

## Structure

```
app/                     route segments, one folder per page
  globals.css            Tailwind v4 theme tokens + type utilities
  layout.tsx             fonts, metadata, navbar/footer shell
  icon.png               favicon (generated from the brand mark)
components/
  layout/                Navbar, Footer
  ui/                    Reveal, Button, FeatureCard, StatBlock,
                         EyebrowLabel, FaqAccordion, LegalPage
  blog/                  PostFilter, NewsletterForm (client islands)
public/
  images/                hero photography
  logo.png               brand mark
```

Pages are Server Components. Anything that needs state (blog filtering,
the FAQ accordion, the newsletter field, the mobile nav) is isolated into a
small client component so page metadata stays server-rendered.

## Design system

All design decisions live in `app/globals.css` as Tailwind v4 `@theme` tokens —
there is no `tailwind.config.js`.

- **Surfaces** `canvas #080808` · `surface #0e0e0e` · `raised #161616`
- **Accent** `#74d684`, sampled from the leaf in the brand mark. Text on accent is `#07160e`.
- **Ink** white, `55%`, `30%`
- **Type** Space Grotesk via `next/font`, with three fluid steps: `type-display`, `type-h2`, `type-stat`
- **Motion** every scroll animation is `viewport={{ once: true }}`. Nothing loops.

House rules, enforced by review rather than tooling: no gradients, no glow,
no emoji, flat photo overlays only.

## Running from an external drive

This project was developed on an exFAT volume, where macOS writes AppleDouble
`._*` sidecar files next to everything. Next.js picks those up and misbehaves:
the image optimizer serves the sidecar bytes instead of the image, and
Turbopack's filesystem cache fails to open.

`next.config.ts` detects the build host and only applies the workarounds
locally, so nothing needs changing by hand:

```ts
const onCI = !!process.env.VERCEL || process.env.CI === '1' || process.env.CI === 'true';

images: { unoptimized: !onCI }
experimental: {
  turbopackFileSystemCacheForDev: onCI,
  turbopackFileSystemCacheForBuild: onCI,
}
```

On Vercel or any Linux CI runner you get image optimization and cross-run
caching; locally you get the pre-compressed originals (~100-170 KB each) and a
cold Turbopack start.

## Deploying

Any host that runs Next.js 16. The build output is fully static apart from
`/status`, which revalidates every five minutes.

```bash
npm run build && npm run start
```
