import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { About } from "@/components/marketing/about";
import { Spaces } from "@/components/marketing/spaces";
import { Gallery } from "@/components/marketing/gallery";
import { Amenities } from "@/components/marketing/amenities";
import { Pricing } from "@/components/marketing/pricing";
import { Contact } from "@/components/marketing/contact";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFab } from "@/components/marketing/whatsapp-fab";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Spaces />
      <Gallery />
      <Amenities />
      <Pricing />
      <Contact />
      <Footer />
      <WhatsAppFab />
    </main>
  );
}
