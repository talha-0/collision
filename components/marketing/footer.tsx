import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { CollisionMark } from "./collision-mark";
import { site, whatsappLink } from "@/lib/site";

const footerLinks = {
  Explore: [
    { label: "About Us", href: "#about" },
    { label: "Our Spaces", href: "#spaces" },
    { label: "Gallery", href: "#gallery" },
    { label: "Pricing", href: "#pricing" },
  ],
  Workspaces: [
    { label: "Hot Desks", href: "#spaces" },
    { label: "Dedicated Desks", href: "#spaces" },
    { label: "Private Offices", href: "#spaces" },
    { label: "Meeting Rooms", href: "#spaces" },
  ],
};

const social = [
  { icon: MessageCircle, href: whatsappLink(), label: "WhatsApp" },
  { icon: Phone, href: `tel:+${site.phone2}`, label: "Phone" },
  { icon: InstagramIcon, href: site.instagramUrl, label: "Instagram" },
];

export function Footer() {
  return (
    /* Always dark — mirrors the space's black-walled interior regardless of theme */
    <footer className="relative text-[oklch(0.93_0.006_200)]" style={{ backgroundColor: "oklch(0.1 0.018 224)" }}>
      {/* teal hairline + soft glow at the seam */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.13_192/0.7)] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -top-px left-1/2 -translate-x-1/2 h-40 w-[36rem] max-w-full bg-[radial-gradient(closest-side,oklch(0.72_0.13_192/0.12),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 font-heading font-bold text-xl mb-4 text-[oklch(0.97_0.006_200)]">
              <CollisionMark className="w-8 h-8" />
              CO&#8209;LLISION
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6 text-[oklch(0.74_0.016_205)]">
              More than a coworking space. A productive environment where ideas, work, and
              opportunities connect.
            </p>
            <div className="flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social w-9 h-9 rounded-lg flex items-center justify-center"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm mb-4 text-[oklch(0.95_0.006_200)]">{title}</h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="footer-link text-sm">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderTop: "1px solid oklch(0.24 0.025 218)" }}
        >
          <p className="text-xs text-[oklch(0.62_0.012_208)]">
            © {new Date().getFullYear()} CO-LLISION Coworking. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.7_0.014_205)]">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="footer-link">
              {site.whatsappDisplay}
            </a>
            <span className="text-[oklch(0.4_0.01_215)]">·</span>
            <Link href="/login" className="footer-link">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
