import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


// FULL CORRECT SCHEMA INTERFACE
interface SiteSettings {
  id: number;

  // HERO
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_badge_text: string | null;
  hero_image_url: string | null;
  hero_years_label: string | null;
  hero_customers_label: string | null;
  hero_flavors_label: string | null;

  // ABOUT
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

  // PRODUCTS
  products_title: string | null;
  products_subtitle: string | null;

  // CTA
  cta_title: string | null;
  cta_subtitle: string | null;
  cta_image_url: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_badge_text: string | null;

  // FOOTER
  footer_text: string | null;
  footer_subtext: string | null;
  navbar_logo: string | null;
}

const API_URL = "http://localhost:5000/api";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // LOAD SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch settings",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, [toast]);

  // SAVE SETTINGS
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/settings/${settings.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Save failed");

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-3xl">

          {/* HERO SETTINGS */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <Label>Hero Badge Text</Label>
              <Input
                value={settings.hero_badge_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_text: e.target.value })
                }
                placeholder="Premium Artisan Quality"
              />

              <Label>Hero Title</Label>
              <Input
                value={settings.hero_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_title: e.target.value })
                }
              />

              <Label>Hero Subtitle</Label>
              <Textarea
                value={settings.hero_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_subtitle: e.target.value })
                }
              />

              <Label>Hero Image URL</Label>
              <Input
                value={settings.hero_image_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_image_url: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* CTA SECTION */}
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>CTA Badge</Label>
              <Input
                value={settings.cta_badge_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_badge_text: e.target.value })
                }
              />

              <Label>CTA Title</Label>
              <Input
                value={settings.cta_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_title: e.target.value })
                }
              />

              <Label>CTA Subtitle</Label>
              <Textarea
                value={settings.cta_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_subtitle: e.target.value })
                }
              />

              <Label>CTA Button Label</Label>
              <Input
                value={settings.cta_primary_label || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_primary_label: e.target.value })
                }
              />

              <Label>CTA Button Link</Label>
              <Input
                value={settings.cta_primary_href || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_primary_href: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* SAVE BUTTON */}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Settings;
