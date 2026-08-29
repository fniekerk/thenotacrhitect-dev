# The Not Architect

**thenotarchitect.dev** — technical and business blog. Full code control, strict security, ≥80% test coverage.

## Branding
- **Name / domain:** The Not Architect / thenotarchitect.dev
- **Tagline:** *I draw boxes, cross them out, and ship.*
- **Accent:** burnt orange `#e05a2b`; diagram blue `#4a7cc7`; serif + sans pairing
- **Logo:** `public/thenotarchitect_logo_final.svg` — light text, render on dark panel
- **Voice:** direct, opinionated, zero fluff; equal parts business and tech; self-aware humour

## Stack
Next.js App Router + Turbopack · Drizzle ORM (schema: `lib/db/schema.ts`) · NeonDB (prod) / Docker Postgres (dev) · MDX via `next-mdx-remote/rsc` · Tailwind CSS 4 · Vitest + RTL · pnpm · Vercel (dashboard deploy, not GHA)

## Non-obvious conventions
- ISR: `revalidate = 60` on post pages
- `generateStaticParams` returns `[]` gracefully when DB is unavailable (local builds)
- `next/image` everywhere — never raw `<img>`
- No custom webpack config; Turbopack is the default
- Package manager: **pnpm**. Run `pnpm audit` after every dependency change.
- ≥80% line/branch coverage enforced in CI; build fails below threshold

## Environment variables
| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `ADMIN_PASSWORD` | Admin login |
| `ADMIN_JWT_SECRET` | **Must be ≥32 characters** |
| `NEXT_PUBLIC_SITE_URL` | e.g. `https://thenotarchitect.dev` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob (public store) |

Copy `.env.local.example` → `.env.local` for local dev.

## Security rules (must hold before every deploy)
- CSP is nonce-based, set in `proxy.ts`. `proxy.ts` also guards `/admin` routes (redirects to `/admin/login` when unauthenticated).
- `dangerouslyAllowSVG` is enabled **only** for the first-party logo, sandboxed with `script-src 'none'` — do not broaden this.
- No `dangerouslySetInnerHTML` without sanitisation; MDX is compiled server-side (not eval'd).
- Secrets never committed; only `NEXT_PUBLIC_`-prefixed values reach the client.
- Auth cookie: `__Host-admin_token`; expires 24 h.

## Database
- Local: `pnpm db:up` → Docker Postgres at `localhost:5432/blog`
- Prod: NeonDB. Schema changes: `pnpm db:push` (dev) or `pnpm db:migrate` (prod).
