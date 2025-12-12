import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_URL } from "@/config/api";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const location = useLocation();

  // Load site settings
  useEffect(() => {
    const load = async () => {
      const r = await fetch(`${API_URL}/settings`);
      setSettings(await r.json());
    };
    load();
  }, []);

  // Scrolled state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsMobileMenuOpen(false), [location]);

  if (!settings) return null;

  const showText = settings.show_company_text !== false;
  const logo = settings.navbar_logo;
  const brandImage = settings.navbar_brand_image;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">

          {/* LOGO + BRAND */}
          <Link to="/" className="flex items-center gap-3 md:gap-4">
            <div
              className="
                relative 
                h-14 w-24
                sm:h-16 sm:w-28
                md:h-20 md:w-32
                lg:h-24 lg:w-40
                overflow-hidden 
                flex items-end justify-center
              "
            >
              {logo ? (
                <img src={logo} className="object-contain w-full h-full" alt="Logo" />
              ) : (
                <Cookie className="w-8 h-8 text-primary" />
              )}
            </div>

            <div className="flex flex-col justify-center">
              {brandImage && (
                <img
                  src={brandImage}
                  className="h-10 w-auto sm:h-12 md:h-14 object-contain"
                  alt="Brand"
                />
              )}

              {showText && (
                <div className="leading-tight">
                  <span className="font-display text-lg md:text-xl font-bold text-foreground">
                    Gobbly Treat
                  </span>
                  <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">
                    Artisan Biscuits
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={cn(
                  "font-medium text-sm tracking-wide uppercase",
                  location.pathname === l.path && "text-golden"
                )}
              >
                {l.name}
              </Link>
            ))}

            {/* 🚀 FIX: Order Now Button with Link */}
            <Link to="/products">
              <Button
                className="bg-gradient-to-r from-golden to-accent text-chocolate px-4 py-2 font-semibold hover:opacity-90 transition"
                variant="default"
                size="sm"
              >
                Order Now
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* MOBILE NAVIGATION */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500 bg-background/75 backdrop-blur-md shadow-lg px-4",
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col gap-4 pb-6">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={cn(
                  "font-medium text-base py-2 border-b border-border",
                  location.pathname === l.path
                    ? "text-primary border-primary"
                    : "text-foreground/80"
                )}
              >
                {l.name}
              </Link>
            ))}

            {/* 🚀 FIX: Order Now Button in Mobile Menu */}
            <Link to="/products">
              <Button className="mt-4 w-full">Order Now</Button>
            </Link>
          </div>
        </div>

      </div>
    </header>
  );
}
