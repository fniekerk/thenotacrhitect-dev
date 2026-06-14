"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        y: -16,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <header ref={ref} className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav
        className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 transition-colors"
          aria-label="The Not Architect — home"
        >
          <span
            aria-hidden="true"
            className="text-lg leading-none text-brand transition-transform group-hover:rotate-12"
          >
            ✕
          </span>
          <span className="font-serif text-xl font-medium tracking-tight group-hover:text-brand transition-colors">
            The Not Architect
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors hover:bg-accent"
          >
            Posts
          </Link>
          <Link
            href="/feed.xml"
            className="text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors hover:bg-accent"
            aria-label="RSS Feed"
          >
            RSS
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
