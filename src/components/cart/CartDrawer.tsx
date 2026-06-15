import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";

type Step = "cart" | "checkout";

export function CartDrawer() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount, isOpen, closeCart } =
    useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const resetCheckout = () => {
    setStep("cart");
    setForm({ name: "", phone: "", email: "", address: "", notes: "" });
  };

  const handleClose = () => {
    closeCart();
    resetCheckout();
  };

  const submitEnquiry = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast({ title: "Please fill name, phone and address", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const products = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));

      const totalStr = total > 0 ? `₹${total.toFixed(2)}` : "—";

      await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          address: form.address,
          subject: `Cart Enquiry — ${itemCount} item${itemCount !== 1 ? "s" : ""} (${totalStr})`,
          message: form.notes || "Customer sent a cart enquiry.",
          products,
        }),
      });

      toast({ title: "Enquiry sent!", description: "We'll get back to you soon." });
      clearCart();
      handleClose();
    } catch {
      toast({ title: "Failed to send enquiry", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent aria-describedby={undefined} className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            {step === "cart" ? `Your Cart (${itemCount})` : "Checkout"}
          </SheetTitle>
        </SheetHeader>

        {/* ── CART STEP ── */}
        {step === "cart" && (
          <>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                <p className="text-muted-foreground">Your cart is empty.</p>
                <Button variant="outline" onClick={handleClose}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        {item.price !== null && (
                          <p className="text-primary font-semibold text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-5 text-center">{item.quantity}</span>
                          <button
                            className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive mt-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t space-y-3">
                  {total > 0 && (
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  )}
                  <Button variant="hero" className="w-full" onClick={() => setStep("checkout")}>
                    Proceed to Checkout
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── CHECKOUT STEP ── */}
        {step === "checkout" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {/* Order summary */}
              <div className="bg-muted rounded-lg p-3 space-y-1 mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Order Summary
                </p>
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="truncate pr-2">
                      {i.name} × {i.quantity}
                    </span>
                    {i.price !== null && (
                      <span className="shrink-0">₹{(i.price * i.quantity).toFixed(2)}</span>
                    )}
                  </div>
                ))}
                {total > 0 && (
                  <div className="flex justify-between font-semibold text-sm pt-1 border-t mt-1">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Contact fields */}
              <Input
                placeholder="Full Name *"
                value={form.name}
                onChange={field("name")}
              />
              <Input
                placeholder="Phone Number *"
                value={form.phone}
                onChange={field("phone")}
                type="tel"
              />
              <Input
                placeholder="Email (optional)"
                value={form.email}
                onChange={field("email")}
                type="email"
              />
              <Textarea
                placeholder="Delivery / Shipping Address *"
                rows={3}
                value={form.address}
                onChange={field("address")}
              />
              <Textarea
                placeholder="Additional notes (optional)"
                rows={2}
                value={form.notes}
                onChange={field("notes")}
              />
            </div>

            <div className="px-6 py-4 border-t space-y-2">
              <Button
                variant="hero"
                className="w-full"
                onClick={submitEnquiry}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Enquiry"
                )}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep("cart")}>
                Back to Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
