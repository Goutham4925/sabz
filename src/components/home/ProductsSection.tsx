import { useEffect, useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000/api";

export function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products/featured`);
        const data = await res.json();

        // FEATURED FIRST → then fallback
        const featured = data.filter((p) => p.is_featured === true);
        const nonFeatured = data.filter((p) => !p.is_featured);

        // Combine and take only 4 for home
        const finalList = [...featured, ...nonFeatured].slice(0, 4);

        setProducts(finalList);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Fade-in animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={`badge-premium mb-4 inline-block transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our Collection
          </span>

          <h2
            className={`section-title mb-4 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Premium <span className="text-gradient">Biscuits</span>
          </h2>

          <p
            className={`section-subtitle transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Discover our handcrafted selection of artisan biscuits.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-muted-foreground">Loading products...</p>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <p className="text-center text-muted-foreground">No products available.</p>
        )}

        {/* DESKTOP GRID */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <ProductCard {...p} />
            </div>
          ))}
        </div>

        {/* MOBILE SWIPER */}
        <div className="md:hidden mb-12">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            pagination={{ clickable: true }}
            style={{ paddingBottom: "40px" }}
          >
            {products.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard {...p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View All Button */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <Link to="/products">
            <Button variant="default" size="lg" className="bg-gradient-to-r from-golden to-accent text-white">
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
