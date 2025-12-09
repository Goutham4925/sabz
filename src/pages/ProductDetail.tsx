import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useGlobalLoading } from "@/context/LoadingContext";

const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { setLoading: setGlobalLoading } = useGlobalLoading();

  // ============================
  // FETCH PRODUCT FROM BACKEND
  // ============================
  useEffect(() => {
    const loadProduct = async () => {
      setGlobalLoading(true); // Start global loader

      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
        setGlobalLoading(false); // Stop global loader
      }
    };

    loadProduct();
  }, [id]);

  // --------------------------------
  // Prevent page flicker (global loader)
  // --------------------------------
  if (loading) return null;


  // ============================
  // PRODUCT NOT FOUND
  // ============================
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============================
  // PRODUCT FOUND — SHOW PAGE
  // ============================
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">

          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* ============================
                PRODUCT IMAGE
            ============================ */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
            </div>

            {/* ============================
                PRODUCT INFO
            ============================ */}
            <div className="flex flex-col">
              
              {/* Rating Display */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "fill-golden text-golden" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  4.8 (120 reviews)
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {product.description || "No detailed description available."}
              </p>

              <div className="font-display text-4xl font-bold text-primary mb-8">
                {product.price ? `$${product.price.toFixed(2)}` : "—"}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button variant="hero" size="xl" className="flex-1">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4 py-8 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Quality Guaranteed</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Easy Returns</p>
                </div>
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="py-8 border-t border-border">
                  <h3 className="font-display text-xl font-semibold mb-4">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient: string) => (
                      <span
                        key={ingredient}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
