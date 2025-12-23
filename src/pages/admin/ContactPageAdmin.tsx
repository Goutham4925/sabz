import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ContactPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // -----------------------------
  // GENERIC UPLOADER
  // -----------------------------
  const uploadImage = async (file: File, field: string) => {
    const form = new FormData();
    form.append("image", file);

    if (data[field]) {
      form.append("oldImage", data[field]);
    }

    try {
      const res = await fetch(`${BASE}/upload`, {
        method: "POST",
        body: form,
      });

      const out = await res.json();

      setData((prev: any) => ({
        ...prev,
        [field]: out.url,
      }));

      toast({
        title: "Image Updated!",
        description: "Image replaced successfully.",
      });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Could not upload image.",
        variant: "destructive",
      });
    }
  };

  // -------------------------------------
  // RESPONSIVE HIGHLIGHT TOOL
  // -------------------------------------
  const HighlightTool = ({
    fieldKey,
    placeholder,
  }: {
    fieldKey: string;
    placeholder: string;
  }) => (
    <div className="mt-2 space-y-2">
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
        <div className="w-full xs:w-auto xs:flex-1">
          <Input
            placeholder={placeholder}
            id={`highlightWord_${fieldKey}`}
            className="w-full xs:w-40"
          />
        </div>
        
        <div className="w-full xs:w-auto">
          <select
            id={`highlightType_${fieldKey}`}
            className="border rounded-md px-2 py-1 text-sm w-full xs:w-auto"
            defaultValue="normal"
          >
            <option value="normal">Normal Gradient</option>
            <option value="light">Light Gradient</option>
          </select>
        </div>

        <Button
          type="button"
          className="w-full xs:w-auto"
          onClick={() => {
            const input = document.getElementById(
              `highlightWord_${fieldKey}`
            ) as HTMLInputElement;

            const typeSelect = document.getElementById(
              `highlightType_${fieldKey}`
            ) as HTMLSelectElement;

            const word = input?.value.trim();
            if (!word) return;

            const gradientClass =
              typeSelect.value === "light"
                ? "text-gradient-light"
                : "text-gradient";

            const colored = `<span class="${gradientClass}">${word}</span>`;

            setData((prev: any) => ({
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
      <p className="text-xs text-gray-500">
        Type a word, choose gradient style, then click "Highlight"
      </p>
    </div>
  );

  // -----------------------------
  // FETCH CONTACT PAGE
  // -----------------------------
  useEffect(() => {
    fetch(`${BASE}/contact-page`)
      .then((res) => res.json())
      .then((d) => {
        const fields = [
          "hero_badge",
          "hero_title",
          "hero_subtitle",

          "card_1_icon",
          "card_1_title",
          "card_1_line1",
          "card_1_line2",

          "card_2_icon",
          "card_2_title",
          "card_2_line1",
          "card_2_line2",

          "card_3_icon",
          "card_3_title",
          "card_3_line1",
          "card_3_line2",

          "card_4_icon",
          "card_4_title",
          "card_4_line1",
          "card_4_line2",

          "faq_1_q",
          "faq_1_a",
          "faq_2_q",
          "faq_2_a",
          "faq_3_q",
          "faq_3_a",
          "faq_4_q",
          "faq_4_a",

          "map_title",
          "map_address",
        ];

        const cleaned: any = { id: d.id };
        fields.forEach((f) => (cleaned[f] = d[f] ?? ""));

        setData(cleaned);
        setLoading(false);
      });
  }, []);

  const handle = (field: string, value: any) =>
    setData((prev: any) => ({ ...prev, [field]: value }));

  // -----------------------------
  // SAVE CONTACT PAGE
  // -----------------------------
  const save = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      await fetch(`${BASE}/contact-page/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "Saved",
        description: "Contact Page updated successfully!",
      });
    } catch {
      toast({
        title: "Save Failed",
        description: "Could not update contact page.",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        {/* Loader INSIDE AdminLayout so layout stays fixed */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-8 w-full max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Contact Page Settings</h1>
              <p className="text-gray-500 text-sm">Manage your Contact page content</p>
            </div>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-lg">Contact Page Settings</CardTitle>
              </CardHeader>

              <CardContent className="space-y-8 pt-6">
                {/* HERO SECTION */}
                <div>
                  <Label>Hero Badge</Label>
                  <Input
                    value={data.hero_badge}
                    onChange={(e) => handle("hero_badge", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* HERO TITLE — supports <span> formatting */}
                <div>
                  <Label>Hero Title (supports &lt;span&gt; formatting)</Label>
                  <Textarea
                    rows={3}
                    value={data.hero_title}
                    onChange={(e) => handle("hero_title", e.target.value)}
                    className="w-full"
                  />

                  {/* Highlight Word Helper */}
                  <HighlightTool
                    fieldKey="hero_title"
                    placeholder="Word to highlight (e.g., Contact)"
                  />
                </div>

                <div>
                  <Label>Hero Subtitle</Label>
                  <Textarea
                    rows={2}
                    value={data.hero_subtitle}
                    onChange={(e) => handle("hero_subtitle", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* CONTACT CARDS */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border p-4 rounded-xl space-y-3">
                    <h3 className="font-semibold text-lg">Contact Card {i}</h3>

                    <Label>Card Icon (icon name or upload)</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex-1 w-full">
                        <Input
                          value={data[`card_${i}_icon`]}
                          placeholder="MapPin / Phone / https://..."
                          onChange={(e) => handle(`card_${i}_icon`, e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        id={`uploadCard${i}`}
                        className="hidden"
                        onChange={(e) =>
                          e.target.files &&
                          uploadImage(e.target.files[0], `card_${i}_icon`)
                        }
                      />

                      <Button
                        className="w-full sm:w-auto"
                        onClick={() =>
                          document.getElementById(`uploadCard${i}`)?.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" /> Upload
                      </Button>
                    </div>

                    {data[`card_${i}_icon`]?.startsWith("http") && (
                      <img
                        src={data[`card_${i}_icon`]}
                        className="w-14 h-14 object-cover rounded-lg mt-2 max-w-full"
                        alt={`Card ${i} icon`}
                      />
                    )}

                    <Label>Title</Label>
                    <Input
                      value={data[`card_${i}_title`]}
                      onChange={(e) =>
                        handle(`card_${i}_title`, e.target.value)
                      }
                      className="w-full"
                    />

                    <Label>Line 1</Label>
                    <Input
                      value={data[`card_${i}_line1`]}
                      onChange={(e) =>
                        handle(`card_${i}_line1`, e.target.value)
                      }
                      className="w-full"
                    />

                    <Label>Line 2</Label>
                    <Input
                      value={data[`card_${i}_line2`]}
                      onChange={(e) =>
                        handle(`card_${i}_line2`, e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                ))}

                {/* FAQ */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border p-4 rounded-lg space-y-3">
                    <Label>FAQ {i} – Question</Label>
                    <Input
                      value={data[`faq_${i}_q`]}
                      onChange={(e) => handle(`faq_${i}_q`, e.target.value)}
                      className="w-full"
                    />

                    <Label>FAQ {i} – Answer</Label>
                    <Textarea
                      rows={2}
                      value={data[`faq_${i}_a`]}
                      onChange={(e) => handle(`faq_${i}_a`, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ))}

                {/* MAP (commented out) */}
                {/* <div>
                  <Label>Map Title</Label>
                  <Input
                    value={data.map_title}
                    onChange={(e) => handle("map_title", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Map Address</Label>
                  <Textarea
                    rows={2}
                    value={data.map_address}
                    onChange={(e) => handle("map_address", e.target.value)}
                    className="w-full"
                  />
                </div> */}

                {/* SAVE BUTTON */}
                <Button 
                  onClick={save} 
                  disabled={saving} 
                  className="w-full sticky bottom-4 z-10"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <div className="pb-8"></div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}