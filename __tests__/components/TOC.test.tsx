import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TOC } from "@/components/blog/TOC";

const mockItems = [
  {
    title: "Introduction",
    url: "#introduction",
    items: [{ title: "Background", url: "#background" }],
  },
  {
    title: "Conclusion",
    url: "#conclusion",
  },
];

describe("TOC", () => {
  it("renders top-level headings as links", () => {
    render(<TOC items={mockItems} />);
    expect(screen.getByRole("link", { name: "Introduction" })).toHaveAttribute(
      "href",
      "#introduction"
    );
    expect(screen.getByRole("link", { name: "Conclusion" })).toHaveAttribute(
      "href",
      "#conclusion"
    );
  });

  it("renders nested items", () => {
    render(<TOC items={mockItems} />);
    expect(screen.getByRole("link", { name: "Background" })).toHaveAttribute(
      "href",
      "#background"
    );
  });

  it("returns null when items list is empty", () => {
    const { container } = render(<TOC items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("has a navigation landmark", () => {
    render(<TOC items={mockItems} />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
