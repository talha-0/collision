"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

// Floating WhatsApp button - appears after the user scrolls past the hero.
export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink("Hi CO-LLISION! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring" as const, bounce: 0.4, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500
            hover:bg-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center group"
        >
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          <MessageCircle className="w-7 h-7 text-white relative z-10" />
          <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-foreground text-background
            text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100
            pointer-events-none transition-opacity shadow-lg">
            Chat with us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
