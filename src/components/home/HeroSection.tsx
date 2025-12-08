import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

interface SiteSettings {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_badge: string | null;

  hero_cta_primary_label: string | null;
  hero_cta_primary_link: string | null;
  hero_cta_secondary_label: string | null;
  hero_cta_secondary_link: string | null;

  stat1_label: string | null;
  stat1_value: string | null;
  stat2_label: string | null;
  stat2_value: string | null;
  stat3_label: string | null;
  stat3_value: string | null;
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setIsVisible(true);

    const loadSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("HeroSection: failed to load settings", err);
        setSettings(null);
      }
    };

    loadSettings();
  }, []);

  const badgeText =
    settings?.hero_badge || "Premium Artisan Quality Since 1980";

  const heroTitle =
    settings?.hero_title || "Crafted with Tradition. Baked with Love.";

  const heroSubtitle =
    settings?.hero_subtitle ||
    "Experience the golden perfection of handcrafted biscuits, made with the finest ingredients and recipes passed down through generations.";

  const primaryCtaLabel = settings?.hero_cta_primary_label || "View Products";
  const primaryCtaLink = settings?.hero_cta_primary_link || "/products";

  const secondaryCtaLabel = settings?.hero_cta_secondary_label || "Our Story";
  const secondaryCtaLink = settings?.hero_cta_secondary_link || "/about";

  const stat1Value = settings?.stat1_value || "40+";
  const stat1Label = settings?.stat1_label || "Years of Excellence";

  const stat2Value = settings?.stat2_value || "50K+";
  const stat2Label = settings?.stat2_label || "Happy Customers";

  const stat3Value = settings?.stat3_value || "25+";
  const stat3Label = settings?.stat3_label || "Unique Flavors";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating Biscuit Decorations */}
      <div
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-sm animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-sm animate-float"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 badge-premium mb-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{badgeText}</span>
          </div>

          {/* Main Headline */}
          <h1
            className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight mb-6 transition-all duration-1000 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {heroTitle}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Link to={primaryCtaLink}>
              <Button variant="hero" size="xl" className="group">
                {primaryCtaLabel}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={secondaryCtaLink}>
              <Button variant="outline" size="xl">
                {secondaryCtaLabel}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            className={`mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                {stat1Value}
              </p>
              <p className="text-muted-foreground text-sm">{stat1Label}</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                {stat2Value}
              </p>
              <p className="text-muted-foreground text-sm">{stat2Label}</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                {stat3Value}
              </p>
              <p className="text-muted-foreground text-sm">{stat3Label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
