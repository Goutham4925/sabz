import { useEffect, useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";
import { API_URL } from "@/config/api";

// Swiper (mobile only)
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] = useState(true); // ✅ visible by default (no dead state)
  const [isMobile, setIsMobile] = useState(false);

  /* =====================================================
     PRELOAD FAST PATH
  ===================================================== */
  const preload = (window as any).__PRELOADED__?.productsBundle;
  const preProducts = preload?.products ?? [];
  const preSettings = preload?.settings ?? null;

  const [products, setProducts] = useState<any[]>(preProducts);
  const [settings, setSettings] = useState<any>(preSettings);
  const [loading, setLoading] = useState(!preProducts.length);

  /* =====================================================
     DEVICE CHECK
  ===================================================== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* =====================================================
     FETCH DATA (PRODUCTS FIRST)
  ===================================================== */
  useEffect(() => {
    if (preProducts.length) {
      setLoading(false);
      return;
    }

    // 🚀 PRODUCTS (priority)
    fetch(`${API_URL}/products/featured`)
      .then((r) => r.json())
      .then((prodData) => {
        const featured = prodData.filter((p: any) => p.is_featured);
        const nonFeatured = prodData.filter((p: any) => !p.is_featured);
        setProducts([...featured, ...nonFeatured].slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 🎨 SETTINGS (background, non-blocking)
    fetch(`${API_URL}/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  /* =====================================================
     INTERSECTION OBSERVER (DESKTOP ONLY)
  ===================================================== */
  useEffect(() => {
    if (isMobile) return;

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
    return () => observer.disconnect();
  }, [isMobile]);

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
      className={`
        py-24 bg-background relative
        overflow-visible md:overflow-hidden
        transition-opacity duration-500
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="container mx-auto px-4 md:px-8">

        {/* ================= HEADER ================= */}
        {loading ? (
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

        {/* ================= PRODUCTS ================= */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {/* DESKTOP GRID */}
            {!isMobile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {products.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ transitionDelay: `${i * 120}ms` }}
                    className="transition-opacity duration-500"
                  >
                    <ProductCard {...p} />
                  </div>
                ))}
              </div>
            )}

            {/* MOBILE SWIPER */}
            {isMobile && (
              <div className="mb-12">
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1.2}
                  spaceBetween={20}
                  pagination={{ clickable: true }}
                  touchStartPreventDefault={false}
                  touchMoveStopPropagation={false}
                  passiveListeners={true}
                  resistanceRatio={0}
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

        {/* ================= CTA ================= */}
        {!loading && (
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
   OPTIONAL PRELOAD (FAST SSR / HYDRATION)
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
