import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/blog/Nav";

describe("Nav", () => {
  it("renders the site name/logo link", () => {
    render(<Nav />);
    const logo = screen.getByRole("link", { name: "The Not Architect — home" });
    expect(logo).toHaveAttribute("href", "/");
  });

  it("renders the Posts link", () => {
    render(<Nav />);
    const postsLink = screen.getByRole("link", { name: "Posts" });
    expect(postsLink).toHaveAttribute("href", "/");
  });

  it("renders the RSS link", () => {
    render(<Nav />);
    const rssLink = screen.getByRole("link", { name: "RSS Feed" });
    expect(rssLink).toHaveAttribute("href", "/feed.xml");
  });

  it("has a nav landmark", () => {
    render(<Nav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
