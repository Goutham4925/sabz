import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { useGlobalLoading } from "@/context/LoadingContext";

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
  const [showPrices, setShowPrices] = useState(true);
  const [loading, setLoading] = useState(true);

  const { setLoading: setGlobalLoading } = useGlobalLoading();

  // URL PARAMS
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryId = searchParams.get("categoryId") || "all";

  // ------------------------------------------------
  // FETCH PRODUCTS + CATEGORIES
  // ------------------------------------------------
  useEffect(() => {
    const load = async () => {
      setGlobalLoading(true);

      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
        ]);

        const productsData = await prodRes.json();
        const categoryData = await catRes.json();

        setProducts(productsData);
        setCategories([{ id: "all", name: "All" }, ...categoryData]);
      } catch (err) {
        console.error("Failed to load products/categories:", err);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    load();
  }, []);

  // ------------------------------------------------
  // FILTER PRODUCTS BASED ON URL CATEGORY
  // ------------------------------------------------
  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter(
          (p) => String(p.categoryId) === String(activeCategoryId)
        );

  // ------------------------------------------------
  // HANDLE CATEGORY CLICK (SYNC WITH URL)
  // ------------------------------------------------
  const handleCategoryClick = (id: string | number) => {
    if (id === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ categoryId: String(id) });
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">
              Our Collection
            </span>

            <h1 className="section-title mb-4">
              Premium <span className="text-gradient">Biscuits</span>
            </h1>

            <p className="section-subtitle">
              Explore our complete range of handcrafted artisan biscuits.
            </p>
          </div>

          {/* FILTER BUTTONS */}
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

          {/* DESKTOP GRID */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard {...product} showPrice={showPrices} />
              </div>
            ))}
          </div>

          {/* MOBILE SWIPER */}
          <div className="md:hidden mb-12">
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
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
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
