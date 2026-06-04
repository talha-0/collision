"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site";

const stats = [
  { value: "100+", label: "Members" },
  { value: "10+", label: "Workspaces" },
  { value: "24/7", label: "Access" },
];

const blurSlide = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { type: "spring" as const, bounce: 0.3, duration: 1.2, delay: i * 0.12 },
  }),
};

// useSyncExternalStore: SSR returns false (server snapshot), client returns true
// after hydration — no effect + setState needed, no cascading render.
const noop = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function Hero() {
  const mounted = useIsMounted();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
          [background-image:linear-gradient(to_right,oklch(0.58_0.12_195/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.58_0.12_195/0.06)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(to_right,oklch(0.72_0.13_192/0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.72_0.13_192/0.1)_1px,transparent_1px)]
          [background-size:56px_56px]
          [mask-image:radial-gradient(ellipse_90%_70%_at_50%_30%,#000_55%,transparent_100%)]"
      />
      {/* Glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl -z-10" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber/10 blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - copy */}
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={blurSlide}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Now open & accepting members
            </motion.div>

            <motion.h1
              custom={1}
              variants={blurSlide}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight
                leading-[1.05] text-balance mb-6"
            >
              Where ideas{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">
                  collide.
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q75 2 150 8 Q225 14 298 6" stroke="url(#hu)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="hu" x1="0" y1="0" x2="100%" y2="0">
                      <stop stopColor="oklch(0.58 0.12 195)" />
                      <stop offset="1" stopColor="oklch(0.78 0.16 75)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={blurSlide}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              A productive coworking space for freelancers, remote workers, startups, and
              creators. A focused place to work, connect, and grow &mdash; everything you need
              under one roof.
            </motion.p>

            <motion.div
              custom={3}
              variants={blurSlide}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center"
            >
              <a href="#contact">
                <Button size="lg" className="gap-2 text-base px-7 h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href={whatsappLink("Hi CO-LLISION! I'd like to book a visit.")} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 text-base px-7 h-12 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Book a Visit
                </Button>
              </a>
            </motion.div>

            <motion.div
              custom={5}
              variants={blurSlide}
              initial="hidden"
              animate={mounted ? "visible" : "hidden"}
              className="mt-12 flex items-center justify-center lg:justify-start gap-10"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-heading text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - image showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
            animate={mounted ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ type: "spring" as const, bounce: 0.25, duration: 1.3, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border shadow-2xl shadow-primary/10 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/spaces/open-space.png"
                alt="CO-LLISION coworking floor"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            {/* Floating review card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-5 -left-3 sm:left-4 bg-card border rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[230px]"
            >
              <div className="flex -space-x-2">
                {["community", "member-writing", "member-window"].map((img) => (
                  <div key={img} className="w-9 h-9 rounded-full overflow-hidden border-2 border-card relative">
                    <Image src={`/spaces/${img}.png`} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber text-amber" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-tight">Loved by our community</p>
              </div>
            </motion.div>

            {/* Floating amenity badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.15, duration: 0.6 }}
              className="absolute -top-4 -right-2 sm:right-4 bg-card border rounded-2xl shadow-xl px-4 py-3"
            >
              <div className="text-xs text-muted-foreground">High-Speed WiFi</div>
              <div className="font-heading font-bold text-primary">Always On</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
