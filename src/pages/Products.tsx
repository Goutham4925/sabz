import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGlobalLoading } from "@/context/LoadingContext";

// Swiper for mobile
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000/api";

const categories = [
  { id: "all", name: "All Products" },
  { id: "Classic", name: "Classic" },
  { id: "Premium", name: "Premium" },
  { id: "Healthy", name: "Healthy" },
  { id: "Seasonal", name: "Seasonal" },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPrices, setShowPrices] = useState(true);
  const [loading, setLoading] = useState(true);

  const { setLoading: setGlobalLoading } = useGlobalLoading();

  // -----------------------------------------------
  // FETCH PRODUCTS
  // -----------------------------------------------
  useEffect(() => {
    const load = async () => {
      // Start global loader
      setGlobalLoading(true);

      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }

      setLoading(false);
      // Stop global loader when data is ready
      setGlobalLoading(false);
    };

    load();
  }, []);

  // -----------------------------------------------
  // FILTERED PRODUCTS
  // -----------------------------------------------
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Prevent initial page flicker
  if (loading) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">Our Collection</span>

            <h1 className="section-title mb-4">
              Premium <span className="text-gradient">Biscuits</span>
            </h1>

            <p className="section-subtitle">
              Explore our complete range of handcrafted artisan biscuits.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <Button
                  key={c.id}
                  variant={activeCategory === c.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveCategory(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showPrices}
                onChange={(e) => setShowPrices(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary"
              />
              Show Prices
            </label>
          </div>

          {/* -------------------------- */}
          {/* DESKTOP GRID */}
          {/* -------------------------- */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  {...product}
                  image_url={product.image_url}
                  showPrice={showPrices}
                />
              </div>
            ))}
          </div>

          {/* -------------------------- */}
          {/* MOBILE SWIPER */}
          {/* -------------------------- */}
          <div className="md:hidden mb-12">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              style={{ paddingBottom: "40px" }}
            >
              {filteredProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    {...product}
                    image_url={product.image_url}
                    showPrice={showPrices}
                  />
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
