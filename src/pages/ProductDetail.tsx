import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { useGlobalLoading } from "@/context/LoadingContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // enquiry modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { toast } = useToast();
  const { setLoading: setGlobalLoading } = useGlobalLoading();

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      setGlobalLoading(true);

      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Prevent flicker
  if (loading) return null;

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper — convert string → array
  const parseList = (val: any): string[] => {
    if (!val) return [];
    if (typeof val === "string")
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const highlights = parseList(product.highlights);
  const ingredients = parseList(product.ingredients);

  // Send enquiry
  const sendEnquiry = async () => {
    if (!form.name || !form.email) {
      toast({
        title: "Missing fields",
        description: "Please provide at least your name and email.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      subject: `Product Enquiry: ${product.name}`,
      message:
        (form.message || "Customer requested more details.") +
        `\n\nProduct: ${product.name}\nPhone: ${form.phone || "N/A"}`,
    };

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Enquiry Sent",
        description: "The admin will contact you shortly.",
      });

      setForm({ name: "", email: "", phone: "", message: "" });
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send enquiry.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* IMAGE */}
            <div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col">
              {/* Rating Display */}
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "fill-golden text-golden" : "text-muted"
                    }`}
                  />
                ))}
                <span className="text-muted-foreground text-sm">
                  4.8 (120 reviews)
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="font-display text-4xl font-bold text-primary mb-8">
                {product.price ? `₹${product.price.toFixed(2)}` : "—"}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button variant="hero" size="xl" className="flex-1" onClick={() => setOpen(true)}>
                  <MessageCircle className="w-5 h-5" />
                  Send Enquiry
                </Button>

                <Button variant="outline" size="xl">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-3 gap-4 py-8 border-t border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Free Shipping</p>
                </div>

                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Quality Guaranteed
                  </p>
                </div>

                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Easy Returns</p>
                </div>
              </div>

              {/* HIGHLIGHTS */}
              {highlights.length > 0 && (
                <div className="py-6">
                  <h3 className="font-display text-xl font-semibold mb-3">
                    Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((h) => (
                      <span
                        key={h}
                        className="bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* INGREDIENTS */}
              {ingredients.length > 0 && (
                <div className="py-6 border-t border-border">
                  <h3 className="font-display text-xl font-semibold mb-4">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* NUTRITION INFO */}
              {product.nutrition_info && (
                <div className="py-6 border-t border-border">
                  <h3 className="font-display text-xl font-semibold mb-3">
                    Nutrition Information
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {product.nutrition_info}
                  </p>
                </div>
              )}

              {/* EXTRA DETAILS */}
              <div className="py-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.shelf_life && (
                  <div>
                    <strong>Shelf Life</strong>
                    <div className="text-muted-foreground">
                      {product.shelf_life}
                    </div>
                  </div>
                )}

                {product.weight && (
                  <div>
                    <strong>Weight</strong>
                    <div className="text-muted-foreground">
                      {product.weight}
                    </div>
                  </div>
                )}

                {product.package_type && (
                  <div>
                    <strong>Package Type</strong>
                    <div className="text-muted-foreground">
                      {product.package_type}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ENQUIRY MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquire about {product.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Textarea
              placeholder="Message (optional)"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={sendEnquiry}>
              Send Enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
