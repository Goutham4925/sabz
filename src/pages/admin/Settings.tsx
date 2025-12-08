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

interface SiteSettings {
  id: number;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  about_text: string | null;
}

const API_URL = "http://localhost:5000/api";

const Settings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // ------------------------------------------------------------
  // LOAD SETTINGS FROM NODE BACKEND
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,  // ← REQUIRED
          },
        });

        if (!res.ok) throw new Error("Failed fetching");

        const data = await res.json();

        if (!data) {
          setSettings({
            id: 1,
            hero_title: "",
            hero_subtitle: "",
            hero_image_url: "",
            about_text: "",

            cta_title: "",
            cta_subtitle: "",
            cta_primary_label: "",
            cta_primary_href: "",
            cta_badge_text: "",
          });
        } else {
          setSettings(data);
        }
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


  // ------------------------------------------------------------
  // SAVE SETTINGS (PUT /api/settings/:id)
  // ------------------------------------------------------------
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/settings/${settings.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🍪 MUST SEND ADMIN JWT
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed saving");

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  // ------------------------------------------------------------
  // LOADING UI
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-2xl">
          <div>
            <h1 className="font-display text-3xl text-chocolate">
              Site Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your website content
            </p>
          </div>

          {/* HERO SETTINGS */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the main banner on your homepage
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_title: e.target.value })
                  }
                  placeholder="Crafted with Tradition. Baked with Love."
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_subtitle: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="hero_image_url">Hero Image URL</Label>
                <Input
                  id="hero_image_url"
                  type="url"
                  value={settings.hero_image_url || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_image_url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/banner.jpg"
                />

                {settings.hero_image_url && (
                  <img
                    src={settings.hero_image_url}
                    className="w-full max-w-md h-48 object-cover rounded-lg border mt-2"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "/placeholder.svg")
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* ABOUT SECTION */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                The story shown on your About page
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about_text">About Text</Label>
                <Textarea
                  id="about_text"
                  value={settings.about_text || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, about_text: e.target.value })
                  }
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* CTA SECTION */}
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
              <CardDescription>
                Controls the call-to-action section near the bottom of your homepage
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* CTA Title */}
              <div className="space-y-2">
                <Label htmlFor="cta_title">CTA Title (HTML allowed)</Label>
                <Input
                  id="cta_title"
                  value={settings.cta_title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cta_title: e.target.value })
                  }
                  placeholder="Ready to Experience <span class='text-golden'>Golden Perfection</span>?"
                />
              </div>

              {/* CTA Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="cta_subtitle">CTA Subtitle</Label>
                <Textarea
                  id="cta_subtitle"
                  rows={3}
                  value={settings.cta_subtitle || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cta_subtitle: e.target.value })
                  }
                  placeholder="Order our premium biscuits today and discover why customers love us."
                />
              </div>

              {/* CTA Primary Button Label */}
              <div className="space-y-2">
                <Label htmlFor="cta_primary_label">Primary Button Label</Label>
                <Input
                  id="cta_primary_label"
                  value={settings.cta_primary_label || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cta_primary_label: e.target.value })
                  }
                  placeholder="Shop Now"
                />
              </div>

              {/* CTA Primary Button Link */}
              <div className="space-y-2">
                <Label htmlFor="cta_primary_href">Primary Button Link</Label>
                <Input
                  id="cta_primary_href"
                  value={settings.cta_primary_href || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cta_primary_href: e.target.value })
                  }
                  placeholder="/products"
                />
              </div>

            </CardContent>
          </Card>


          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <Button onClick={handleSave} variant="hero" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Settings;
