// Central place for CO-LLISION's real contact details and brand info.
export const site = {
  name: "CO-LLISION",
  tagline: "Where Ideas, Work & Opportunities Connect",
  // Primary WhatsApp / phone numbers (from the owner)
  whatsapp: "923289669619",
  whatsappDisplay: "+92 328 966 9619",
  phone2: "923000861000",
  phone2Display: "+92 300 086 1000",
  email: "hello@collision.pk",
  instagram: "collision.workspace",
  instagramUrl: "https://instagram.com/collision.workspace",
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
