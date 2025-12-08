import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

export interface SiteSettings {
  id: number;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_badge_text: string | null;
  hero_image_url: string | null;
  hero_years_label: string | null;
  hero_customers_label: string | null;
  hero_flavors_label: string | null;

  about_badge: string | null;
  about_title: string | null;
  about_paragraph1: string | null;
  about_paragraph2: string | null;
  about_image_url: string | null;
  about_highlight_1_title: string | null;
  about_highlight_1_desc: string | null;
  about_highlight_2_title: string | null;
  about_highlight_2_desc: string | null;
  about_highlight_3_title: string | null;
  about_highlight_3_desc: string | null;
  about_highlight_4_title: string | null;
  about_highlight_4_desc: string | null;

  products_title: string | null;
  products_subtitle: string | null;

  cta_title: string | null;
  cta_subtitle: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_badge_text: string | null;

  footer_text: string | null;
  footer_subtext: string | null;
  navbar_logo: string | null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err: any) {
        console.error("Failed to fetch site settings:", err);
        setError(err.message || "Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
