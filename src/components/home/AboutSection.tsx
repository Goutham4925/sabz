import { useEffect, useState, useRef } from "react";
import { Award, Heart, Leaf, Clock } from "lucide-react";

const highlights = [
  { icon: Clock, title: "Since 1980", description: "Over 40 years of baking excellence" },
  { icon: Heart, title: "Made with Love", description: "Every biscuit crafted by hand" },
  { icon: Leaf, title: "Natural Ingredients", description: "Only the finest, organic materials" },
  { icon: Award, title: "Award Winning", description: "Recognized for quality worldwide" },
];

export function AboutSection() {
  const [about, setAbout] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ------------------------------
  // FETCH ABOUT TEXT FROM BACKEND
  // ------------------------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings");
        const data = await res.json();

        setAbout(data.about_text || "Our story will be added soon.");
      } catch (err) {
        setAbout("Our story will be added soon.");
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  // ------------------------------
  // ANIMATION TRIGGER
  // ------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) return null;

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>
            <span className="badge-premium mb-4 inline-block">Our Story</span>

            <h2 className="section-title mb-6">
              A Legacy of <span className="text-gradient">Delicious</span> Moments
            </h2>

            {/* DYNAMIC ABOUT TEXT */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 whitespace-pre-wrap">
              {about}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div key={index} className="glass-card p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (IMAGE) */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=700&fit=crop"
                alt="Artisan baking process"
                className="w-full h-[500px] object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-8 glass-card p-6 shadow-elevated">
              <p className="font-display text-4xl font-bold text-primary">40+</p>
              <p className="text-muted-foreground text-sm">Years of Excellence</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
