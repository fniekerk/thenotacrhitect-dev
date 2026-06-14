import { describe, it, expect } from "vitest";
import { cn, formatDate, slugify, truncate, absoluteUrl } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string in default long format", () => {
    expect(formatDate("2026-06-14")).toBe("June 14, 2026");
  });

  it("respects custom format options", () => {
    expect(formatDate("2026-06-14", { year: "numeric", month: "short" })).toBe(
      "Jun 2026"
    );
  });
});

describe("slugify", () => {
  it("converts a plain string to kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
  });

  it("collapses multiple spaces/dashes", () => {
    expect(slugify("  foo   bar  ")).toBe("foo-bar");
  });

  it("strips leading and trailing dashes", () => {
    expect(slugify("-foo-")).toBe("foo");
  });
});

describe("truncate", () => {
  it("returns the string unchanged when short enough", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and appends ellipsis when too long", () => {
    const result = truncate("hello world", 5);
    expect(result).toBe("hello…");
  });

  it("returns the exact string when length equals maxLength", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("absoluteUrl", () => {
  it("prepends the site URL to an absolute path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteUrl("/about")).toBe("https://example.com/about");
  });

  it("handles paths without a leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(absoluteUrl("about")).toBe("https://example.com/about");
  });

  it("falls back to localhost when env is not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(absoluteUrl("/about")).toBe("http://localhost:3000/about");
  });
});
