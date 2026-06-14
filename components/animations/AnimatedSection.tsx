"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: 0.7,
      delay,
      ease: "power3.out",
    };

    if (direction === "up") fromVars.y = 24;
    if (direction === "down") fromVars.y = -24;
    if (direction === "left") fromVars.x = 24;
    if (direction === "right") fromVars.x = -24;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(el, fromVars);
    });

    return () => mm.revert();
  }, [delay, direction]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
