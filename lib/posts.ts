import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export type { TocEntry } from "@/lib/db/schema";

export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  published: boolean;
  tags: string[];
  author: string | null;
  image: string | null;
  toc: import("@/lib/db/schema").TocEntry[];
}

export async function getAllPosts(): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.date)) as Promise<Post[]>;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return post as Post | undefined;
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(sql`${posts.tags} @> ARRAY[${tag}]::text[] AND ${posts.published} = true`)
    .orderBy(desc(posts.date)) as Promise<Post[]>;
}

export async function getAllTags(): Promise<string[]> {
  const result = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(eq(posts.published, true));

  const tagSet = new Set(result.flatMap((r) => r.tags ?? []));
  return Array.from(tagSet).sort();
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .orderBy(desc(posts.date)) as Promise<Post[]>;
}

export async function getAllSlugs(): Promise<string[]> {
  const result = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.published, true));
  return result.map((r) => r.slug);
}
