import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/home/ProductCard';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, LayoutGrid } from 'lucide-react';

const allProducts = [
  {
    id: '1',
    name: 'Golden Butter Classics',
    description: 'Rich, buttery biscuits made with pure creamery butter and a hint of vanilla. A timeless favorite.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
    category: 'classic',
  },
  {
    id: '2',
    name: 'Chocolate Indulgence',
    description: 'Decadent chocolate biscuits with Belgian chocolate chips in every bite. Pure chocolate bliss.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop',
    category: 'premium',
  },
  {
    id: '3',
    name: 'Oat & Honey Delight',
    description: 'Wholesome oat biscuits sweetened with pure organic honey. Perfect with tea or coffee.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=600&fit=crop',
    category: 'healthy',
  },
  {
    id: '4',
    name: 'Almond Crescents',
    description: 'Delicate crescent-shaped biscuits with roasted almonds and powdered sugar. Melt-in-your-mouth texture.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=600&h=600&fit=crop',
    category: 'premium',
  },
  {
    id: '5',
    name: 'Ginger Snap',
    description: 'Traditional ginger biscuits with a perfect snap and warming spice. Holiday favorite.',
    price: 10.99,
    imageUrl: 'https://images.unsplash.com/photo-1607114910421-980d11e0c8d5?w=600&h=600&fit=crop',
    category: 'classic',
  },
  {
    id: '6',
    name: 'Shortbread Collection',
    description: 'Classic Scottish shortbread made with the finest butter. Crumbly and delicious.',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1609803384069-a75bc23bbb67?w=600&h=600&fit=crop',
    category: 'classic',
  },
  {
    id: '7',
    name: 'Coconut Macaroons',
    description: 'Chewy coconut macaroons dipped in dark chocolate. A tropical treat.',
    price: 14.49,
    imageUrl: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&h=600&fit=crop',
    category: 'premium',
  },
  {
    id: '8',
    name: 'Digestive Biscuits',
    description: 'Classic digestive biscuits made with wholemeal flour. Perfect for dunking.',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&h=600&fit=crop',
    category: 'healthy',
  },
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'classic', name: 'Classic' },
  { id: 'premium', name: 'Premium' },
  { id: 'healthy', name: 'Healthy' },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showPrices, setShowPrices] = useState(true);

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block animate-fade-up">
              Our Collection
            </span>
            <h1 className="section-title mb-4 animate-fade-up stagger-1">
              Premium <span className="text-gradient">Biscuits</span>
            </h1>
            <p className="section-subtitle animate-fade-up stagger-2">
              Explore our complete range of handcrafted artisan biscuits, 
              each made with care and the finest ingredients.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* View Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrices}
                  onChange={(e) => setShowPrices(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                Show Prices
              </label>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} showPrice={showPrices} />
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
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
