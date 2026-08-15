import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/lib/posts";

const mockPost: Post = {
  id: 1,
  slug: "hello-world",
  title: "Hello World",
  description: "A test post description.",
  date: "2026-06-14",
  published: true,
  tags: ["test", "meta"],
  author: "Test Author",
  image: null,
  content: "",
  toc: [],
};

describe("PostCard", () => {
  it("renders the post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders the post description", () => {
    render(<PostCard post={mockPost} />);
    expect(
      screen.getByText("A test post description.")
    ).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("meta")).toBeInTheDocument();
  });

  it("links the title to the post page", () => {
    render(<PostCard post={mockPost} />);
    const link = screen.getByRole("link", { name: "Hello World" });
    expect(link).toHaveAttribute("href", "/posts/hello-world");
  });

  it("renders the formatted date", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("June 14, 2026")).toBeInTheDocument();
  });

  it("renders no tags when the list is empty", () => {
    const postWithNoTags = { ...mockPost, tags: [] };
    render(<PostCard post={postWithNoTags} />);
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
