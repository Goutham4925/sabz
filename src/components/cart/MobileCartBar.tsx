import { useCart } from "@/context/CartContext";
import { ShoppingCart, ArrowRight } from "lucide-react";

export function MobileCartBar() {
  const { itemCount, total, openCart } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[150] px-4 pb-4 pt-2 bg-gradient-to-t from-background/95 to-transparent pointer-events-none">
      <button
        onClick={openCart}
        className="pointer-events-auto w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-xl active:scale-[0.98] transition-transform duration-150"
      >
        {/* LEFT — item count badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          </div>
          <span className="font-semibold text-sm">
            {itemCount} item{itemCount !== 1 ? "s" : ""} added
          </span>
        </div>

        {/* RIGHT — total + arrow */}
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="font-bold text-sm">₹{total.toFixed(0)}</span>
          )}
          <span className="font-semibold text-sm">Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
}
