# The Not Architect

**thenotarchitect.dev** — technical and business blog.

## Branding
- **Tagline:** *I draw boxes, cross them out, and ship.*
- **Accent:** burnt orange `#e05a2b`; diagram blue `#4a7cc7`
- **Logo:** `public/thenotarchitect_logo_final.svg` — light text, render on dark panel
- **Voice:** direct, opinionated, zero fluff; equal parts business and tech; self-aware humour

## Non-obvious conventions
- Deploy via Vercel dashboard, not GHA
- ISR: `revalidate = 60` on post pages
- `generateStaticParams` returns `[]` gracefully when DB is unavailable (local builds)
- `next/image` everywhere — never raw `<img>`
- Package manager: **pnpm**. Run `pnpm audit` after every dependency change.
- ≥80% line/branch coverage enforced in CI; build fails below threshold

## Security rules (must hold before every deploy)
- CSP is nonce-based, set in `proxy.ts`. `proxy.ts` also guards `/admin` routes (redirects to `/admin/login` when unauthenticated).
- `dangerouslyAllowSVG` is enabled **only** for the first-party logo, sandboxed with `script-src 'none'` — do not broaden this.
- No `dangerouslySetInnerHTML` without sanitisation; MDX is compiled server-side (not eval'd).
- Secrets never committed; only `NEXT_PUBLIC_`-prefixed values reach the client.
- Auth cookie: `__Host-admin_token`; expires 24 h.
- `ADMIN_JWT_SECRET` must be ≥32 characters.
