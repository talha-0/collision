"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Send, Loader2, ArrowUpRight, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { site, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: whatsappLink("Hi CO-LLISION! I'd like to know more."),
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10 group-hover:bg-green-500/20",
  },
  {
    icon: Phone,
    label: "Call us",
    value: site.phone2Display,
    href: `tel:+${site.phone2}`,
    color: "text-primary",
    bg: "bg-primary/10 group-hover:bg-primary/20",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    value: `@${site.instagram}`,
    href: site.instagramUrl,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10 group-hover:bg-pink-500/20",
  },
];

export function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring" as const, bounce: 0.2, duration: 0.9 }}
          >
            <p className="text-primary font-semibold text-xs uppercase tracking-[0.18em] mb-4">
              Contact Us
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
              Let&apos;s find your space
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Ready to join Collision? Have questions about our spaces? We&apos;d love
              to hear from you. Reach out via the form or any of the channels below.
            </p>

            <div className="space-y-4">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl border bg-card
                    hover:border-primary/40 hover:shadow-md hover:shadow-primary/5
                    transition-all duration-200 cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${c.bg}`}>
                    <c.icon className={`w-5 h-5 ${c.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.label}</div>
                    <div className="text-muted-foreground text-sm truncate">{c.value}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary
                    group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right - form */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring" as const, bounce: 0.2, duration: 0.9, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card border rounded-2xl p-8 space-y-5 shadow-sm"
            >
              <div>
                <h3 className="font-heading text-xl font-bold">Get a Quote</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Tell us about your space needs and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="name" placeholder="Jane Doe" value={form.name} onChange={set("name")} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} required className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+92 300 000 0000" value={form.phone} onChange={set("phone")} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Your company" value={form.company} onChange={set("company")} className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your space needs - how many people, which location, preferred start date..."
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  required
                  className="rounded-xl resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 h-11 rounded-xl shadow-sm shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
