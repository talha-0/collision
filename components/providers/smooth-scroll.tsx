"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * App-wide smooth scrolling (Lenis) wired into GSAP's ticker so ScrollTrigger
 * scrubs stay perfectly in sync with the inertial scroll. Disabled entirely
 * when the user prefers reduced motion — native scrolling takes over.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Re-measure once layout/fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    const id = window.setTimeout(refresh, 300);

    return () => {
      window.clearTimeout(id);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
