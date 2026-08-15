"use client";

import { useEffect, useState } from "react";

export function FloatingScrollNav() {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setAtTop(scrollY < 100);
      setAtBottom(maxScroll <= 0 || scrollY >= maxScroll - 20);
      setVisible(scrollY > 100);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-label="Page navigation"
      className={`fixed right-4 bottom-6 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background/90 p-1 shadow-md backdrop-blur transition-all duration-200 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <button
        disabled={atTop}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          atTop
            ? "text-muted-foreground/30 cursor-default"
            : "text-foreground hover:bg-[#e05a2b]/10 hover:text-[#e05a2b]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
      <div className="mx-auto h-px w-4 bg-border" />
      <button
        disabled={atBottom}
        aria-label="Scroll to bottom"
        onClick={() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          })
        }
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          atBottom
            ? "text-muted-foreground/30 cursor-default"
            : "text-foreground hover:bg-[#e05a2b]/10 hover:text-[#e05a2b]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
