import { HeroSlider } from "@/components/HeroSlider";
import { StatisticsBar } from "@/components/StatisticsBar";
import { FeaturedNews } from "@/components/FeaturedNews";
import { AboutSection } from "@/components/AboutSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactStrip } from "@/components/ContactStrip";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <StatisticsBar />
      <AboutSection />
      <FeaturedNews />
      <GallerySection />
      <ContactStrip />
    </main>
  );
}
