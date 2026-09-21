# Development reference

Design tokens and local environment notes. The README covers what the site is and how to run it;
this is the detail behind it.

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

