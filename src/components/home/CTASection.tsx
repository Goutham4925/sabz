import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function CTASection() {
  const { settings } = useSiteSettings();

  // Hooks MUST ALWAYS come first — before any returns
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  // Attach intersection observer only once
  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // run one time only
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // SAFE — we can return early AFTER all hooks were declared
  if (!settings) return null;

  return (
    <section ref={ref} className="py-24 bg-chocolate relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-golden opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 bg-cream/10 border border-cream/20 text-cream px-4 py-2 rounded-full text-sm mb-8 transition-all duration-700 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Gift className="w-4 h-4" />
          <span>{settings.cta_badge_text || "Perfect for Gifting"}</span>
        </div>

        {/* Title */}
        <h2
          className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 transition-all duration-700 delay-100 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          dangerouslySetInnerHTML={{
            __html:
              settings.cta_title ||
              "Ready to Experience <span class='text-golden'>Golden Perfection</span>?",
          }}
        />

        {/* Subtitle */}
        <p
          className={`text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {settings.cta_subtitle ||
            "Order our premium biscuits today and discover why customers love us."}
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Link to={settings.cta_primary_href || "/products"}>
            <Button
              size="xl"
              className="bg-gradient-to-r from-golden to-accent text-chocolate font-bold hover:shadow-glow"
            >
              {settings.cta_primary_label || "Shop Now"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Link to="/contact">
            <Button
              variant="outline"
              size="xl"
              className="border-cream/30 text-cream hover:bg-cream/10 hover:text-cream"
            >
              Corporate Orders
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
