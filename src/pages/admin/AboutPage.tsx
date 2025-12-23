import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Save, Upload, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AboutPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [timeline, setTimeline] = useState<any[]>([]);

  // -----------------------------------------
  // UNIVERSAL IMAGE UPLOADER
  // -----------------------------------------
  const uploadImage = async (file: File, field: string) => {
    const form = new FormData();
    form.append("image", file);

    if (data[field]) form.append("oldImage", data[field]);

    try {
      const r = await fetch(`${BASE}/upload`, { method: "POST", body: form });
      const out = await r.json();

      setData((prev: any) => ({ ...prev, [field]: out.url }));

      toast({ title: "Image Updated", description: "Image replaced successfully." });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Image upload failed",
        variant: "destructive",
      });
    }
  };

  const saveTimelineItem = async (id: number, payload: any) => {
    const token = localStorage.getItem("token");

    await fetch(`${BASE}/about-timeline/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
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

  // -----------------------------------------
  // FETCH ABOUT PAGE DATA
  // -----------------------------------------
  useEffect(() => {
    fetch(`${BASE}/about`)
      .then((r) => r.json())
      .then((d) => {
        const fields = [
          "hero_badge",
          "hero_title",
          "hero_paragraph1",
          "hero_paragraph2",
          "hero_image_url",

          "value_1_icon",
          "value_1_title",
          "value_1_desc",
          "value_2_icon",
          "value_2_title",
          "value_2_desc",
          "value_3_icon",
          "value_3_title",
          "value_3_desc",
          "value_4_icon",
          "value_4_title",
          "value_4_desc",

          "timeline_heading",
          "timeline_subheading",

          "milestone_1_year",
          "milestone_1_title",
          "milestone_1_desc",
          "milestone_2_year",
          "milestone_2_title",
          "milestone_2_desc",
          "milestone_3_year",
          "milestone_3_title",
          "milestone_3_desc",
          "milestone_4_year",
          "milestone_4_title",
          "milestone_4_desc",
          "milestone_5_year",
          "milestone_5_title",
          "milestone_5_desc",

          "team_heading",
          "team_subheading",
          "team_1_name",
          "team_1_role",
          "team_1_image",
          "team_2_name",
          "team_2_role",
          "team_2_image",
          "team_3_name",
          "team_3_role",
          "team_3_image",

          "stat_years",
          "stat_flavors",
          "stat_countries",
          "stat_customers",
        ];

        const cleaned: any = { id: d.id };
        fields.forEach((f) => (cleaned[f] = d[f] ?? ""));

        setData(cleaned);
        setTimeline(d.timeline || []);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: any) =>
    setData((prev: any) => ({ ...prev, [key]: value }));

  // -----------------------------------------
  // SAVE CHANGES
  // -----------------------------------------
  const save = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      await fetch(`${BASE}/about/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "Saved!",
        description: "About Page updated successfully.",
      });
    } catch {
      toast({
        title: "Save Failed",
        description: "Could not save About Page.",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  if (loading)
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="animate-spin w-10 h-10" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 w-full max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">About Page Settings</h1>
            <p className="text-gray-500 text-sm">Manage your About page content</p>
          </div>

          {/* ===================== HERO SECTION ===================== */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Hero Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <Label>Hero Badge</Label>
              <Input 
                value={data.hero_badge} 
                onChange={(e) => handleChange("hero_badge", e.target.value)}
                className="w-full"
              />

              {/* HERO TITLE — Supports <span> formatting */}
              <Label>Hero Title (supports &lt;span&gt; formatting)</Label>
              <Textarea
                rows={3}
                value={data.hero_title}
                onChange={(e) => handleChange("hero_title", e.target.value)}
                className="w-full"
              />

              <HighlightTool
                fieldKey="hero_title"
                placeholder="Word to highlight (e.g., Tradition)"
              />

              <Label>Paragraph 1</Label>
              <Textarea
                rows={3}
                value={data.hero_paragraph1}
                onChange={(e) => handleChange("hero_paragraph1", e.target.value)}
                className="w-full"
              />

              <Label>Paragraph 2</Label>
              <Textarea
                rows={3}
                value={data.hero_paragraph2}
                onChange={(e) => handleChange("hero_paragraph2", e.target.value)}
                className="w-full"
              />

              <Label>Hero Image</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 w-full">
                  <Input
                    value={data.hero_image_url}
                    onChange={(e) => handleChange("hero_image_url", e.target.value)}
                    className="w-full"
                  />
                </div>

                <input
                  id="heroImageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && uploadImage(e.target.files[0], "hero_image_url")}
                />

                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => document.getElementById("heroImageUpload")!.click()}
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
              </div>

              {data.hero_image_url && (
                <img 
                  src={data.hero_image_url} 
                  className="w-40 rounded-xl mt-4 max-w-full" 
                  alt="Hero"
                />
              )}
            </CardContent>
          </Card>

          {/* ===================== VALUES SECTION ===================== */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Values</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold">Value {i}</h3>

                  <Label>Icon (Name or Image URL)</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 w-full">
                      <Input
                        value={data[`value_${i}_icon`]}
                        onChange={(e) => handleChange(`value_${i}_icon`, e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <input
                      id={`valueUpload${i}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && uploadImage(e.target.files[0], `value_${i}_icon`)
                      }
                    />

                    <Button 
                      className="w-full sm:w-auto"
                      onClick={() => document.getElementById(`valueUpload${i}`)!.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload
                    </Button>
                  </div>

                  {data[`value_${i}_icon`]?.startsWith("http") && (
                    <img 
                      src={data[`value_${i}_icon`]} 
                      className="w-20 rounded-xl mt-2 max-w-full" 
                      alt={`Value ${i}`}
                    />
                  )}

                  <Label>Title</Label>
                  <Input
                    value={data[`value_${i}_title`]}
                    onChange={(e) => handleChange(`value_${i}_title`, e.target.value)}
                    className="w-full"
                  />

                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={data[`value_${i}_desc`]}
                    onChange={(e) => handleChange(`value_${i}_desc`, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ===================== TIMELINE SECTION ===================== */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* SHOW / HIDE TIMELINE */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!data.timeline_hidden}
                  onChange={(e) =>
                    handleChange("timeline_hidden", !e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label>Show Timeline Section</Label>
              </div>

              <hr className="opacity-30" />

              {/* ================= HEADING ================= */}
              <Label>Timeline Heading (supports &lt;span&gt; formatting)</Label>
              <Textarea
                rows={2}
                value={data.timeline_heading}
                onChange={(e) => handleChange("timeline_heading", e.target.value)}
                className="w-full"
              />

              {/* Highlight Word Tool */}
              <HighlightTool
                fieldKey="timeline_heading"
                placeholder="Word to highlight (e.g., Journey)"
              />

              {/* ================= SUBHEADING ================= */}
              <Label>Timeline Subheading</Label>
              <Input
                value={data.timeline_subheading}
                onChange={(e) =>
                  handleChange("timeline_subheading", e.target.value)
                }
                className="w-full"
              />

              {/* ================= MILESTONES ================= */}
              {timeline.map((item, index) => (
                <div
                  key={item.id}
                  className="border p-4 rounded-xl space-y-3"
                >
                  <h3 className="font-semibold">
                    Milestone {index + 1}
                  </h3>

                  <Label>Year</Label>
                  <Input
                    value={item.year}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[index].year = e.target.value;
                      setTimeline(copy);
                    }}
                    onBlur={() =>
                      saveTimelineItem(item.id, {
                        year: item.year,
                        title: item.title,
                        desc: item.desc,
                      })
                    }
                    className="w-full"
                  />

                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[index].title = e.target.value;
                      setTimeline(copy);
                    }}
                    onBlur={() =>
                      saveTimelineItem(item.id, {
                        year: item.year,
                        title: item.title,
                        desc: item.desc,
                      })
                    }
                    className="w-full"
                  />

                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => {
                      const copy = [...timeline];
                      copy[index].desc = e.target.value;
                      setTimeline(copy);
                    }}
                    onBlur={() =>
                      saveTimelineItem(item.id, {
                        year: item.year,
                        title: item.title,
                        desc: item.desc,
                      })
                    }
                    className="w-full"
                  />

                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const token = localStorage.getItem("token");

                      await fetch(`${BASE}/about-timeline/${item.id}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });

                      setTimeline(
                        timeline.filter((t) => t.id !== item.id)
                      );
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Milestone
                  </Button>
                </div>
              ))}

              {/* ================= ADD BUTTON ================= */}
              <Button
                onClick={async () => {
                  const token = localStorage.getItem("token");

                  const res = await fetch(`${BASE}/about-timeline`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      aboutId: data.id,
                      year: "",
                      title: "",
                      desc: "",
                    }),
                  });

                  const newItem = await res.json();
                  setTimeline([...timeline, newItem]);
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </CardContent>
          </Card>

          {/* ===================== TEAM SECTION ===================== */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Team Section</CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 pt-6">

              {/* ---------- SECTION HEADING ---------- */}
              <div className="space-y-3">
                <Label>Team Section Heading (supports &lt;span&gt;)</Label>
                <Textarea
                  rows={2}
                  value={data.team_heading}
                  onChange={(e) =>
                    handleChange("team_heading", e.target.value)
                  }
                  className="w-full"
                  placeholder="Meet the <span class='text-gradient'>Team</span>"
                />

                <HighlightTool
                  fieldKey="team_heading"
                  placeholder="Word to highlight (e.g., Team)"
                />
              </div>

              {/* ---------- SECTION SUBTITLE ---------- */}
              <div className="space-y-3">
                <Label>Team Section Subtitle</Label>
                <Textarea
                  rows={2}
                  value={data.team_subheading}
                  onChange={(e) =>
                    handleChange("team_subheading", e.target.value)
                  }
                  className="w-full"
                  placeholder="The passionate people behind every authentic blend"
                />
              </div>

              <hr className="opacity-30" />

              {/* ---------- TEAM MEMBERS ---------- */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border p-4 rounded-xl space-y-3">
                  <h3 className="font-semibold">Team Member {i}</h3>

                  <Label>Name</Label>
                  <Input
                    value={data[`team_${i}_name`]}
                    onChange={(e) =>
                      handleChange(`team_${i}_name`, e.target.value)
                    }
                    className="w-full"
                  />

                  <Label>Role</Label>
                  <Input
                    value={data[`team_${i}_role`]}
                    onChange={(e) =>
                      handleChange(`team_${i}_role`, e.target.value)
                    }
                    className="w-full"
                  />

                  <Label>Image</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 w-full">
                      <Input
                        value={data[`team_${i}_image`]}
                        onChange={(e) =>
                          handleChange(`team_${i}_image`, e.target.value)
                        }
                        className="w-full"
                      />
                    </div>

                    <input
                      id={`teamUpload${i}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        uploadImage(e.target.files[0], `team_${i}_image`)
                      }
                    />

                    <Button
                      className="w-full sm:w-auto"
                      onClick={() =>
                        document.getElementById(`teamUpload${i}`)!.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" /> Upload
                    </Button>
                  </div>

                  {data[`team_${i}_image`]?.startsWith("http") && (
                    <img
                      src={data[`team_${i}_image`]}
                      className="w-24 rounded-xl mt-2 max-w-full"
                      alt={`Team member ${i}`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>


          {/* ===================== STATS SECTION ===================== */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {["stat_years", "stat_flavors", "stat_countries", "stat_customers"].map((field) => (
                <div key={field}>
                  <Label>{field.replace("stat_", "").toUpperCase()}</Label>
                  <Input
                    value={data[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SAVE BUTTON */}
          <Button 
            onClick={save} 
            disabled={saving} 
            className="w-full sticky bottom-4 z-10 max-w-md mx-auto"
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
          
          <div className="pb-8"></div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}