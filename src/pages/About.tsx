import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Award, Heart, Leaf, Users, Cookie } from "lucide-react";

const API = "http://localhost:5000/api/about";

const iconMap: any = {
  Heart,
  Leaf,
  Award,
  Users
};

const About = () => {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API + "?v=" + Date.now(), { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setAbout(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !about) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">

        {/* HERO SECTION */}
        <section className="container mx-auto px-4 md:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <span className="badge-premium mb-4 inline-block animate-fade-up">
                {about.hero_badge || "Our Story"}
              </span>

              <h1 className="section-title mb-6 animate-fade-up stagger-1">
                {about.hero_title || (
                  <>A Legacy of <span className="text-gradient">Baking Excellence</span></>
                )}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {about.hero_paragraph1}
              </p>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {about.hero_paragraph2}
              </p>
            </div>

            {/* RIGHT HERO IMAGE */}
            <div className="relative animate-fade-up stagger-4">
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src={about.hero_image_url}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 glass-card p-6 shadow-elevated golden-glow">
                <Cookie className="w-8 h-8 text-primary mb-2" />
                <p className="font-display text-lg font-semibold">
                  Est. {about.stat_years || "1980"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                Our Core <span className="text-gradient">Values</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              {[1, 2, 3, 4].map((i) => {
                const iconValue = about[`value_${i}_icon`];

                const isImage = iconValue && iconValue.startsWith("http");
                const Icon = iconMap[iconValue] || Heart;

                return (
                  <div key={i} className="glass-card p-8 text-center">

                    {/* ICON OR UPLOADED IMAGE */}
                    {isImage ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6">
                        <img
                          src={iconValue}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    )}

                    <h3 className="font-display text-xl font-semibold mb-3">
                      {about[`value_${i}_title`]}
                    </h3>

                    <p className="text-muted-foreground">
                      {about[`value_${i}_desc`]}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">

            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                {about.timeline_heading || "Our Journey"}
              </h2>
              <p className="section-subtitle">
                {about.timeline_subheading || "How our story evolved through the years"}
              </p>
            </div>

            {[1,2,3,4,5].map((i, index) => (
              <div
                key={i}
                className={`flex gap-8 mb-12 last:mb-0 ${
                  index % 2 ? "flex-row-reverse" : "flex-row"
                }`}
              >

                <div className="flex-1 text-right">
                  {index % 2 === 0 && (
                    <>
                      <span className="font-display text-4xl font-bold text-primary">
                        {about[`milestone_${i}_year`]}
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2">
                        {about[`milestone_${i}_title`]}
                      </h3>
                      <p className="text-muted-foreground">
                        {about[`milestone_${i}_desc`]}
                      </p>
                    </>
                  )}
                </div>

                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full" />
                </div>

                <div className="flex-1">
                  {index % 2 !== 0 && (
                    <>
                      <span className="font-display text-4xl font-bold text-primary">
                        {about[`milestone_${i}_year`]}
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2">
                        {about[`milestone_${i}_title`]}
                      </h3>
                      <p className="text-muted-foreground">
                        {about[`milestone_${i}_desc`]}
                      </p>
                    </>
                  )}
                </div>

              </div>
            ))}

          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8 text-center">

            <h2 className="section-title mb-4">Meet the Team</h2>
            <p className="section-subtitle mb-16">Behind every biscuit</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">

              {[1,2,3].map((i) => (
                <div key={i} className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-card">
                    <img
                      src={about[`team_${i}_image`]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-display text-xl font-semibold">
                    {about[`team_${i}_name`]}
                  </h3>

                  <p className="text-primary font-medium">
                    {about[`team_${i}_role`]}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-24 bg-chocolate text-cream">
          <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <p className="font-display text-5xl font-bold text-golden">
                {about.stat_years}
              </p>
              <p>Years of Excellence</p>
            </div>

            <div>
              <p className="font-display text-5xl font-bold text-golden">
                {about.stat_flavors}
              </p>
              <p>Unique Flavors</p>
            </div>

            <div>
              <p className="font-display text-5xl font-bold text-golden">
                {about.stat_countries}
              </p>
              <p>Countries Served</p>
            </div>

            <div>
              <p className="font-display text-5xl font-bold text-golden">
                {about.stat_customers}
              </p>
              <p>Happy Customers</p>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
