import { useEffect, useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";
import { API_URL } from "@/config/api";

// Swiper (lazy used on mobile only)
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* =====================================================
     PRELOAD FAST PATH
  ===================================================== */
  const preload = (window as any).__PRELOADED__?.productsBundle;
  const preProducts = preload?.products ?? [];
  const preSettings = preload?.settings ?? null;

  const [products, setProducts] = useState<any[]>(preProducts);
  const [settings, setSettings] = useState<any>(preSettings);

  const [productsLoading, setProductsLoading] = useState(!preProducts.length);
  const [isMobile, setIsMobile] = useState(false);

  /* =====================================================
     DEVICE CHECK (for Swiper)
  ===================================================== */
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  /* =====================================================
     FETCH PRODUCTS FIRST (NON-BLOCKING SETTINGS)
  ===================================================== */
  useEffect(() => {
    if (preProducts.length) {
      setProductsLoading(false);
      return;
    }

    // 🚀 PRODUCTS (priority)
    fetch(`${API_URL}/products/featured`)
      .then((r) => r.json())
      .then((prodData) => {
        const featured = prodData.filter((p: any) => p.is_featured);
        const nonFeatured = prodData.filter((p: any) => !p.is_featured);
        setProducts([...featured, ...nonFeatured].slice(0, 4));
        setProductsLoading(false); // ⬅ products can render NOW
      })
      .catch(console.error);

    // 🎨 SETTINGS (background)
    fetch(`${API_URL}/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  /* =====================================================
     INTERSECTION OBSERVER (SAFE + FALLBACK)
  ===================================================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    // 🛟 Fallback — NEVER stay invisible
    const timeout = setTimeout(() => setIsVisible(true), 600);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  /* =====================================================
     SANITIZE CMS HTML
  ===================================================== */
  const sanitize = (html?: string | null) =>
    DOMPurify.sanitize(html || "", {
      ALLOWED_TAGS: ["span", "strong", "b", "em", "i"],
      ALLOWED_ATTR: ["class", "style"],
    });

  /* =====================================================
     SKELETONS
  ===================================================== */
  const HeaderSkeleton = () => (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="h-6 w-32 mx-auto bg-muted/30 rounded-full mb-4 animate-pulse" />
      <div className="h-10 w-3/4 mx-auto bg-muted/30 rounded mb-4 animate-pulse" />
      <div className="h-4 w-2/3 mx-auto bg-muted/30 rounded animate-pulse" />
    </div>
  );

  const CardSkeleton = () => (
    <div className="rounded-2xl bg-muted/30 p-4 animate-pulse">
      <div className="h-40 bg-muted/40 rounded-xl mb-4" />
      <div className="h-4 bg-muted/40 rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted/40 rounded w-1/2 mb-4" />
      <div className="h-8 bg-muted/40 rounded w-full" />
    </div>
  );

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <section
      ref={sectionRef}
      className={`py-24 bg-background relative overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">

        {/* =================== HEADER =================== */}
        {productsLoading ? (
          <HeaderSkeleton />
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
                  "Premium <span class='text-[#e4a95c]'>Products</span>",
              }}
            />

            <p
              className="section-subtitle"
              dangerouslySetInnerHTML={{
                __html:
                  sanitize(settings?.products_subtitle) ||
                  "Discover our handcrafted selection of premium products.",
              }}
            />
          </div>
        )}

        {/* =================== PRODUCTS =================== */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            {!isMobile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ transitionDelay: `${i * 120}ms` }}
                    className="transition-all duration-700"
                  >
                    <ProductCard {...p} />
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Swiper */}
            {isMobile && (
              <div className="mb-12">
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
            )}
          </>
        )}

        {/* =================== CTA =================== */}
        {!productsLoading && (
          <div className="text-center">
            <Link to="/products">
              <Button
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
   PRELOAD (OPTIONAL BUT FAST)
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
