"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
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

const normalizeUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

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
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X />
        </button>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html || "<p>No content added yet.</p>" }} />
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [contact, setContact] = useState<any>(null);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/settings`).then((r) => r.json()).then(setSettings).catch(() => {});
    fetch(`${API_URL}/categories`).then((r) => r.json()).then((d) => Array.isArray(d) && setCategories(d)).catch(() => {});
    fetch(`${API_URL}/contact-page`).then((r) => r.json()).then(setContact).catch(() => {});
  }, []);

  const logo = settings?.navbar_logo;
  const brandImage = settings?.navbar_brand_image;
  const showText = settings?.show_company_text !== false;

  return (
    <>
      <footer className="bg-chocolate text-cream">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* BRAND */}
            <div>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-full h-32 flex items-center justify-center">
                  {logo ? (
                    <img src={logo} className="object-contain w-full h-full" />
                  ) : (
                    <img src="https://res.cloudinary.com/dglumbcje/image/upload/v1766763015/saabz_kitchen/0769bd28-050c-4886-a8f6-d3714a683ce2.png" className="object-contain w-full h-full" />
                  )}
                </div>
                <div>
                  {brandImage && <img src={brandImage} className="h-10 mb-1" />}
                  {showText && (
                    <>
                      <span className="font-bold text-xl">Saabz Kitchen</span>
                      <div className="text-xs opacity-60 uppercase">Kitchen needs</div>
                    </>
                  )}
                </div>
              </Link>

              <p className="text-sm opacity-70 mb-6">{settings?.footer_text}</p>

              <div className="flex gap-4">
                {settings?.social_facebook && (
                  <a href={normalizeUrl(settings.social_facebook)} target="_blank" rel="noopener noreferrer">
                    <SiFacebook />
                  </a>
                )}
                {settings?.social_instagram && (
                  <a href={normalizeUrl(settings.social_instagram)} target="_blank" rel="noopener noreferrer">
                    <SiInstagram />
                  </a>
                )}
                {settings?.social_twitter && (
                  <a href={normalizeUrl(settings.social_twitter)} target="_blank" rel="noopener noreferrer">
                    <SiX />
                  </a>
                )}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path} className="opacity-70 hover:opacity-100">{l.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CATEGORIES */}
            <div>
              <h3 className="font-semibold mb-4">Our Products</h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/products?categoryId=${cat.id}`} className="opacity-70 hover:opacity-100">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <ul className="space-y-3">
              {settings?.footer_subtext && (
                <li className="flex gap-2 items-start">
                  <MapPin className="mt-1" />
                  <span dangerouslySetInnerHTML={{ __html: settings.footer_subtext }} />
                </li>
              )}
              {contact?.card_2_line1 && (
                <li className="flex gap-2">
                  <Phone />
                  <a href={`tel:${contact.card_2_line1}`}>{contact.card_2_line1}</a>
                </li>
              )}
              {contact?.card_3_line1 && (
                <li className="flex gap-2">
                  <Mail />
                  <a href={`mailto:${contact.card_3_line1}`}>{contact.card_3_line1}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6">
          <div className="container mx-auto flex flex-col md:flex-row justify-between gap-4">
            <p className="text-sm opacity-50">© {new Date().getFullYear()} Saabz Kitchen. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => setOpenPrivacy(true)} className="text-sm opacity-50 hover:opacity-100">Privacy Policy</button>
              <button onClick={() => setOpenTerms(true)} className="text-sm opacity-50 hover:opacity-100">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal open={openPrivacy} onClose={() => setOpenPrivacy(false)} title="Privacy Policy" html={settings?.privacy_policy} />
      <LegalModal open={openTerms} onClose={() => setOpenTerms(false)} title="Terms & Conditions" html={settings?.terms_conditions} />
    </>
  );
}
