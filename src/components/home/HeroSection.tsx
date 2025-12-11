import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL } from "@/config/api";

export function HeroSection() {
  const [settings, setSettings] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const data = await res.json();
        setSettings(data);
        setIsVisible(true);
      } catch (err) {
        console.error("Hero load error:", err);
      }
    }
    loadSettings();
  }, []);

  // ⭐ DO NOT RETURN NULL — prevents layout collapse
  const heroHeight = "min-h-screen flex items-center justify-center";

  if (!settings) {
    return (
      <section className={`relative ${heroHeight} bg-black/10`}>
        <div className="animate-pulse text-center text-white opacity-40">
          Loading Hero…
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-sm animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-sm animate-float" style={{ animationDelay: "3s" }} />

      {/* Hero Image (DYNAMIC) */}
      {settings.hero_image_url && (
        <img
          src={settings.hero_image_url}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-cream/10 border border-cream/20 text-cream px-4 py-2 rounded-full text-sm mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{settings.hero_badge_text || "Premium Artisan Quality"}</span>
          </div>

          {/* Title */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            dangerouslySetInnerHTML={{
              __html: settings.hero_title || "Crafted with <span class='text-[#e4a95c]'>Tradition</span>. Baked with Love.",
            }}
          />

          {/* Subtitle */}
          <p
            className={`text-[#e4a95c] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {settings.hero_subtitle || "Premium biscuits made fresh everyday."}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Link to="/products">
              <Button variant="hero" size="xl" className="bg-gradient-to-r from-golden to-accent text-chocolate">
                View Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/about">
              <Button className="border-cream/30 text-cream hover:bg-cream/10 hover:text-cream" variant="outline" size="xl">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------
   ⭐ PRELOAD FUNCTION FOR Index.jsx 
-------------------------------------*/
HeroSection.preload = async () => {
  try {
    const res = await fetch(`${API_URL}/settings`);
    return await res.json();
  } catch {
    return null;
  }
};
