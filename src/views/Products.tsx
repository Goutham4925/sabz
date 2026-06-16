"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";

import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/home/ProductCard";
import { ProductsGridLoader } from "@/components/home/ProductsGridLoader";
import { Button } from "@/components/ui/button";

import { API_URL } from "@/config/api";

interface Category {
  id: number | "all";
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([{ id: "all", name: "All" }]);
  const [settings, setSettings] = useState<any>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showPrices, setShowPrices] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategoryId = searchParams.get("categoryId") || "all";

  const sanitize = (html?: string | null) =>
    DOMPurify.sanitize(html || "", {
      ALLOWED_TAGS: ["span", "strong", "b", "em", "i"],
      ALLOWED_ATTR: ["class"],
    });

  useEffect(() => {
    fetch(`${API_URL}/products?view=list`)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setProductsLoading(false); })
      .catch(() => setProductsLoading(false));

    fetch(`${API_URL}/categories`)
      .then((r) => r.json())
      .then((cats) => Array.isArray(cats) && setCategories([{ id: "all", name: "All" }, ...cats]))
      .catch(() => {});

    fetch(`${API_URL}/settings`).then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  const filteredProducts =
    activeCategoryId === "all"
      ? products
      : products.filter((p) => String(p.categoryId) === String(activeCategoryId));

  const handleCategoryClick = (id: string | number) => {
    if (id === "all") router.push("/products");
    else router.push(`/products?categoryId=${id}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block">
              {settings?.products_badge || "Our Collection"}
            </span>
            <h1
              className="section-title mb-4"
              dangerouslySetInnerHTML={{
                __html: sanitize(settings?.products_title) || "Premium <span class='text-gradient'>Masalas</span>",
              }}
            />
            <p
              className="section-subtitle"
              dangerouslySetInnerHTML={{
                __html: sanitize(settings?.products_subtitle) || "Discover our handcrafted selection of authentic Kerala masala powders.",
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => {
                const isActive = String(activeCategoryId) === String(c.id);
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

          {productsLoading ? (
            <ProductsGridLoader />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
                  <ProductCard {...product} showPrice={showPrices} />
                </div>
              ))}
            </div>
          )}

          {!productsLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
