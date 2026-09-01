"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PostsContainerProps {
  children: React.ReactNode;
}

export function PostsContainer({ children }: PostsContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = ref.current?.querySelectorAll("article");
      if (!cards?.length) return;

      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 32,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="grid gap-6">
      {children}
    </div>
  );
}
