"use client";

import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Coffee } from "lucide-react";

const values = [
  { icon: Target, title: "Distraction-free", desc: "A focused space away from the noise of home or crowded cafes." },
  { icon: Users, title: "Community & networking", desc: "Meet entrepreneurs, freelancers, designers, and marketers under one roof." },
  { icon: Lightbulb, title: "Built for opportunity", desc: "We help you collaborate, share ideas, and grow your business." },
  { icon: Coffee, title: "Comfortable & modern", desc: "Clean, peaceful, professional — with fast WiFi and great seating." },
];

export function About() {
  return (
    <section id="about" className="py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring" as const, bounce: 0.2, duration: 0.9 }}
          >
            <h2 className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
              Productivity grows in the right environment
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              At CO-LLISION, we believe great work happens in the right space. Ours combines
              comfort, creativity, and professionalism — the perfect place to focus, collaborate,
              and build meaningful connections.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you&apos;re working on your next startup, meeting clients, managing remote
              work, or simply looking for a distraction-free workspace — CO-LLISION is designed
              for you.
            </p>
          </motion.div>

          {/* Value cards */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  type: "spring" as const,
                  bounce: 0.25,
                  duration: 0.8,
                  delay: i * 0.1,
                }}
                className="group bg-card border rounded-2xl p-6 hover:border-primary/40
                  hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20
                  flex items-center justify-center mb-4 transition-colors">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 leading-tight">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
