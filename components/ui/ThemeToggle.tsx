"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(iconRef.current, {
        rotate: 360,
        scale: 0.8,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => gsap.set(iconRef.current, { rotate: 0, scale: 1 }),
      });
    });
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground"
        disabled
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span ref={iconRef} className="flex items-center justify-center">
        {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
