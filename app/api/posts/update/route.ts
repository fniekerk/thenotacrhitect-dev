import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import type { TocEntry } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface UpdatePostBody {
  slug: string;
  title: string;
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

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("__Host-admin_token")?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: UpdatePostBody = await request.json();
  const { slug, title, description, date, tags, published, author, image, content } = body;

  if (!slug || !title || !description || !date || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const toc = extractToc(content);

  const [updated] = await db
    .update(posts)
    .set({
      title,
      description,
      date,
      content,
      published,
      tags: tags ?? [],
      author: author || null,
      image: image !== undefined ? (image || null) : undefined,
      toc,
      updatedAt: new Date(),
    })
    .where(eq(posts.slug, slug))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, slug });
}
