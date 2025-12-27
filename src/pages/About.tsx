import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Award, Heart, Leaf, Users, Cookie } from "lucide-react";
import { API_URL } from "@/config/api";

const iconMap: any = {
  Heart,
  Leaf,
  Award,
  Users,
};

const About = () => {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/about`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setAbout(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* =====================================================
         MAIN — HEIGHT IS ALWAYS RESERVED (NO LAYOUT SHIFT)
      ===================================================== */}
      <main className="pt-32 pb-24">

        {/* ================= HERO ================= */}
        <section className="container mx-auto px-4 md:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <span className="badge-premium mb-4 inline-block">
                {loading ? (
                  <div className="h-6 w-32 bg-muted/40 rounded animate-pulse" />
                ) : (
                  about.hero_badge || "Our Story"
                )}
              </span>

              <h1 className="section-title mb-6">
                {loading ? (
                  <div className="h-12 w-3/4 bg-muted/40 rounded animate-pulse" />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        about.hero_title ||
                        `A Legacy of <span class='text-gradient'>Baking Excellence</span>`,
                    }}
                  />
                )}
              </h1>

              <p className="text-muted-foreground text-lg mb-6">
                {loading ? (
                  <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                ) : (
                  about.hero_paragraph1
                )}
              </p>

              <p className="text-muted-foreground text-lg">
                {loading ? (
                  <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
                ) : (
                  about.hero_paragraph2
                )}
              </p>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                {loading ? (
                  <div className="w-full h-[280px] sm:h-[380px] lg:h-[500px] bg-muted/40 animate-pulse" />
                ) : (
                  about.hero_image_url && (
                    <img
                      src={about.hero_image_url}
                      className="w-full h-[280px] sm:h-[380px] lg:h-[500px] object-cover"
                      alt="About hero"
                    />
                  )
                )}
              </div>

              {!loading && (
                <div className="absolute -bottom-6 -left-6 glass-card p-6 shadow-elevated golden-glow">
                  <Cookie className="w-8 h-8 text-primary mb-2" />
                  <p className="font-display text-lg font-semibold">
                    {(() => {
                      const establishedYear = Number(about?.stat_years) || 1980;
                      const currentYear = new Date().getFullYear();
                      return `Est. ${currentYear - establishedYear}+ years`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= VALUES ================= */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                Our Core <span className="text-gradient">Values</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => {
                const iconVal = about?.[`value_${i}_icon`] ?? "";
                const isImage = iconVal.startsWith("http");
                const Icon = iconMap[iconVal] || Heart;

                return (
                  <div key={i} className="glass-card p-8 text-center">
                    {loading ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-6 bg-muted/40 rounded-2xl animate-pulse" />
                        <div className="h-4 w-3/4 mx-auto bg-muted/30 rounded mb-3 animate-pulse" />
                        <div className="h-3 w-full bg-muted/20 rounded animate-pulse" />
                      </>
                    ) : (
                      <>
                        {isImage ? (
                          <img
                            src={iconVal}
                            className="w-16 h-16 rounded-2xl mx-auto mb-6 object-cover"
                            alt=""
                          />
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
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= TIMELINE ================= */}
        {!loading && !about.timeline_hidden && about.timeline?.length > 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2
                  className="section-title mb-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      about.timeline_heading ||
                      "Our <span class='text-gradient'>Journey</span>",
                  }}
                />
                <p className="section-subtitle">
                  {about.timeline_subheading || "From humble beginnings to today"}
                </p>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2" />

                {about.timeline.map((item: any) => (
                  <div key={item.id} className="flex flex-col md:flex-row items-start mb-16">
                    <div className="md:w-1/2 md:px-6 text-left md:text-right">
                      <span className="font-display text-4xl font-bold text-primary block">
                        {item.year}
                      </span>
                      <h3 className="font-display text-xl font-semibold mt-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>

                    <div className="hidden md:flex items-center justify-center w-12">
                      <div className="w-4 h-4 bg-primary rounded-full" />
                    </div>

                    <div className="hidden md:block md:w-1/2 px-6" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================= TEAM ================= */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="section-title mb-4">
              {loading ? "Meet the Team" : about.team_heading || "Meet the Team"}
            </h2>

            <p className="section-subtitle mb-16">
              {loading
                ? "The people behind every product"
                : about.team_subheading || "The people behind every product"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-card bg-muted/40">
                    {!loading && about[`team_${i}_image`] && (
                      <img
                        src={about[`team_${i}_image`]}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    )}
                  </div>

                  {!loading && (
                    <>
                      <h3 className="font-display text-xl font-semibold">
                        {about[`team_${i}_name`]}
                      </h3>
                      <p className="text-primary font-medium">
                        {about[`team_${i}_role`]}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="py-24 bg-chocolate text-cream">
          <div className="container mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["Years", about?.stat_years],
              ["Flavors", about?.stat_flavors],
              ["Countries", about?.stat_countries],
              ["Customers", about?.stat_customers],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="font-display text-5xl font-bold text-golden">
                  {loading ? "—" : value}
                </p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;
