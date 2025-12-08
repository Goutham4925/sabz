import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/home/ProductCard';
import { Button } from '@/components/ui/button';

const API_URL = "http://localhost:5000/api";

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'Classic', name: 'Classic' },
  { id: 'Premium', name: 'Premium' },
  { id: 'Healthy', name: 'Healthy' },
  { id: 'Seasonal', name: 'Seasonal' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPrices, setShowPrices] = useState(true);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------
  // FETCH PRODUCTS FROM BACKEND (REAL DATA)
  // -----------------------------------------------
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
      setLoading(false);
    }

    loadProducts();
  }, []);

  // -----------------------------------------------
  // CATEGORY FILTER
  // -----------------------------------------------
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* PAGE HEADER */}
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

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={showPrices}
                onChange={(e) => setShowPrices(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary"
              />
              Show Prices
            </label>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center text-muted-foreground">Loading products...</p>
          )}

          {/* PRODUCTS GRID */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image_url={product.image_url}  // 🔥 FIXED
                    showPrice={showPrices}
                  />
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredProducts.length === 0 && (
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
