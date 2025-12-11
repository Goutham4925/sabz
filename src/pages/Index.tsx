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
      // Wait for all homepage section fetches to resolve
      await Promise.all([
        HeroSection.preload?.(),
        ProductsSection.preload?.(),
        AboutSection.preload?.(),
      ]);

      // Safety check
      if (mounted) {
        setReady(true);
        setLoading(false);
      }
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  // ❌ Prevent rendering until ALL sections have loaded
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
