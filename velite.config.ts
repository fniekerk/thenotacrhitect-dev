import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s.object({
    title: s.string().min(1).max(200),
    description: s.string().min(1).max(500),
    date: s.isodate(),
    published: s.boolean().default(true),
    tags: s.array(s.string()).default([]),
    author: s.string().optional(),
    image: s.string().optional(),
    // Velite built-ins: slug from file path, compiled MDX component, and ToC
    slug: s.slug("posts"),
    toc: s.toc(),
    content: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
});
