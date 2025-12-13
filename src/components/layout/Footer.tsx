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

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

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

            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Crafting premium biscuits with love and tradition since 1980.
              Every bite tells a story of quality and craftsmanship.
            </p>

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
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-cream">
              Contact Us
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-cream/70 text-sm">
                  123 Baker Street, Biscuit Town, BT 12345
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  +1 (234) 567-890
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:hello@gobblytreat.com"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  hello@gobblytreat.com
                </a>
              </li>
            </ul>
          </div>

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
