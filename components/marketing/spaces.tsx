"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Monitor, Users2, Building2, Presentation, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const spaces = [
  {
    icon: Monitor,
    name: "Flexible Hot Desk",
    badge: "Most flexible",
    image: "/spaces/hot-desk.png",
    desc: "Daily, weekly, or monthly access to open seating. Perfect for freelancers and remote workers who need a productive base.",
    features: ["High-speed WiFi", "Comfortable seating", "Community access", "Tea & coffee"],
  },
  {
    icon: Users2,
    name: "Dedicated Workstation",
    badge: "Most popular",
    image: "/spaces/coding.png",
    desc: "Your own permanent desk with a productive setup designed for long working hours. Come and go as you please.",
    features: ["Reserved desk", "Extended access", "Storage space", "Meeting credits"],
    highlight: true,
  },
  {
    icon: Building2,
    name: "Private Office",
    badge: "Best for teams",
    image: "/spaces/private-office.png",
    desc: "An enclosed, fully-furnished office for your team. Professional, private, and ready to move in.",
    features: ["Private space", "Lockable office", "Premium furniture", "Priority support"],
  },
  {
    icon: Presentation,
    name: "Meeting & Training",
    badge: "By the hour",
    image: "/spaces/meeting-room.png",
    desc: "Professional rooms for interviews, client meetings, brainstorming sessions, and training workshops.",
    features: ["City views", "Presentation setup", "Flexible booking", "Seats up to 20"],
  },
];

export function Spaces() {
  return (
    <section id="spaces" className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring" as const, bounce: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Find your perfect space
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            From open hot desks to private offices and meeting rooms, we have a setup
            to suit every working style and schedule.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {spaces.map((space, i) => (
            <motion.div
              key={space.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring" as const, bounce: 0.22, duration: 0.85, delay: i * 0.09 }}
              className={`group relative rounded-3xl border overflow-hidden flex flex-col
                ${space.highlight
                  ? "ring-2 ring-primary border-primary shadow-2xl shadow-primary/20"
                  : "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300"
                }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-muted">
                <Image
                  src={space.image}
                  alt={space.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover brightness-[1.04] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Darkness concentrated only at the bottom so the photo stays clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-black/50 text-white backdrop-blur-sm border-0 text-xs">
                  {space.badge}
                </Badge>
                <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <space.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white drop-shadow-sm">
                    {space.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 bg-card">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{space.desc}</p>
                <ul className="grid grid-cols-2 gap-2.5 mt-auto">
                  {space.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
