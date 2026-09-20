# Agronavis

### Intelligence for every field.

Agronavis is an AI-powered geospatial agritech platform that turns satellite data, Earth
observation, and machine learning into simple, actionable intelligence for agriculture.

The platform combines Sentinel-1 SAR, Sentinel-2 multispectral imagery, remote sensing, GIS
layers, weather data, and ML models to describe what is happening across every field, from
crop health and field change to risk, insight, and decision.

```text
Satellite Data
      |
Earth Observation
      |
AI + Geospatial Intelligence
      |
Farm Insights
      |
Better Decisions
```

Live at **[agronavis.in](https://agronavis.in)**

---

## About this repository

This is the **public web platform** for Agronavis: twelve statically rendered pages covering
the product, the audiences it serves, pricing, and the company. Every form on the site posts to
the Agronavis API, which delivers submissions to the support inbox.

```text
Browser
   |  static pages served from the edge
Next.js on Vercel
   |  POST /api/*        NEXT_PUBLIC_API_URL, no credentials
Agronavis API on Render
   |  RESEND_API_KEY     server-side only
contact@agronavis.in
```

No secret ever reaches the client. The browser knows one thing about the backend: its URL.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16, App Router, Turbopack |
| UI | React 19, TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, CSS-first theme |
| Motion | Framer Motion |
| Icons | Lucide |
| Typeface | Space Grotesk via `next/font` |
| Hosting | Vercel |

---

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev                  # http://localhost:3000
```

Forms need the API running alongside the site. From the backend repository:

```bash
npm run dev                  # http://localhost:8080
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run fresh` | Clears the build cache, then starts the development server |
| `npm run clean` | Removes `.next` and any AppleDouble sidecar files |
| `npm run build` | Production build; every route prerenders |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint, `next/core-web-vitals` plus TypeScript |

---

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Agronavis API. Public by design; it carries no credential. |

Set it to `http://localhost:8080` locally and to the Render service URL in Vercel, for
Production, Preview, and Development.

---

## Routes

| Route | Page | Rendering |
| --- | --- | --- |
| `/` | Landing | Static |
| `/features` | Platform capabilities | Static |
| `/for-farmers` | Smallholder audience | Static |
| `/for-enterprise` | Institutional audience, demo form | Static |
| `/consult` | Expert network, contact form | Static |
| `/pricing` | Plans, comparison, FAQ | Static |
| `/about` | Mission and values | Static |
| `/blog` | Field Notes, newsletter form | Static |
| `/careers` | Open roles, application form | Static |
| `/privacy` | Privacy policy | Static |
| `/terms` | Terms of service | Static |
| `/status` | Service health | ISR, 5 minutes |

---

## Project structure

```text
app/
  globals.css            Tailwind v4 @theme tokens and type utilities
  layout.tsx             Fonts, metadata, navbar and footer shell
  icon.png               Favicon generated from the brand mark
  <segment>/page.tsx     One folder per route
components/
  layout/                Navbar, Footer
  ui/                    Reveal, Button, FeatureCard, StatBlock,
                         EyebrowLabel, FaqAccordion, LegalPage
  forms/                 Field primitives, submit hook, and the
                         contact, demo, and careers forms
  blog/                  PostFilter, NewsletterForm
lib/
  api.ts                 Typed client for the Agronavis API
public/
  images/                Hero photography
  logo.png               Brand mark
```

Pages are Server Components. Anything holding state, such as form submission, blog filtering,
the FAQ accordion, and the mobile navigation, is isolated into a small client component so
pages keep server-rendered metadata.

---

## Forms

Four forms post to the API. Each shares one submission hook and one field library, so
validation, error display, and success states behave identically everywhere.

| Form | Page | Endpoint |
| --- | --- | --- |
| Consult request | `/consult` | `POST /api/contact` |
| Enterprise demo | `/for-enterprise` | `POST /api/demo` |
| Job application | `/careers` | `POST /api/careers` |
| Newsletter | `/blog` | `POST /api/newsletter` |

Server-side validation errors return keyed by field name, and the client renders them against
the matching input without interpretation. Every form carries a hidden honeypot field that the
API uses to filter automated submissions.

---

## Design system

Design decisions live in `app/globals.css` as Tailwind v4 `@theme` tokens. There is no
`tailwind.config.js`.

| Token group | Values |
| --- | --- |
| Surfaces | `canvas #080808`, `surface #0e0e0e`, `raised #161616` |
| Accent | `#74d684`, sampled from the brand mark; text on accent is `#07160e` |
| Ink | White, 55 percent, 30 percent |
| Type | `type-display`, `type-h2`, `type-stat`, all fluid |

Motion is deliberate and finite: every scroll animation uses `viewport={{ once: true }}` and
nothing loops.

House rules, enforced by review rather than tooling: no gradients, no glow effects, no emoji,
flat photographic overlays only.

---

## Deploying

Vercel, with defaults. The framework preset detects Next.js; the root directory is the
repository root; build and output settings need no changes.

Add `NEXT_PUBLIC_API_URL` under Settings, Environment Variables before the first deploy, then
push to `main`. Production deploys follow `main`; every other branch receives a preview URL.

---

## Developing on an external drive

This project was built on an exFAT volume, where macOS writes AppleDouble `._*` sidecar files
next to every file. Next.js reads them as real files: the image optimizer serves sidecar bytes
instead of images, and the Turbopack filesystem cache fails to open its database.

Run `npm run fresh` instead of `npm run dev` when the cache misbehaves. It removes `.next` and
the sidecar files together, which is usually what a stale or corrupt Turbopack cache needs.

`next.config.ts` detects the build host and applies the workaround only outside CI:

```ts
const onCI = !!process.env.VERCEL || process.env.CI === '1' || process.env.CI === 'true';

images: { unoptimized: !onCI }
experimental: {
  turbopackFileSystemCacheForDev: onCI,
  turbopackFileSystemCacheForBuild: onCI,
}
```

Vercel and Linux CI runners get full image optimization and cross-run caching. Local
development serves the pre-compressed originals, between 96 and 170 KB each.

---

## Versioning

Tagged releases follow semantic versioning. `v1.0.0` is the first public release of
agronavis.in.
