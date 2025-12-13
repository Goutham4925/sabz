import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { API_URL } from "@/config/api";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// --------------------------------------------------
// ICON RENDERER — supports URL icons or Lucide icons
// --------------------------------------------------
const iconMap: any = {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
};

function RenderIcon({ name, className }: { name: string; className?: string }) {
  if (!name) return null;

  // URL image icon
  if (name.startsWith("http")) {
    return <img src={name} className={className} />;
  }

  // Lucide icon
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : null;
}

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [contact, setContact] = useState<any>(null);

  // Load Site Settings
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    load();
  }, []);

  // Load Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  // Load Contact Page (for footer)
  useEffect(() => {
    const loadContact = async () => {
      try {
        const res = await fetch(`${API_URL}/contact-page`);
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error("Failed to load contact page:", err);
      }
    };

    loadContact();
  }, []);

  const logo = settings?.navbar_logo;
  const brandImage = settings?.navbar_brand_image;
  const showText = settings?.show_company_text !== false;

  return (
    <footer className="bg-chocolate text-cream">

      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">

              <div className="relative w-32 h-32 rounded-md overflow-hidden flex items-center justify-center">
                {logo ? (
                  <img src={logo} className="object-contain w-full h-full p-1" />
                ) : (
                  <Cookie className="w-7 h-7 text-primary-foreground" />
                )}
              </div>

              <div className="flex flex-col">
                {brandImage && (
                  <img
                    src={brandImage}
                    className="h-10 w-auto object-contain mb-1"
                    alt="Brand"
                  />
                )}

                {showText && (
                  <>
                    <span className="font-display text-xl font-bold text-cream">
                      Gobbly Treat
                    </span>
                    <span className="text-xs text-cream/60 tracking-widest uppercase">
                      Artisan Biscuits
                    </span>
                  </>
                )}
              </div>
            </Link>

            {/* Footer Text */}
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              {settings?.footer_text ||
                "Crafting premium biscuits with love and tradition since 1980. Every bite tells a story of quality and craftsmanship."
              }
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://instagram.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://twitter.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-cream">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-cream/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products – Dynamic Categories */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-cream">
              Our Products
            </h3>

            {categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="text-cream/70 hover:text-primary transition text-sm"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-cream/50 text-sm">No categories added yet.</p>
            )}
          </div>

          {/* Contact Info */}
          {contact ? (
            <ul className="space-y-4">

              {/* LOCATION: card_1_line1 + card_1_line2 */}
              <li className="flex items-start gap-3">
                <RenderIcon
                  name={contact.card_1_icon}
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                />
                <span className="text-cream/70 text-sm whitespace-pre-line">
                  {contact.card_1_line1}
                  {contact.card_1_line2 && `\n${contact.card_1_line2}`}
                </span>
              </li>

              {/* PHONE: card_2_line1 */}
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${contact.card_2_line1}`}
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  {contact.card_2_line1}
                </a>
              </li>

              {/* EMAIL: card_3_line1 */}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${contact.card_3_line1}`}
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  {contact.card_3_line1}
                </a>
              </li>

            </ul>
          ) : (
            <p className="text-cream/50 text-sm">Loading contact info...</p>
          )}


        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-cream/50 text-sm">
              © {new Date().getFullYear()} Gobbly Treat. All rights reserved.
            </p>

            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-cream/50 hover:text-cream text-sm transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-cream/50 hover:text-cream text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
