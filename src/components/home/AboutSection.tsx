import { useEffect, useState, useRef } from "react";
import { Award, Heart, Leaf, Clock } from "lucide-react";
import { API_URL } from "@/config/api";
import DOMPurify from "dompurify";

export function AboutSection() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Load settings
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const json = await res.json();
        setSettings(json);
      } catch (e) {
        console.error("About load error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* skeleton while loading */
  if (loading) {
    return (
      <section ref={sectionRef} className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-[550px] bg-muted/20 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!settings) return null;

  const highlights = [
    {
      icon: Clock,
      title: settings.about_highlight_1_title,
      description: settings.about_highlight_1_desc,
    },
    {
      icon: Heart,
      title: settings.about_highlight_2_title,
      description: settings.about_highlight_2_desc,
    },
    {
      icon: Leaf,
      title: settings.about_highlight_3_title,
      description: settings.about_highlight_3_desc,
    },
    {
      icon: Award,
      title: settings.about_highlight_4_title,
      description: settings.about_highlight_4_desc,
    },
  ];

  // Sanitize helper (allow only simple span with class)
  const sanitize = (html: string | null) => {
    if (!html) return "";
    // Default DOMPurify is fine; we can restrict allowed tags/classes further if needed.
    // Allow only <span> (and its class attribute) plus basic text
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["span", "strong", "em", "b", "i"],
      ALLOWED_ATTR: ["class", "style"], // style allowed if you expect inline style (optional)
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`py-24 bg-secondary/30 relative overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT SIDE */}
          <div>
            <span className="badge-premium mb-4 inline-block">
              {settings.about_badge || "Our Story"}
            </span>

            {/* Render title as HTML (sanitized) */}
            <h2
              className="section-title mb-6"
              // if there is HTML content in settings.about_title we render it safely
              dangerouslySetInnerHTML={{
                __html: sanitize(settings.about_title) || "A Legacy of Delicious Moments",
              }}
            />

            <p className="text-muted-foreground text-lg leading-relaxed mb-4 whitespace-pre-wrap">
              {settings.about_paragraph1}
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 whitespace-pre-wrap">
              {settings.about_paragraph2}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) =>
                item.title ? (
                  <div key={index} className="glass-card p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-golden to-accent rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      {/* highlight title might also contain <span>; render sanitized HTML */}
                      <h4
                        className="font-display font-semibold"
                        dangerouslySetInnerHTML={{ __html: sanitize(item.title) }}
                      />
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={settings.about_image_url || "/placeholder-about.jpg"}
                alt="About"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* PRELOAD */
AboutSection.preload = async () => {
  try {
    const res = await fetch(`${API_URL}/settings`);
    return await res.json();
  } catch {
    return null;
  }
};
