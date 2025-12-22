import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

// -------------------------------------
// SITE SETTINGS INTERFACE
// -------------------------------------
interface SiteSettings {
  id: number;

  navbar_logo: string | null;
  navbar_brand_image: string | null;
  show_company_text: boolean;

  hero_title: string | null;
  hero_subtitle: string | null;
  hero_badge_text: string | null;
  hero_image_url: string | null;

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
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  privacy_policy: string | null;
  terms_conditions: string | null;
}

// --------------------------------------------------
// MAIN SETTINGS PAGE COMPONENT
// --------------------------------------------------
export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // -------------------------------------
  // HIGHLIGHT TOOL (Reusable Everywhere)
  // -------------------------------------
const highlightTool = (fieldKey: string) => (
  <div className="mt-2 space-y-2">
    <div className="flex items-center gap-2">
      <Input
        placeholder="Word to highlight"
        id={`highlightWordInput_${fieldKey}`}
        className="w-44"
      />

      <select
        id={`highlightType_${fieldKey}`}
        className="border rounded-md px-2 py-1 text-sm"
        defaultValue="normal"
      >
        <option value="normal">Normal Gradient</option>
        <option value="light">Light Gradient</option>
      </select>

      <Button
        type="button"
        onClick={() => {
          const input = document.getElementById(
            `highlightWordInput_${fieldKey}`
          ) as HTMLInputElement;

          const typeSelect = document.getElementById(
            `highlightType_${fieldKey}`
          ) as HTMLSelectElement;

          const word = input?.value.trim();
          if (!word) return;

          const gradientClass =
            typeSelect?.value === "light"
              ? "text-gradient-light"
              : "text-gradient";

          const colored = `<span class="${gradientClass}">${word}</span>`;

          setSettings((prev: any) => ({
            ...prev,
            [fieldKey]:
              prev[fieldKey]?.replace(
                new RegExp(`\\b${word}\\b`, "g"),
                colored
              ) ?? "",
          }));

          input.value = "";
        }}
      >
        Highlight
      </Button>
    </div>
  </div>
);

  // -------------------------------------
  // IMAGE UPLOAD HANDLER
  // -------------------------------------
  const handleImageUpload = async (e: any, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    if (settings?.[field]) {
      formData.append("oldImage", settings[field] as string);
    }

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setSettings((prev: any) => ({
        ...prev,
        [field]: data.url,
      }));

      toast({
        title: "Image Updated!",
        description: "Old image deleted successfully.",
      });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Unable to upload image.",
        variant: "destructive",
      });
    }
  };

  // -------------------------------------
  // FETCH SETTINGS
  // -------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setSettings(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load settings.",
          variant: "destructive",
        });
      }

      setLoading(false);
    })();
  }, []);

  // -------------------------------------
  // SAVE SETTINGS
  // -------------------------------------
  const handleSave = async () => {

    if (!settings) {
      console.log("❌ No settings");
      return;
    }

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

      toast({ title: "Saved!", description: "Settings updated successfully." });
    } catch (err) {
      console.error("❌ SAVE FAILED", err);
      toast({
        title: "Save Failed",
        description: "Unable to save changes.",
        variant: "destructive",
      });
    }

    setSaving(false);
  };


  // -------------------------------------
  // LOADING UI
  // -------------------------------------
  if (loading || !settings) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin h-10 w-10" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // ------------------------------------------------------------
  // RENDER MAIN PAGE
  // ------------------------------------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 max-w-3xl">

          {/* ------------------------ BRANDING ------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Branding (Navbar)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* NAV LOGO */}
              <div>
                <Label>Navbar Logo Image</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    value={settings.navbar_logo || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, navbar_logo: e.target.value })
                    }
                  />

                  <input
                    type="file"
                    id="navbarLogoUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "navbar_logo")}
                  />

                  <Button onClick={() => document.getElementById("navbarLogoUpload")?.click()}>
                    Upload
                  </Button>
                </div>

                {settings.navbar_logo && (
                  <img
                    src={settings.navbar_logo}
                    className="w-32 h-24 object-contain border rounded mt-3"
                  />
                )}
              </div>

              {/* BRAND IMAGE */}
              <div>
                <Label>Brand Name Image</Label>

                <div className="flex items-center gap-3 mt-2">
                  <Input
                    value={settings.navbar_brand_image || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        navbar_brand_image: e.target.value,
                      })
                    }
                  />

                  <input
                    type="file"
                    id="brandNameUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "navbar_brand_image")}
                  />

                  <Button onClick={() => document.getElementById("brandNameUpload")?.click()}>
                    Upload
                  </Button>
                </div>

                {settings.navbar_brand_image && (
                  <img
                    src={settings.navbar_brand_image}
                    className="w-40 h-auto object-contain border rounded mt-3"
                  />
                )}
              </div>

              {/* SHOW/HIDE TEXT */}
              <div className="flex items-center gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={settings.show_company_text}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      show_company_text: e.target.checked,
                    })
                  }
                />
                <Label>Show Company Name Text</Label>
              </div>
            </CardContent>
          </Card>

          {/* ------------------------ HERO SECTION ------------------------ */}
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

              <Label>Hero Title (supports &lt;span&gt;)</Label>
              <Textarea
                rows={3}
                value={settings.hero_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_title: e.target.value })
                }
              />
              {highlightTool("hero_title")}

              <Label>Hero Subtitle</Label>
              <Textarea
                value={settings.hero_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, hero_subtitle: e.target.value })
                }
              />

              <Label>Hero Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.hero_image_url || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_image_url: e.target.value })
                  }
                />

                <input
                  type="file"
                  id="heroImgUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "hero_image_url")}
                />

                <Button onClick={() => document.getElementById("heroImgUpload")?.click()}>
                  Upload
                </Button>
              </div>

              {settings.hero_image_url && (
                <img src={settings.hero_image_url} className="w-40 rounded mt-2 shadow" />
              )}
            </CardContent>
          </Card>

          {/* ------------------------ ABOUT SECTION ------------------------ */}
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

              <Label>About Title (supports &lt;span&gt;)</Label>
              <Input
                value={settings.about_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_title: e.target.value })
                }
              />
              {highlightTool("about_title")}

              <Label>Paragraph 1</Label>
              <Textarea
                value={settings.about_paragraph1 || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_paragraph1: e.target.value })
                }
              />

              <Label>Paragraph 2</Label>
              <Textarea
                value={settings.about_paragraph2 || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about_paragraph2: e.target.value })
                }
              />

              <Label>About Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.about_image_url || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, about_image_url: e.target.value })
                  }
                />

                <input
                  type="file"
                  id="aboutImgUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "about_image_url")}
                />

                <Button onClick={() => document.getElementById("aboutImgUpload")?.click()}>
                  Upload
                </Button>
              </div>

              {settings.about_image_url && (
                <img src={settings.about_image_url} className="w-40 mt-2 rounded shadow" />
              )}
            </CardContent>
          </Card>

          {/* ------------------------ PRODUCTS SECTION ------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Products Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Products Title (supports &lt;span&gt;)</Label>
              <Input
                value={settings.products_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, products_title: e.target.value })
                }
              />
              {highlightTool("products_title")}

              <Label>Products Subtitle</Label>
              <Textarea
                value={settings.products_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, products_subtitle: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* ------------------------ CTA SECTION ------------------------ */}
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

              <Label>CTA Title (supports &lt;span&gt;)</Label>
              <Input
                value={settings.cta_title || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_title: e.target.value })
                }
              />
              {highlightTool("cta_title")}

              <Label>CTA Subtitle</Label>
              <Textarea
                value={settings.cta_subtitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, cta_subtitle: e.target.value })
                }
              />

              <Label>CTA Image</Label>
              <div className="flex items-center gap-3">
                <Input
                  value={settings.cta_image_url || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, cta_image_url: e.target.value })
                  }
                />

                <input
                  type="file"
                  id="ctaImgUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "cta_image_url")}
                />

                <Button onClick={() => document.getElementById("ctaImgUpload")?.click()}>
                  Upload
                </Button>
              </div>

              {settings.cta_image_url && (
                <img src={settings.cta_image_url} className="w-40 rounded mt-2 shadow" />
              )}
            </CardContent>
          </Card>

          {/* ------------------------ FOOTER SECTION ------------------------ */}

          <Card>
            <CardHeader>
              <CardTitle>Footer Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Label>Footer Main Text</Label>
              <Textarea
                rows={3}
                value={settings.footer_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, footer_text: e.target.value })
                }
              />

              <div className="pt-4 border-t space-y-3">
                <Label>Facebook URL</Label>
                <Input
                  placeholder="https://facebook.com/yourpage"
                  value={settings.social_facebook || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_facebook: e.target.value })
                  }
                />

                <Label>Instagram URL</Label>
                <Input
                  placeholder="https://instagram.com/yourpage"
                  value={settings.social_instagram || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_instagram: e.target.value })
                  }
                />

                <Label> X URL</Label>
                <Input
                  placeholder="https://x.com/yourpage"
                  value={settings.social_twitter || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, social_twitter: e.target.value })
                  }
                />
                <Label>Footer Location / Address (HTML allowed)</Label>
                <Textarea
                  rows={3}
                  placeholder=" 123 Baker Street, Bangalore, India"
                  value={settings.footer_subtext || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      footer_subtext: e.target.value,
                    })
                  }
                />


              </div>
            </CardContent>
          </Card>

          {/* ------------------------ Legal SECTION ------------------------ */}
          <Card>
            <CardHeader>
              <CardTitle>Legal Pages</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <Label>Privacy Policy (HTML allowed)</Label>
                <Textarea
                  rows={8}
                  placeholder="<p>Your privacy policy...</p>"
                  value={settings.privacy_policy || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, privacy_policy: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Terms & Conditions (HTML allowed)</Label>
                <Textarea
                  rows={8}
                  placeholder="<p>Your terms & conditions...</p>"
                  value={settings.terms_conditions || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, terms_conditions: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>



          {/* ------------------------ SAVE BUTTON ------------------------ */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
