import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Award, Heart, Leaf, Clock, Users, Globe, Cookie } from "lucide-react";

const milestones = [
  {
    year: "1980",
    title: "The Beginning",
    description: "Founded as a small family bakery with a passion for quality.",
  },
  {
    year: "1995",
    title: "First Store",
    description: "Opened our first retail store in the heart of the city.",
  },
  {
    year: "2005",
    title: "National Recognition",
    description: "Won our first national baking award for excellence.",
  },
  {
    year: "2015",
    title: "Going International",
    description: "Expanded to international markets across 15 countries.",
  },
  {
    year: "2024",
    title: "Digital Innovation",
    description: "Launched our premium online store and direct delivery.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every biscuit is crafted with passion and care, just like homemade.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description:
      "We use only the finest, sustainably sourced natural ingredients.",
  },
  {
    icon: Award,
    title: "Quality First",
    description:
      "Uncompromising standards ensure every product meets our excellence criteria.",
  },
  {
    icon: Users,
    title: "Family Tradition",
    description:
      "Recipes passed down through generations, preserving authentic flavors.",
  },
];

const team = [
  {
    name: "Margaret Baker",
    role: "Founder & Master Baker",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "James Crust",
    role: "Head of Production",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Golden",
    role: "Quality Director",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-premium mb-4 inline-block animate-fade-up">
                Our Story
              </span>
              <h1 className="section-title mb-6 animate-fade-up stagger-1">
                A Legacy of{" "}
                <span className="text-gradient">Baking Excellence</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 animate-fade-up stagger-2">
                For over four decades, Golden Crust has been more than just a
                biscuit company. We're a family of passionate bakers dedicated
                to bringing joy to every home through our delicious, handcrafted
                creations.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed animate-fade-up stagger-3">
                What started in 1980 as a small family bakery has grown into a
                beloved brand, but our commitment to quality, tradition, and the
                art of baking remains unchanged.
              </p>
            </div>
            <div className="relative animate-fade-up stagger-4">
              <div className="relative rounded-3xl overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=600&h=700&fit=crop"
                  alt="Golden Crust Bakery"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card p-6 shadow-elevated golden-glow">
                <Cookie className="w-8 h-8 text-primary mb-2" />
                <p className="font-display text-lg font-semibold">Est. 1980</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                Our Core <span className="text-gradient">Values</span>
              </h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="glass-card p-8 text-center hover:shadow-elevated transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                Our <span className="text-gradient">Journey</span>
              </h2>
              <p className="section-subtitle">
                From humble beginnings to international recognition
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`flex gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 text-right">
                    {index % 2 === 0 && (
                      <>
                        <span className="font-display text-4xl font-bold text-primary">
                          {milestone.year}
                        </span>
                        <h3 className="font-display text-xl font-semibold mt-2 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                    {index < milestones.length - 1 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <>
                        <span className="font-display text-4xl font-bold text-primary">
                          {milestone.year}
                        </span>
                        <h3 className="font-display text-xl font-semibold mt-2 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="section-title mb-4">
                Meet the <span className="text-gradient">Team</span>
              </h2>
              <p className="section-subtitle">
                The passionate people behind every delicious biscuit
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="group text-center">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-card group-hover:shadow-elevated transition-shadow duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-chocolate text-cream">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-golden mb-2">
                  40+
                </p>
                <p className="text-cream/70">Years of Excellence</p>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-golden mb-2">
                  25+
                </p>
                <p className="text-cream/70">Unique Flavors</p>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-golden mb-2">
                  15
                </p>
                <p className="text-cream/70">Countries Served</p>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl font-bold text-golden mb-2">
                  50K+
                </p>
                <p className="text-cream/70">Happy Customers</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
