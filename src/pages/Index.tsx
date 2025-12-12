import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";

import { useGlobalLoading } from "@/context/LoadingContext";

const Index = () => {
  const { setLoading } = useGlobalLoading();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function loadAll() {
      try {
        // ⭐ Preload everything needed BEFORE rendering
        const [heroData, productBundle, aboutData] = await Promise.all([
          HeroSection.preload?.(),          // settings only
          ProductsSection.preload?.(),      // products + settings bundle
          AboutSection.preload?.(),         // settings only
        ]);

        if (!mounted) return;

        // Attach preload data globally so components can read instantly
        (window as any).__PRELOADED__ = {
          hero: heroData,
          productsBundle: productBundle,   // contains products + settings
          about: aboutData,
        };

        setReady(true);
        setLoading(false);
      } catch (err) {
        console.error("Homepage preload error:", err);
        setReady(true);
        setLoading(false);
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  // Prevent flash while preloading
  if (!ready) return null;

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
