import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/blog/Footer";

describe("Footer", () => {
  it("renders the RSS Feed link", () => {
    render(<Footer />);
    const rssLink = screen.getByRole("link", { name: "RSS Feed" });
    expect(rssLink).toHaveAttribute("href", "/feed.xml");
  });

  it("renders the Sitemap link", () => {
    render(<Footer />);
    const sitemapLink = screen.getByRole("link", { name: "Sitemap" });
    expect(sitemapLink).toHaveAttribute("href", "/sitemap.xml");
  });

  it("renders a copyright notice with the current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("has a contentinfo landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
