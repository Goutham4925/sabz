import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Award, Heart, Leaf, Users, History } from "lucide-react";
import { API_URL } from "@/config/api";

const iconMap: any = {
  Heart,
  Leaf,
  Award,
  Users,
};

const About = () => {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/about`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setAbout)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">

      {/* MAIN CONTENT — height always reserved */}
      <main className="flex-1 pt-32 pb-0 min-h-[calc(100vh-8rem)]">

        {/* ================= HERO ================= */}
        <section className="container mx-auto px-4 md:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[520px]">

            {/* LEFT */}
            <div className="max-w-xl">
              <span className="badge-premium mb-4 inline-block">
                {about?.hero_badge || "Our Story"}
              </span>

              <h1
                className="section-title mb-6"
                dangerouslySetInnerHTML={{
                  __html:
                    about?.hero_title ||
                    "A Legacy of <span class='text-gradient'>Spice Excellence</span>",
                }}
              />

              <p className="text-muted-foreground text-lg mb-6">
                {about?.hero_paragraph1 || "For over four decades, Kerala Spice Co. has been more than just a masala company. We're a family of passionate spice experts dedicated to bringing the authentic flavors of Kerala to every home through our carefully crafted blends."}
              </p>

              <p className="text-muted-foreground text-lg">
                {about?.hero_paragraph2 || "What started in 1985 as a small spice shop in Kochi has grown into a beloved brand, but our commitment to quality, tradition, and the art of spice blending remains unchanged."}
              </p>
            </div>

            {/* RIGHT — FIXED HEIGHT IMAGE */}
            <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[500px] rounded-3xl overflow-hidden shadow-elevated bg-muted">
              {about?.hero_image_url && (
                <img
                  src={about.hero_image_url}
                  alt="About hero"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              )}

              {/* ESTABLISHED BADGE */}
              <div className="absolute bottom-4 left-4 glass-card p-4 shadow-elevated">
                <History className="w-6 h-6 text-primary mb-1" />
                <p className="font-display text-sm font-semibold">
                  Est. {new Date().getFullYear() - Number(about?.stat_years || 1980)}
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ================= VALUES ================= */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="section-title text-center mb-16">
              Our Core <span className="text-gradient">Values</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => {
                const Icon = iconMap[about?.[`value_${i}_icon`]] || Heart;

                return (
                  <div key={i} className="glass-card p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    <h3 className="font-display text-xl font-semibold mb-3">
                      {about?.[`value_${i}_title`]}
                    </h3>

                    <p className="text-muted-foreground">
                      {about?.[`value_${i}_desc`]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= JOURNEY ================= */}
        {!about?.timeline_hidden && about?.timeline?.length > 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
              <h2
                className="section-title text-center mb-16"
                dangerouslySetInnerHTML={{
                  __html:
                    about.timeline_heading ||
                    "Our <span class='text-gradient'>Journey</span>",
                }}
              />

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2" />

                {about.timeline.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-start mb-16"
                  >
                    <div className="md:w-1/2 md:px-6 md:text-right">
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
        {about?.teamMembers?.length > 0 && (
          <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <h2
                className="section-title mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    about?.team_heading ||
                    "Meet <span class='text-gradient'>Our Team</span>",
                }}
              />

              <p className="section-subtitle mb-16">
                {about?.team_subheading}
              </p>

              {/* DYNAMIC GRID */}
              <div
                className={`
                  grid gap-8 mx-auto
                  ${about.teamMembers.length === 1 ? "grid-cols-1 max-w-sm" : ""}
                  ${about.teamMembers.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-2xl" : ""}
                  ${about.teamMembers.length >= 3 ? "grid-cols-1 md:grid-cols-3 max-w-4xl" : ""}
                `}
              >
                {about.teamMembers.map((member: any) => (
                  <div key={member.id} className="text-center">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-card">
                      {member.image && (
                        <img
                          src={member.image}
                          className="w-full h-full object-cover"
                          alt={member.name}
                        />
                      )}
                    </div>

                    <h3 className="font-display text-xl font-semibold">
                      {member.name}
                    </h3>

                    <p className="text-primary font-medium">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* ================= STATS ================= */}
        <section className="py-24 bg-chocolate text-cream">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["Years", about?.stat_years],
              ["Flavors", about?.stat_flavors],
              ["Countries", about?.stat_countries],
              ["Customers", about?.stat_customers],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="font-display text-5xl font-bold text-golden">
                  {value}
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
