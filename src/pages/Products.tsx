import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { ProductsGridLoader } from "@/components/home/ProductsGridLoader";
import { Button } from "@/components/ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { API_URL } from "@/config/api";

interface Category {
  id: number | "all";
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "All" },
  ]);
  const [settings, setSettings] = useState<any>(null);

  const [productsLoading, setProductsLoading] = useState(true);
  const [showPrices, setShowPrices] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId") || "all";

  /* =====================================================
     DEVICE CHECK (Swiper only on mobile)
  ===================================================== */
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  /* =====================================================
     SANITIZE CMS HTML
  ===================================================== */
  const sanitize = (html?: string | null) =>
    DOMPurify.sanitize(html || "", {
      ALLOWED_TAGS: ["span", "strong", "b", "em", "i"],
      ALLOWED_ATTR: ["class"],
    });

  /* =====================================================
     FETCH PRODUCTS FIRST (CRITICAL PATH)
  ===================================================== */
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setProductsLoading(false); // 🚀 products render immediately
      })
      .catch((err) => {
        console.error("Products load error:", err);
        setProductsLoading(false);
      });

    // 🎨 categories (background)
    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((cats) =>
        setCategories([{ id: "all", name: "All" }, ...cats])
      )
      .catch(() => {});

    // 🎨 settings (background)
    fetch(`${API_URL}/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */
  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter(
          (p) => String(p.categoryId) === String(activeCategoryId)
        );

  /* =====================================================
     CATEGORY CLICK
  ===================================================== */
  const handleCategoryClick = (id: string | number) => {
    if (id === "all") setSearchParams({});
    else setSearchParams({ categoryId: String(id) });
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* ================= HEADER ================= */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">
              {settings?.products_badge || "Our Collection"}
            </span>

            <h1
              className="section-title mb-4"
              dangerouslySetInnerHTML={{
                __html:
                  sanitize(settings?.products_title) ||
                  "Premium <span class='text-gradient'>Products</span>",
              }}
            />

            <p
              className="section-subtitle"
              dangerouslySetInnerHTML={{
                __html:
                  sanitize(settings?.products_subtitle) ||
                  "Explore our complete range of handcrafted products.",
              }}
            />
          </div>

          {/* ================= FILTERS ================= */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => {
                const isActive =
                  String(activeCategoryId) === String(c.id);

                return (
                  <Button
                    key={c.id}
                    variant={isActive ? "default" : "secondary"}
                    size="sm"
                    onClick={() => handleCategoryClick(c.id)}
                  >
                    {c.name}
                  </Button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showPrices}
                onChange={(e) => setShowPrices(e.target.checked)}
                className="w-4 h-4"
              />
              Show Prices
            </label>
          </div>

          {/* ================= DESKTOP GRID ================= */}
          {!isMobile && (
            <div className="hidden md:block">
              {productsLoading ? (
                <ProductsGridLoader />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <ProductCard {...product} showPrice={showPrices} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= MOBILE SWIPER ================= */}
          {isMobile && (
            <div className="md:hidden mb-12">
              {productsLoading ? (
                <ProductsGridLoader count={3} />
              ) : (
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1.2}
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                >
                  {filteredProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                      <ProductCard {...product} showPrice={showPrices} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          )}

          {/* ================= EMPTY STATE ================= */}
          {!productsLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
