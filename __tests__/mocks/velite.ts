import type { Post } from "@/lib/posts";

export const mockPosts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    description: "The first post.",
    date: "2026-06-14",
    published: true,
    tags: ["meta"],
    author: "Test Author",
    content: "",
    toc: [],
  },
  {
    slug: "draft-post",
    title: "Draft Post",
    description: "Not published yet.",
    date: "2026-06-13",
    published: false,
    tags: [],
    content: "",
    toc: [],
  },
];
