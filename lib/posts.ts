export interface TocEntry {
  title: string;
  url: string;
  items?: TocEntry[];
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  tags: string[];
  author?: string;
  image?: string;
  // Velite compiles MDX to a serialised JS string; render via <MDXContent code={post.content} />
  content: string;
  toc: TocEntry[];
}

async function getPosts(): Promise<Post[]> {
  const { posts } = await import("@/.velite");
  // Velite injects `content` and `toc` at runtime for MDX collections.
  // The generated types don't reflect this, so we cast through unknown.
  return posts as unknown as Post[];
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getPosts();
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug && post.published);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tagSet).sort();
}
