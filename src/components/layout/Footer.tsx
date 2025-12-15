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
  X,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { API_URL } from "@/config/api";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// --------------------------------------------------
// ICON RENDERER
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
  if (name.startsWith("http")) {
    return <img src={name} className={className} />;
  }
  const Icon = iconMap[name];
  return Icon ? <Icon className={className} /> : null;
}

// --------------------------------------------------
// LEGAL MODAL
// --------------------------------------------------
function LegalModal({
  open,
  onClose,
  title,
  html,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  html: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: html || "<p>No content added yet.</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// FOOTER
// --------------------------------------------------
export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [contact, setContact] = useState<any>(null);

  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  // Load Site Settings
  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  // Load Categories
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Load Contact Page
  useEffect(() => {
    fetch(`${API_URL}/contact-page`)
      .then((res) => res.json())
      .then(setContact)
      .catch(console.error);
  }, []);

  const logo = settings?.navbar_logo;
  const brandImage = settings?.navbar_brand_image;
  const showText = settings?.show_company_text !== false;

  return (
    <>
      <footer className="bg-chocolate text-cream">
        {/* Main Footer */}
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-32 h-32 flex items-center justify-center">
                  {logo ? (
                    <img src={logo} className="object-contain w-full h-full" />
                  ) : (
                    <Cookie className="w-7 h-7" />
                  )}
                </div>

                <div>
                  {brandImage && (
                    <img src={brandImage} className="h-10 mb-1" />
                  )}

                  {showText && (
                    <>
                      <span className="font-bold text-xl">Gobbly Treat</span>
                      <div className="text-xs opacity-60 uppercase">
                        Artisan Biscuits
                      </div>
                    </>
                  )}
                </div>
              </Link>

              <p className="text-sm opacity-70 mb-6">
                {settings?.footer_text ||
                  "Crafting premium biscuits with love and tradition since 1980."}
              </p>

              <div className="flex gap-4">
                {settings?.social_facebook && (
                  <a href={settings.social_facebook} target="_blank">
                    <SiFacebook />
                  </a>
                )}
                {settings?.social_instagram && (
                  <a href={settings.social_instagram} target="_blank">
                    <SiInstagram />
                  </a>
                )}
                {settings?.social_twitter && (
                  <a href={settings.social_twitter} target="_blank">
                    <SiX />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="opacity-70 hover:opacity-100">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Our Products</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/products?categoryId=${cat.id}`}
                      className="opacity-70 hover:opacity-100"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            {contact && (
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <RenderIcon name={contact.card_1_icon} />
                  <span>{contact.card_1_line1}</span>
                </li>
                <li className="flex gap-2">
                  <Phone />
                  <a href={`tel:${contact.card_2_line1}`}>
                    {contact.card_2_line1}
                  </a>
                </li>
                <li className="flex gap-2">
                  <Mail />
                  <a href={`mailto:${contact.card_3_line1}`}>
                    {contact.card_3_line1}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between gap-4">
            <p className="text-sm opacity-50">
              © {new Date().getFullYear()} Gobbly Treat. All rights reserved.
            </p>

            <div className="flex gap-6">
              <button
                onClick={() => setOpenPrivacy(true)}
                className="text-sm opacity-50 hover:opacity-100"
              >
                Privacy Policy
              </button>

              <button
                onClick={() => setOpenTerms(true)}
                className="text-sm opacity-50 hover:opacity-100"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LegalModal
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        title="Privacy Policy"
        html={settings?.privacy_policy}
      />

      <LegalModal
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        title="Terms & Conditions"
        html={settings?.terms_conditions}
      />
    </>
  );
}
