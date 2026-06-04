import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { CollisionSection } from "@/components/marketing/collision/collision-section";
import { About } from "@/components/marketing/about";
import { Spaces } from "@/components/marketing/spaces";
import { Gallery } from "@/components/marketing/gallery";
import { Amenities } from "@/components/marketing/amenities";
import { Pricing } from "@/components/marketing/pricing";
import { Contact } from "@/components/marketing/contact";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppFab } from "@/components/marketing/whatsapp-fab";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Navbar />
        <Hero />
        <CollisionSection />
        <About />
        <Spaces />
        <Gallery />
        <Amenities />
        <Pricing />
        <Contact />
        <Footer />
        <WhatsAppFab />
      </main>
    </SmoothScroll>
  );
}
