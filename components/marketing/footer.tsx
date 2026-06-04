import Link from "next/link";
import { Zap, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
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
    <footer
      className="text-[oklch(0.93_0.006_200)]"
      style={{ backgroundColor: "oklch(0.11 0.02 222)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-heading font-bold text-xl mb-4 text-[oklch(0.95_0.006_200)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.13_192)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[oklch(0.14_0.02_220)]" />
              </div>
              CO&#8209;LLISION
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6 text-[oklch(0.62_0.012_205)]">
              More than a coworking space — a productive environment where ideas, work,
              and opportunities connect.
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
              <h4 className="font-heading font-semibold text-sm mb-4 text-[oklch(0.93_0.006_200)]">
                {title}
              </h4>
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
          style={{ borderTop: "1px solid oklch(0.21 0.02 220)" }}
        >
          <p className="text-xs text-[oklch(0.44 0.01 210)]">
            © {new Date().getFullYear()} CO-LLISION Coworking. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.5 0.012 210)]">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              {site.whatsappDisplay}
            </a>
            <span className="text-[oklch(0.3 0.01 215)]">·</span>
            <Link href="/login" className="footer-link">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
