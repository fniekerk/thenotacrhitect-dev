import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPosts } from "../mocks/velite";

vi.mock("@/.velite", () => ({
  posts: mockPosts,
}));

// Import after mock is set up
const { getAllPosts, getPostBySlug, getPostsByTag, getAllTags } = await import(
  "@/lib/posts"
);

describe("getAllPosts", () => {
  it("returns only published posts", async () => {
    const posts = await getAllPosts();
    expect(posts.every((p) => p.published)).toBe(true);
  });

  it("returns posts sorted by date descending", async () => {
    const posts = await getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1]!.date).getTime();
      const curr = new Date(posts[i]!.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});

describe("getPostBySlug", () => {
  it("returns the matching published post", async () => {
    const post = await getPostBySlug("hello-world");
    expect(post?.title).toBe("Hello World");
  });

  it("returns undefined for an unknown slug", async () => {
    const post = await getPostBySlug("does-not-exist");
    expect(post).toBeUndefined();
  });

  it("returns undefined for an unpublished post", async () => {
    const post = await getPostBySlug("draft-post");
    expect(post).toBeUndefined();
  });
});

describe("getPostsByTag", () => {
  it("returns posts that include the given tag", async () => {
    const posts = await getPostsByTag("meta");
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.tags.includes("meta"))).toBe(true);
  });

  it("returns an empty array for an unused tag", async () => {
    const posts = await getPostsByTag("nonexistent-tag");
    expect(posts).toHaveLength(0);
  });
});

describe("getAllTags", () => {
  it("returns a sorted list of unique tags from published posts", async () => {
    const tags = await getAllTags();
    expect(tags).toContain("meta");
    // Verify sorted
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
  });
});
