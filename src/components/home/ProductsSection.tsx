import { useEffect, useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import DOMPurify from "dompurify";
import "swiper/css";
import "swiper/css/pagination";
import { API_URL } from "@/config/api";

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // =====================================================
  // 1) READ PRELOADED DATA (INSTANT – NO DELAY)
  // =====================================================
  const preload = (window as any).__PRELOADED__?.productsBundle;
  const preProducts = preload?.products || [];
  const preSettings = preload?.settings || null;

  // Local state (used ONLY if preloaded data missing)
  const [products, setProducts] = useState<any[]>(preProducts);
  const [settings, setSettings] = useState<any>(preSettings);
  const [loading, setLoading] = useState(!preProducts.length);

  // =====================================================
  // 2) Fetch ONLY if preload failed
  // =====================================================
  useEffect(() => {
    if (preProducts.length) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const prodRes = await fetch(`${API_URL}/products/featured`);
        const prodData = await prodRes.json();

        const featured = prodData.filter((p: any) => p.is_featured);
        const nonFeatured = prodData.filter((p: any) => !p.is_featured);
        setProducts([...featured, ...nonFeatured].slice(0, 4));

        const setRes = await fetch(`${API_URL}/settings`);
        setSettings(await setRes.json());
      } catch (err) {
        console.error("Product load error:", err);
      }

      setLoading(false);
    }

    load();
  }, []);

  // =====================================================
  // 3) Intersection Observer (same smooth behavior)
  // =====================================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // =====================================================
  // Sanitize allowed inline <span>
  // =====================================================
  const sanitize = (html: string | null | undefined) =>
    DOMPurify.sanitize(html || "", {
      ALLOWED_TAGS: ["span", "strong", "b", "em", "i"],
      ALLOWED_ATTR: ["class", "style"],
    });

  return (
    <section
      ref={sectionRef}
      className={`py-24 bg-background relative overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">

        {/* =================== HEADER =================== */}
        {loading ? (
          <div className="h-[140px] animate-pulse bg-muted/20 rounded-xl mb-10" />
        ) : (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">
              {settings?.products_badge || "Our Collection"}
            </span>

            <h2
              className="section-title mb-4"
              dangerouslySetInnerHTML={{
                __html:
                  sanitize(settings?.products_title) ||
                  "Premium <span class='text-[#e4a95c]'>Biscuits</span>",
              }}
            />

            <p
              className="section-subtitle"
              dangerouslySetInnerHTML={{
                __html:
                  sanitize(settings?.products_subtitle) ||
                  "Discover our handcrafted selection of artisan biscuits.",
              }}
            />
          </div>
        )}

        {/* =================== PRODUCTS =================== */}
        {loading ? (
          <div className="grid grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[320px] bg-muted/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="transition-all duration-700"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(10px)",
                    transitionDelay: `${i * 120}ms`,
                  }}
                >
                  <ProductCard {...p} />
                </div>
              ))}
            </div>

            {/* Mobile Swiper */}
            <div className="md:hidden mb-12">
              <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1.2}
                pagination={{ clickable: true }}
              >
                {products.map((p) => (
                  <SwiperSlide key={p.id}>
                    <ProductCard {...p} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        )}

        {/* =================== VIEW ALL BUTTON =================== */}
        {!loading && (
          <div className="text-center">
            <Link to="/products">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-golden to-accent text-white"
              >
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* =====================================================
   PRELOAD → Returns BOTH products + settings
===================================================== */
ProductsSection.preload = async () => {
  try {
    const prodRes = await fetch(`${API_URL}/products/featured`);
    const prodData = await prodRes.json();

    const featured = prodData.filter((p: any) => p.is_featured);
    const nonFeatured = prodData.filter((p: any) => !p.is_featured);

    const settingsRes = await fetch(`${API_URL}/settings`);
    const settingsData = await settingsRes.json();

    return {
      products: [...featured, ...nonFeatured].slice(0, 4),
      settings: settingsData,
    };
  } catch {
    return { products: [], settings: null };
  }
};
