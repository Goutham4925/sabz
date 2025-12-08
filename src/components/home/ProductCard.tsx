import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  showPrice?: boolean;
}

export function ProductCard({ id, name, description, price, imageUrl, showPrice = true }: ProductCardProps) {
  return (
    <div className="group relative product-card">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          {showPrice && (
            <span className="font-display text-2xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          )}
          <Link to={`/products/${id}`} className={!showPrice ? 'w-full' : ''}>
            <Button 
              variant="outline" 
              size="sm" 
              className={`group/btn ${!showPrice ? 'w-full' : ''}`}
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
    </div>
  );
}
