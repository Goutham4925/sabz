import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  showPrice?: boolean;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image_url,
  showPrice = true,
}: ProductCardProps) {
  return (
    <Link to={`/products/${id}`} className="block">
      {/* GROUP WRAPPER FOR ANIMATIONS */}
      <div className="group relative product-card cursor-pointer">

        {/* IMAGE */}
        <div className="relative aspect-square overflow-hidden bg-cream">
          <img
            src={image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description || "No description available"}
          </p>

          <div className="flex items-center justify-between">
            {showPrice && price !== null && (
              <span className="font-display text-2xl font-bold text-golden">
                ₹{price.toFixed(2)}
              </span>
            )}

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary" />
          </div>
        </div>

        {/* Glow Hover Effect */}
        <div className=" text-transparent bg-clip-text bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
      </div>
    </Link>
  );
}
