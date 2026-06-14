# The Not Architect

A technical and niche content blog ([thenotarchitect.dev](https://thenotarchitect.dev)) built with Next.js 16, Tailwind CSS 4, and Velite for typed MDX content.

> *I draw boxes, cross them out, and ship.*

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router, Turbopack) |
| Content | MDX via Velite 0.3.1 |
| Styling | Tailwind CSS 4.3.1 |
| Testing | Vitest 4.1.8 + React Testing Library |
| Hosting | Vercel |
| DNS / CDN | Cloudflare |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing posts

Posts are plain **MDX files** in `content/posts/`. There is no database and no CMS — a post is a file in the repo. [Velite](https://velite.js.org) reads each file at build time, validates its frontmatter against a Zod schema (`velite.config.ts`), and compiles it to typed, statically-rendered HTML.

### Create a new post

1. Add a file under `content/posts/`, e.g. `content/posts/my-first-post.mdx`. The file name is just for your reference — the URL comes from the `slug` field.
2. Start with the frontmatter block (between the `---` fences), then write the body in Markdown/MDX:

```mdx
---
title: My First Post
slug: my-first-post
description: A short summary shown in the post list, RSS feed, and OG image.
date: 2026-06-14
published: true
tags:
  - nextjs
  - tutorial
author: The Not Architect
---

## Introduction

Write your content here using **Markdown**. You can use headings, lists,
tables, links, images, and fenced code blocks.
```

3. Preview locally with `pnpm dev` and open <http://localhost:3000>. Velite re-compiles on save, so the post appears (and updates) live.
4. Commit and push to `main`. Vercel rebuilds and deploys automatically — no manual step.

The post is published at `/posts/<slug>` (e.g. `/posts/my-first-post`).

### Frontmatter reference

Validated by the schema in `velite.config.ts`. The build **fails** if a required field is missing or a value is out of range, so a broken post can never reach production.

| Field | Required | Type / rules | Purpose |
|---|---|---|---|
| `title` | **Yes** | string, 1–200 chars | Post heading, `<title>` tag, OG image |
| `slug` | **Yes** | string, **unique across all posts** | The URL path (`/posts/<slug>`) |
| `description` | **Yes** | string, 1–500 chars | Post list, meta description, RSS, OG image |
| `date` | **Yes** | ISO date `YYYY-MM-DD` | Sort order (newest first) and displayed date |
| `published` | No | boolean, default `true` | Set `false` to keep a post as a hidden draft |
| `tags` | No | array of strings, default `[]` | Tag badges on the card and post page |
| `author` | No | string | Shown in the post byline |
| `image` | No | string (path/URL) | Optional social-share image override |

`toc` (table of contents) and `content` are generated automatically from the body — do **not** add them to frontmatter.

### Edit an existing post

Open the `.mdx` file, change the frontmatter or body, save, and verify with `pnpm dev`. Commit and push to deploy.

- **Renaming a URL:** change the `slug`. Note this breaks the old URL — add a redirect in `next.config.ts` if the post was already public.
- **Updating the visible date:** change `date` (this also re-sorts the post in the list).

### Drafts

Set `published: false`. The post is excluded from the home page, RSS feed, sitemap, and static generation, but stays in the repo so you can keep editing it. Flip it to `true` when ready.

### Images in a post

Place images under `public/` and reference them with an absolute path. Use the Next.js `Image` component (raw `<img>` is discouraged for performance):

```mdx
import Image from "next/image";

<Image src="/posts/my-first-post/diagram.png" alt="Architecture diagram" width={800} height={450} />
```

### Markdown / MDX features

Standard Markdown works out of the box — headings (which feed the auto table of contents), **bold**, _italic_, lists, tables, blockquotes, links, and fenced code blocks with language hints (```` ```ts ````). Because these are MDX files, you can also import and embed React components inline. See `content/posts/hello-world.mdx` for a working example.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Run Velite then build for production |
| `pnpm test` | Run the full test suite |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm audit` | Check for known vulnerabilities |
| `pnpm lint` | Run ESLint |

## CI

GitHub Actions runs on every push and pull request to `main`:

1. Install dependencies (`--frozen-lockfile`)
2. Lint
3. Security audit (`pnpm audit --audit-level=high`)
4. Test with coverage (≥ 80% threshold enforced)

Build and deployment are handled entirely by Vercel.

## Deployment

Deployment is managed through the Vercel dashboard (not GitHub Actions). Vercel auto-deploys on push to `main` and creates preview deployments for pull requests.

Set the following environment variable in your Vercel project settings:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The production URL (e.g. `https://yourdomain.com`) |

## Security

- All HTTP security headers configured in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.)
- Dependencies audited via `pnpm audit` in CI — build fails on high/critical CVEs
- Dependency updates automated via Renovate (10-day minimum release age)
- No secrets committed to the repository
