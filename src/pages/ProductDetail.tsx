import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

const products = [
  {
    id: '1',
    name: 'Golden Butter Classics',
    description: 'Rich, buttery biscuits made with pure creamery butter and a hint of vanilla. A timeless favorite that has been loved by generations.',
    longDescription: 'Our Golden Butter Classics are the cornerstone of our biscuit collection. Each biscuit is crafted using a recipe that dates back to 1980, using only the finest creamery butter sourced from local farms. The delicate balance of butter, flour, and a secret blend of vanilla creates a melt-in-your-mouth experience that has made these biscuits a household favorite for over four decades.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop',
    ingredients: ['Premium Butter', 'Wheat Flour', 'Pure Cane Sugar', 'Vanilla Extract', 'Sea Salt'],
    nutritionFacts: { calories: 120, fat: '6g', carbs: '15g', protein: '2g' },
    rating: 4.9,
    reviews: 328,
  },
  {
    id: '2',
    name: 'Chocolate Indulgence',
    description: 'Decadent chocolate biscuits with Belgian chocolate chips in every bite. Pure chocolate bliss.',
    longDescription: 'For the chocolate lovers, our Chocolate Indulgence biscuits are a dream come true. Made with premium Dutch cocoa and studded with generous Belgian chocolate chips, each bite delivers an intense chocolate experience. The perfect balance of sweetness and rich cocoa flavor makes these biscuits irresistible.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop',
    ingredients: ['Dutch Cocoa', 'Belgian Chocolate Chips', 'Premium Butter', 'Wheat Flour', 'Brown Sugar'],
    nutritionFacts: { calories: 140, fat: '7g', carbs: '18g', protein: '2g' },
    rating: 4.8,
    reviews: 256,
  },
  {
    id: '3',
    name: 'Oat & Honey Delight',
    description: 'Wholesome oat biscuits sweetened with pure organic honey. Perfect with tea or coffee.',
    longDescription: 'A healthier option that doesnt compromise on taste. Our Oat & Honey Delight biscuits combine wholesome rolled oats with pure organic honey, creating a naturally sweet and satisfying treat. Perfect for those who want to enjoy a biscuit without the guilt.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&h=800&fit=crop',
    ingredients: ['Rolled Oats', 'Organic Honey', 'Whole Wheat Flour', 'Coconut Oil', 'Cinnamon'],
    nutritionFacts: { calories: 100, fat: '4g', carbs: '16g', protein: '3g' },
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '4',
    name: 'Almond Crescents',
    description: 'Delicate crescent-shaped biscuits with roasted almonds and powdered sugar.',
    longDescription: 'Inspired by European tradition, our Almond Crescents are a delicate masterpiece. Each crescent is made with finely ground roasted almonds and finished with a light dusting of powdered sugar. The result is a tender, melt-in-your-mouth biscuit with a subtle nutty flavor.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&h=800&fit=crop',
    ingredients: ['Roasted Almonds', 'Premium Butter', 'Powdered Sugar', 'Wheat Flour', 'Almond Extract'],
    nutritionFacts: { calories: 130, fat: '8g', carbs: '12g', protein: '3g' },
    rating: 4.9,
    reviews: 412,
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl" />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-golden text-golden' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {product.longDescription}
              </p>

              <div className="font-display text-4xl font-bold text-primary mb-8">
                ${product.price.toFixed(2)}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button variant="hero" size="xl" className="flex-1">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="xl">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
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
              <div className="py-8 border-t border-border">
                <h3 className="font-display text-xl font-semibold mb-4">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition Facts */}
              <div className="py-8 border-t border-border">
                <h3 className="font-display text-xl font-semibold mb-4">Nutrition Facts (per serving)</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-xl">
                    <p className="font-display text-2xl font-bold text-primary">
                      {product.nutritionFacts.calories}
                    </p>
                    <p className="text-sm text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-xl">
                    <p className="font-display text-2xl font-bold text-primary">
                      {product.nutritionFacts.fat}
                    </p>
                    <p className="text-sm text-muted-foreground">Fat</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-xl">
                    <p className="font-display text-2xl font-bold text-primary">
                      {product.nutritionFacts.carbs}
                    </p>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-xl">
                    <p className="font-display text-2xl font-bold text-primary">
                      {product.nutritionFacts.protein}
                    </p>
                    <p className="text-sm text-muted-foreground">Protein</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
