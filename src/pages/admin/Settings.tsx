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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteSettings {
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
  cta_image_url: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_badge_text: string | null;

  footer_text: string | null;
  footer_subtext: string | null;
  navbar_logo: string | null;
}

const API_URL = "http://localhost:5000/api";

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();

  // ----------------------------------------
  // IMAGE UPLOAD HANDLER
  // ----------------------------------------
  const handleImageUpload = async (e: any, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setSettings((prev: any) => ({
        ...prev,
        [field]: data.url, // FULL URL returned from backend
      }));

      toast({
        title: "Image Uploaded",
        description: "The image has been uploaded successfully!",
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Unable to upload image.",
        variant: "destructive",
      });
    }
  };

  // ----------------------------------------
  // FETCH SETTINGS
  // ----------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not fetch settings.",
          variant: "destructive",
        });
      }

      setLoading(false);
    })();
  }, []);

  // ----------------------------------------
  // SAVE SETTINGS
  // ----------------------------------------
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

      if (!res.ok) throw new Error();

      toast({
        title: "Saved!",
        description: "Settings updated successfully.",
      });
    } catch {
      toast({
        title: "Save Failed",
        description: "Could not save settings.",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-3xl">

          {/* ---------------------------------------- */}
          {/* HERO SECTION */}
          {/* ---------------------------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>Hero Badge</Label>
              <Input
                value={settings.hero_badge_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_badge_text: e.target.value })
                }
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

              {/* IMAGE FIELD + UPLOAD BUTTON */}
              <Label>Hero Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.hero_image_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_image_url: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  id="heroUpload"
                  onChange={(e) => handleImageUpload(e, "hero_image_url")}
                />

                <Button
                  onClick={() => document.getElementById("heroUpload")?.click()}
                >
                  Upload
                </Button>
              </div>

              {settings.hero_image_url && (
                <img
                  src={settings.hero_image_url}
                  className="w-40 rounded shadow mt-2"
                />
              )}
            </CardContent>
          </Card>

          {/* ---------------------------------------- */}
          {/* ABOUT SECTION */}
          {/* ---------------------------------------- */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>About Badge</Label>
              <Input
                value={settings.about_badge || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_badge: e.target.value })
                }
              />

              <Label>About Title</Label>
              <Input
                value={settings.about_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_title: e.target.value })
                }
              />

              <Label>Paragraph 1</Label>
              <Textarea
                value={settings.about_paragraph1 || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    about_paragraph1: e.target.value,
                  })
                }
              />

              <Label>Paragraph 2</Label>
              <Textarea
                value={settings.about_paragraph2 || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    about_paragraph2: e.target.value,
                  })
                }
              />

              {/* IMAGE UPLOAD */}
              <Label>About Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.about_image_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      about_image_url: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="hidden"
                  id="aboutUpload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "about_image_url")}
                />

                <Button
                  onClick={() =>
                    document.getElementById("aboutUpload")?.click()
                  }
                >
                  Upload
                </Button>
              </div>

              {settings.about_image_url && (
                <img
                  src={settings.about_image_url}
                  className="w-40 rounded shadow mt-2"
                />
              )}
            </CardContent>
          </Card>

          {/* ---------------------------------------- */}
          {/* CTA SECTION */}
          {/* ---------------------------------------- */}
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

              {/* CTA IMAGE UPLOAD */}
              <Label>CTA Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.cta_image_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      cta_image_url: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="hidden"
                  id="ctaUpload"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "cta_image_url")}
                />

                <Button
                  onClick={() => document.getElementById("ctaUpload")?.click()}
                >
                  Upload
                </Button>
              </div>

              {settings.cta_image_url && (
                <img
                  src={settings.cta_image_url}
                  className="w-40 rounded shadow mt-2"
                />
              )}
            </CardContent>
          </Card>

          {/* ---------------------------------------- */}
          {/* SAVE BUTTON */}
          {/* ---------------------------------------- */}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
