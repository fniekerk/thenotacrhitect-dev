import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import type { TocEntry } from "@/lib/db/schema";

interface CreatePostBody {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  author?: string;
  image?: string;
  content: string;
}

function extractToc(mdx: string): TocEntry[] {
  const toc: TocEntry[] = [];
  for (const line of mdx.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match?.[1] || !match?.[2]) continue;
    const depth = match[1].length;
    const title = match[2].trim();
    const url = `#${title.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")}`;
    toc.push({ title, url, depth });
  }
  return toc;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("__Host-admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreatePostBody = await request.json();
  const { title, slug, description, date, tags, published, author, image, content } = body;

  if (!title || !slug || !description || !date || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
  }

  const toc = extractToc(content);

  try {
    await db.insert(posts).values({
      slug,
      title,
      description,
      date,
      content,
      published: published ?? true,
      tags: tags ?? [],
      author: author || null,
      image: image || null,
      toc,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true, slug }, { status: 201 });
}
