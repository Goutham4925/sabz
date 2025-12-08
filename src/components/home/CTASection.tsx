import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function CTASection() {
  const { settings } = useSiteSettings();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!settings) return null;

  return (
    <section ref={ref} className="py-24 bg-chocolate relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">

        {/* Badge */}
        <div className={`badge transition-all ${visible ? "opacity-100" : "opacity-0"}`}>
          <Gift className="w-4 h-4" />
          <span>{settings.cta_badge_text || "Perfect for Gifting"}</span>
        </div>

        {/* Title */}
        <h2
          className="text-cream font-display text-5xl font-bold"
          dangerouslySetInnerHTML={{
            __html: settings.cta_title || "Ready to Experience <span class='text-golden'>Golden Perfection</span>?"
          }}
        />

        {/* Subtitle */}
        <p className="text-cream/70 mt-4">
          {settings.cta_subtitle || "Order our premium biscuits today."}
        </p>

        {/* Button */}
        <div className="mt-10">
          <Link to={settings.cta_primary_href || "/products"}>
            <Button size="xl">
              {settings.cta_primary_label || "Shop Now"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
