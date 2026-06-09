"use client";

import { Component, Suspense, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight } from "lucide-react";
import { collisionProgress, clamp01 } from "./progress";

const CollisionCanvas = dynamic(() => import("./collision-canvas"), { ssr: false });

type Quality = "high" | "low";

let webglCache: boolean | undefined;
function getWebGLSupport() {
  if (webglCache === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglCache = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}

const noopSubscribe = () => () => {};

/** Read a media query reactively, SSR-safe (no setState-in-effect). */
function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** WebGL support is fixed per session; read it via an external store to stay SSR-safe. */
function useWebGLSupport() {
  return useSyncExternalStore(noopSubscribe, getWebGLSupport, () => false);
}

/** If the WebGL scene throws (driver/GPU quirk), fall back to the poster instead of a blank section. */
class CanvasErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error("[collision] WebGL scene failed, showing poster:", err);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function CollisionSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const [mountCanvas, setMountCanvas] = useState(false);
  const [glFailed, setGlFailed] = useState(false);

  // Client-only capability detection via external stores: SSR-safe, reactive,
  // and free of setState-in-effect. The collision is scroll-driven (user-initiated),
  // so we only require WebGL; prefers-reduced-motion calms the idle motion instead.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const small = useMediaQuery("(max-width: 640px)");
  const webgl = useWebGLSupport();
  const quality: Quality = small ? "low" : "high";
  const showScene = webgl && !glFailed;

  // Mount the GL canvas when the section is near the viewport (warm it ~1.5 screens early).
  useEffect(() => {
    if (!showScene || !trackRef.current) return;
    const el = trackRef.current;
    const io = new IntersectionObserver(([entry]) => setMountCanvas(entry.isIntersecting), {
      rootMargin: "150% 0px 150% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [showScene]);

  // Pin the stage and scrub the scene by scroll position.
  useGSAP(
    () => {
      if (!showScene || !trackRef.current || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false, // the tall track already supplies the scroll distance
        scrub: 1,
        onUpdate: (self) => {
          collisionProgress.current = self.progress;

          const reveal = revealRef.current;
          if (reveal) {
            const r = clamp01((self.progress - 0.82) / 0.16);
            reveal.style.opacity = String(r);
            reveal.style.transform = `translateY(${(1 - r) * 24}px)`;
          }
          const cue = cueRef.current;
          if (cue) cue.style.opacity = String(clamp01(1 - self.progress * 3));
        },
      });

      return () => st.kill();
    },
    { scope: trackRef, dependencies: [showScene] },
  );

  const trackHeight = showScene ? (quality === "low" ? "280vh" : "320vh") : "100vh";

  return (
    <section
      ref={trackRef}
      aria-label="The CO-LLISION effect"
      className="relative w-full"
      style={{ height: trackHeight, backgroundColor: "#070b11" }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* atmosphere */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 45%, rgba(45,212,191,0.10), transparent 70%), radial-gradient(120% 100% at 50% 50%, transparent 55%, #04060a 100%)",
          }}
        />

        {/* live WebGL scene */}
        {showScene && mountCanvas && (
          <CanvasErrorBoundary onError={() => setGlFailed(true)}>
            <Suspense fallback={null}>
              <CollisionCanvas quality={quality} reduced={reduced} mobile={small} />
            </Suspense>
          </CanvasErrorBoundary>
        )}

        {/* static poster (no WebGL / scene failed) */}
        {!showScene && (
          <div aria-hidden className="absolute inset-0 grid place-items-center">
            <div
              className="h-72 w-72 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #2ff0d6 0%, #1c8f88 38%, rgba(157,48,255,0.3) 70%, transparent 76%)",
              }}
            />
          </div>
        )}

        {/* headline reveal (real, always-present text — never gated on the canvas) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 sm:px-8 pointer-events-none">
          <div
            ref={revealRef}
            className="w-full max-w-2xl text-center"
            style={{ opacity: showScene ? 0 : 1, willChange: "opacity, transform" }}
          >
            <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-teal-300/90">
              The CO-LLISION effect
            </p>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] text-white text-balance">
              Where ideas collide.
            </h2>
            <p className="mx-auto mt-4 sm:mt-5 max-w-sm sm:max-w-md text-sm sm:text-lg leading-relaxed text-slate-300/80">
              Two forces meet, and something new takes shape. That is the room we built.
            </p>
            <a
              href="#spaces"
              className="pointer-events-auto mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-xl
                bg-teal-400/95 px-5 sm:px-6 h-10 sm:h-11
                text-sm font-semibold text-[#04181a] shadow-lg shadow-teal-500/25
                transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              Explore the space
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* scroll cue */}
        {showScene && (
          <div
            ref={cueRef}
            className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-slate-400 pointer-events-none"
          >
            <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        )}
      </div>
    </section>
  );
}
