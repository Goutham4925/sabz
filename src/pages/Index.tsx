import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CTASection } from "@/components/home/CTASection";

import { useGlobalLoading } from "@/context/LoadingContext";

const Index = () => {
  const { setLoading } = useGlobalLoading();

  useEffect(() => {
    // Start global loading as soon as homepage loads
    setLoading(true);

    // Homepage loads multiple components:
    // HeroSection (fetch settings), ProductsSection (fetch products)
    // We wait a bit to allow all main content to load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Adjustable timing (800ms is smooth)

    return () => clearTimeout(timer);
  }, [setLoading]);

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
