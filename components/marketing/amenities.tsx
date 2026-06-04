"use client";

import { motion } from "framer-motion";
import { Wifi, Coffee, Printer, Shield, Car, Dumbbell, Video, Phone } from "lucide-react";

const amenities = [
  { icon: Wifi, label: "1 Gbps Fiber" },
  { icon: Coffee, label: "Premium Coffee" },
  { icon: Printer, label: "Print & Scan" },
  { icon: Shield, label: "24/7 Security" },
  { icon: Car, label: "Parking" },
  { icon: Dumbbell, label: "Fitness Room" },
  { icon: Video, label: "Video Studios" },
  { icon: Phone, label: "Phone Booths" },
];

export function Amenities() {
  return (
    <section id="amenities" className="py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring" as const, bounce: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything you need, included
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            No hidden fees. No nickel-and-diming. Just a great place to do your best work.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {amenities.map((a, i) => {
            // Restrained two-tone brand rhythm: teal primary, amber accent.
            const teal = i % 2 === 0;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring" as const, bounce: 0.28, duration: 0.7, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="bg-card border rounded-2xl p-6 flex flex-col items-center gap-3 text-center
                  hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-default
                  transition-colors duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    teal ? "bg-primary/10" : "bg-amber-500/10"
                  }`}
                >
                  <a.icon className={`w-5 h-5 ${teal ? "text-primary" : "text-amber-600 dark:text-amber-400"}`} />
                </div>
                <span className="text-sm font-semibold">{a.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
