import { useEffect, useState, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const featuredProducts = [
  {
    id: '1',
    name: 'Golden Butter Classics',
    description: 'Rich, buttery biscuits made with pure creamery butter and a hint of vanilla.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
  },
  {
    id: '2',
    name: 'Chocolate Indulgence',
    description: 'Decadent chocolate biscuits with Belgian chocolate chips in every bite.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Oat & Honey Delight',
    description: 'Wholesome oat biscuits sweetened with pure organic honey.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=600&fit=crop',
  },
  {
    id: '4',
    name: 'Almond Crescents',
    description: 'Delicate crescent-shaped biscuits with roasted almonds and powdered sugar.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=600&h=600&fit=crop',
  },
];

export function ProductsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className={`badge-premium mb-4 inline-block transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Our Collection
          </span>
          <h2
            className={`section-title mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Premium <span className="text-gradient">Biscuits</span>
          </h2>
          <p
            className={`section-subtitle transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            Discover our handcrafted selection of artisan biscuits, each one a testament to 
            our commitment to quality and tradition.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <Link to="/products">
            <Button variant="default" size="lg" className="group">
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
