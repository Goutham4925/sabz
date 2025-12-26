import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <HeroSection />
        <ProductsSection />
        <AboutSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
