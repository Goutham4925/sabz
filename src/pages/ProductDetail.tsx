import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, MessageCircle, ZoomIn } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  /* --------------------------------------------------
     LOAD PRODUCT
  -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);

        setSelectedImage(
          data.image_url ||
            (data.images?.length ? data.images[0].url : null)
        );
      } catch {
        setProduct(null);
      }
    })();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center">
          <h2 className="text-xl font-bold">Product not found</h2>
          <Link to="/products">
            <Button className="mt-4">Back to products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );

  /* --------------------------------------------------
     SAFE VALUES
  -------------------------------------------------- */
  const rating =
    typeof product.rating === "number" ? product.rating : 4.5;

  const ratingCount =
    typeof product.ratingCount === "number" ? product.ratingCount : 0;

  const parseList = (val: string | null) =>
    val ? val.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const highlights = parseList(product.highlights);
  const ingredients = parseList(product.ingredients);

  const galleryImages = [
    ...(product.image_url ? [{ id: "main", url: product.image_url }] : []),
    ...(product.images || []),
  ];

  /* --------------------------------------------------
     SEND ENQUIRY
  -------------------------------------------------- */
  const sendEnquiry = async () => {
    if (!form.name || !form.email) {
      toast({
        title: "Missing fields",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }

    try {
      await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: `Product Enquiry: ${product.name}`,
          productId: product.id,
        }),
      });

      toast({ title: "Enquiry sent successfully" });
      setOpen(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast({ title: "Error sending enquiry", variant: "destructive" });
    }
  };

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <Link
            to="/products"
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* IMAGE */}
            <div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={selectedImage!}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setZoomOpen(true)}
                />

                <button
                  className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow"
                  onClick={() => setZoomOpen(true)}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-3 mt-4 overflow-x-auto">
                {galleryImages.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() => setSelectedImage(img.url)}
                    className={`h-20 w-20 object-cover rounded-xl cursor-pointer border-2 ${
                      selectedImage === img.url
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div>
              {/* RATING */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(rating)
                        ? "fill-golden text-golden"
                        : "text-gray-400"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  {rating.toFixed(1)} ({ratingCount})
                </span>
              </div>

              <h1 className="font-display text-5xl font-bold mb-3">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg mb-4">
                {product.description}
              </p>

              <div className="text-4xl font-bold text-primary mb-6">
                {product.price ? `₹${product.price}` : "—"}
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full mb-8"
                onClick={() => setOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Send Enquiry
              </Button>

              {/* HIGHLIGHTS */}
              {highlights.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((h) => (
                      <span
                        key={h}
                        className="px-3 py-1 rounded-full bg-secondary"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* INGREDIENTS */}
              {ingredients.length > 0 && (
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-secondary"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* EXTRA DETAILS */}
              {(product.shelf_life ||
                product.weight ||
                product.package_type ||
                product.nutrition_info) && (
                <section className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Product Details
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {product.shelf_life && (
                      <div className="bg-muted p-3 rounded">
                        <strong>Shelf Life</strong>
                        <p className="text-muted-foreground">
                          {product.shelf_life}
                        </p>
                      </div>
                    )}

                    {product.weight && (
                      <div className="bg-muted p-3 rounded">
                        <strong>Weight</strong>
                        <p className="text-muted-foreground">
                          {product.weight}
                        </p>
                      </div>
                    )}

                    {product.package_type && (
                      <div className="bg-muted p-3 rounded">
                        <strong>Package Type</strong>
                        <p className="text-muted-foreground">
                          {product.package_type}
                        </p>
                      </div>
                    )}
                  </div>

                  {product.nutrition_info && (
                    <div className="mt-4">
                      <strong>Nutrition Info</strong>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {product.nutrition_info}
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ZOOM */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl p-0">
          <img src={selectedImage!} className="w-full h-full object-contain" />
        </DialogContent>
      </Dialog>

      {/* ENQUIRY */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <h2 className="text-xl font-semibold mb-4">
            Enquire about {product.name}
          </h2>

          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Textarea
            rows={4}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={sendEnquiry}>
              Send Enquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
