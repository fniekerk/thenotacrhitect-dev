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

      gsap.from(cards, {
        opacity: 0,
        y: 32,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
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
