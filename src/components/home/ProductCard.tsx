import { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FALLBACK_IMAGE = "/placeholder.svg";

interface ProductCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  showPrice?: boolean;
}

export const ProductCard = memo(function ProductCard({
  id,
  name,
  description,
  price,
  image_url,
  showPrice = true,
}: ProductCardProps) {
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find((i) => i.id === id);
  const qty = cartItem?.quantity ?? 0;
  const safeDescription = description?.slice(0, 90) || "";

  const stopProp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAdd = (e: React.MouseEvent) => {
    stopProp(e);
    addToCart({ id, name, price, image_url });
  };

  const handleInc = (e: React.MouseEvent) => {
    stopProp(e);
    updateQuantity(id, qty + 1);
  };

  const handleDec = (e: React.MouseEvent) => {
    stopProp(e);
    if (qty <= 1) removeFromCart(id);
    else updateQuantity(id, qty - 1);
  };

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">

      {/* IMAGE */}
      <Link to={`/products/${id}`} className="block relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={image_url || FALLBACK_IMAGE}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-3 md:p-4 gap-1">
        <Link to={`/products/${id}`} className="block">
          <h3 className="font-semibold text-sm md:text-base text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          {safeDescription && (
            <p className="text-muted-foreground text-xs md:text-sm mt-0.5 line-clamp-2 leading-relaxed">
              {safeDescription}
            </p>
          )}
        </Link>

        {/* PRICE + CART CONTROLS */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {showPrice && price !== null ? (
            <span className="font-bold text-base md:text-lg text-primary">
              ₹{price.toFixed(0)}
            </span>
          ) : (
            <span />
          )}

          {qty === 0 ? (
            /* ── ADD BUTTON ── */
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 min-h-[36px]"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span>Add</span>
            </button>
          ) : (
            /* ── QTY CONTROLS ── */
            <div className="flex items-center gap-1 bg-primary/10 rounded-lg overflow-hidden">
              <button
                onClick={handleDec}
                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/20 active:scale-90 transition-all duration-150"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-bold text-primary tabular-nums">
                {qty}
              </span>
              <button
                onClick={handleInc}
                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/20 active:scale-90 transition-all duration-150"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
