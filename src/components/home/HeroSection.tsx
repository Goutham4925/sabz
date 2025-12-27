import { useEffect, useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL } from "@/config/api";

const FALLBACK = {
  hero_title:
    "Pure Flavors, <span class='text-[#e4a95c]'>Rooted</span> in Tradition",
  hero_subtitle: "Experience the authentic taste of Kerala with our handcrafted masala powders, made from the finest spices and recipes passed down through generations.",
  hero_badge_text: "Premium Kerala Spices",
  hero_image_url: null,
};

export const HeroSection = memo(function HeroSection() {
  const [settings, setSettings] = useState<any>(FALLBACK);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let alive = true;

    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (alive) setSettings(data);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative blobs (unchanged) */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />

      {/* Hero Image (lazy & async) */}
      {settings.hero_image_url && (
        <img
          src={settings.hero_image_url}
          alt="Hero Background"
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-85" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cream/10 border border-cream/20 text-cream px-4 py-2 rounded-full text-sm mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span>{settings.hero_badge_text}</span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 animate-fade-up delay-100"
            dangerouslySetInnerHTML={{ __html: settings.hero_title }}
          />

          {/* Subtitle */}
          <p className="text-[#e4a95c] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            {settings.hero_subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Link to="/products">
              <Button
                variant="hero"
                size="xl"
                className="bg-gradient-to-r from-golden to-accent text-chocolate"
              >
                View Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link to="/about">
              <Button
                className="border-cream/30 text-cream hover:bg-cream/10"
                variant="outline"
                size="xl"
              >
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});
