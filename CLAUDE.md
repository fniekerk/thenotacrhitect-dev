# The Not Architect — Project Brief

A technical and business/niche content blog (thenotarchitect.dev) built with full code control, best-practice architecture, global security standards, and ≥80% test coverage.

## Branding

| Property | Value |
|---|---|
| Blog name | The Not Architect |
| Domain | thenotarchitect.dev |
| Tagline | *I draw boxes, cross them out, and ship.* |
| Logo | `public/thenotarchitect_logo_final.svg` (light text — render on a dark panel) |
| Palette | burnt orange `#e05a2b` (accent), C4 blue `#4a7cc7` (diagram); serif + sans pairing |

**Logo concept:** mini C4 context diagram (User → Blog System → Email/GitHub, Author → Blog System) crossed out with a bold burnt-orange X; serif "The Not Architect" wordmark; PEOPLE · PROCESS · TECHNOLOGY subheading; italic tagline.

**Brand voice:** direct, opinionated, zero fluff. Business and technology in equal measure. Self-aware humour — the diagram is the start, never the end; delivery is the proof.

## Stack
- **Framework:** Next.js (App Router, Turbopack) — SSG via `generateStaticParams`
- **Content:** MDX via Velite (Zod-validated frontmatter, compiled at build time)
- **Styling:** Tailwind CSS 4 + shadcn-style components; `next-themes` light/dark; GSAP animations
- **Testing:** Vitest + React Testing Library
- **Hosting:** Vercel (deploy via dashboard, not GitHub Actions); DNS/CDN via Cloudflare
- **Package manager:** pnpm

> Exact versions are pinned in `package.json` / `pnpm-lock.yaml` (source of truth) — prefer stable releases ≥10 days old. Run `pnpm audit` after any dependency change.

## Project layout
- `app/` — routes: `page.tsx` (home/post list), `posts/[slug]/` (post page + `opengraph-image.tsx`), `feed.xml/route.ts` (RSS), `sitemap.ts`, `layout.tsx`, `globals.css`
- `content/posts/` — MDX source files (the only place posts live)
- `components/` — `ui/` (primitives), `blog/` (PostCard, Nav, Footer, TOC), `animations/`, `providers/`
- `lib/` — `posts.ts` (Velite query helpers), `utils.ts`
- `__tests__/` — mirrors src structure
- Config: `velite.config.ts`, `next.config.ts` (security headers + image SVG policy), `proxy.ts` (CSP nonce), `postcss.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`

## Authoring posts
Posts are MDX files in `content/posts/`, validated at build time by the Velite schema in `velite.config.ts` (a build fails on invalid frontmatter). To publish: add/edit an `.mdx` file, preview with `pnpm dev`, then commit and push — Vercel auto-deploys. The URL is `/posts/<slug>`.

- **Required frontmatter:** `title` (1–200), `slug` (unique), `description` (1–500), `date` (`YYYY-MM-DD`).
- **Optional:** `published` (default `true`; set `false` for drafts), `tags`, `author`, `image`.
- `toc` and `content` are auto-generated — never set them in frontmatter.

> Full author guide (create, edit, drafts, images, MDX features): see **Writing posts** in [`README.md`](./README.md).

## Security Standards (must hold before deploy)
- **HTTP headers** — CSP (strict, nonce-based; set in `proxy.ts`), HSTS (1yr, includeSubDomains, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geolocation off). Static headers in `next.config.ts`.
- **Dependencies** — `pnpm audit` clean before every deploy; Renovate enabled; lockfile committed + integrity-checked in CI.
- **Content** — MDX compiled at build time (no runtime eval); no `dangerouslySetInnerHTML` without sanitisation; `dangerouslyAllowSVG` is enabled only for the first-party logo, sandboxed with `script-src 'none'`.
- **Secrets** — never committed; managed via Vercel env vars. Only `NEXT_PUBLIC_`-prefixed values reach the client (non-sensitive only).

## Testing
≥80% line/branch coverage, enforced in CI (build fails below threshold). Cover: `lib/` helpers + Velite schema (unit), components incl. snapshots (RTL), post-page render by slug (integration). Optional E2E (Playwright) for home → post navigation.

CI on every push/PR to `main`: install (`--frozen-lockfile`) → lint → `pnpm audit --audit-level=high` → test with coverage. Build/deploy handled by Vercel.

## Conventions
- All post pages use SSG (`generateStaticParams`), not SSR.
- Per-page `metadata` export for SEO (title, description, OG, canonical).
- `next/image` for all images — never raw `<img>`.
- No custom webpack config — Turbopack is the default.
- Core Web Vitals targets from day one: LCP < 2.5s, CLS < 0.1, INP < 200ms.

## Remaining milestones
1. [ ] Push to GitHub and connect to Vercel (deploy configured in dashboard); set `NEXT_PUBLIC_SITE_URL=https://thenotarchitect.dev`
2. [ ] Point custom domain via Cloudflare
3. [ ] Publish first post

> Done: app scaffold, security headers, post list + post pages, nav/footer/RSS/sitemap, Vitest + coverage gate, GitHub Actions CI, branding + theme toggle + GSAP.
