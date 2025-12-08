import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000/api/contact-page";
const MESSAGE_API = "http://localhost:5000/api/messages";

const iconMap: any = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

const Contact = () => {
  const { toast } = useToast();

  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => {
        setPage(d);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const r = await fetch(MESSAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!r.ok) throw new Error("Failed to send");

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Message could not be sent.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: any) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (loading || !page) return null;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="badge-premium mb-4 inline-block animate-fade-up">
              {page.hero_badge}
            </span>

            <h1 className="section-title mb-4 animate-fade-up stagger-1">
              {page.hero_title}
            </h1>

            <p className="section-subtitle animate-fade-up stagger-2">
              {page.hero_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* CONTACT FORM */}
            <div className="glass-card p-8 md:p-10 animate-fade-up stagger-3">
              <h2 className="font-display text-2xl font-semibold mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : <>
                    Send Message <Send className="w-5 h-5 ml-2" />
                  </>}
                </Button>

              </form>

            </div>

            {/* CONTACT CARDS */}
            <div className="animate-fade-up stagger-4">
              <h2 className="font-display text-2xl font-semibold mb-8">Contact Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                
                {[1, 2, 3, 4].map((i) => {
                  const Icon = iconMap[page[`card_${i}_icon`]] ?? MapPin;

                  return (
                    <div key={i} className="glass-card p-6 hover:shadow-elevated">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>

                      <h3 className="font-display font-semibold mb-2">
                        {page[`card_${i}_title`]}
                      </h3>

                      <p className="text-muted-foreground text-sm">
                        {page[`card_${i}_line1`]}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {page[`card_${i}_line2`]}
                      </p>
                    </div>
                  );
                })}

              </div>

              {/* MAP */}
              <div className="rounded-2xl overflow-hidden shadow-card h-64 bg-secondary">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="font-medium">{page.map_title}</p>
                    <p className="text-sm">{page.map_address}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* FAQ */}
          <section className="mt-24">
            <h2 className="section-title text-center mb-12">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-6">
                  <h3 className="font-display font-semibold mb-2">
                    {page[`faq_${i}_q`]}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {page[`faq_${i}_a`]}
                  </p>
                </div>
              ))}

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
