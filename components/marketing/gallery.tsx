"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  { src: "/spaces/coworking-floor.png", alt: "Open coworking floor", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/spaces/community.png", alt: "Our community", span: "" },
  { src: "/spaces/lounge.png", alt: "Relaxed lounge area", span: "" },
  { src: "/spaces/reception.png", alt: "Reception area", span: "" },
  { src: "/spaces/member-window.png", alt: "Member at work", span: "" },
  { src: "/spaces/tech-lab.png", alt: "Tech lab", span: "sm:col-span-2" },
  { src: "/spaces/training-room.png", alt: "Training room", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring" as const, bounce: 0.18, duration: 0.9 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Step inside CO-LLISION
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Comfort, creativity, and professionalism under one roof. Take a look around
            before you book your visit.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <motion.div
              key={p.src}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring" as const,
                bounce: 0.15,
                duration: 0.7,
                delay: i * 0.07,
              }}
              className={`group relative rounded-2xl overflow-hidden border border-border/60
                bg-muted shadow-sm ring-1 ring-black/5 dark:ring-white/10 ${p.span}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover brightness-[1.04] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Faint base vignette so edges read; most of the photo stays clear */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              {/* Hover reveal */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span
                className="absolute bottom-3 left-3 text-white text-sm font-medium
                  opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                  transition-all duration-300"
              >
                {p.alt}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
