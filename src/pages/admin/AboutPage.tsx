import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AboutPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
          <Loader2 className="animate-spin w-10 h-10" />
        </AdminLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <AdminLayout>
        {/* ===================== HERO SECTION ===================== */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Label>Hero Badge</Label>
            <Input value={data.hero_badge} onChange={(e) => handleChange("hero_badge", e.target.value)} />

            <Label>Hero Title</Label>
            <Input value={data.hero_title} onChange={(e) => handleChange("hero_title", e.target.value)} />

            <Label>Paragraph 1</Label>
            <Textarea
              rows={3}
              value={data.hero_paragraph1}
              onChange={(e) => handleChange("hero_paragraph1", e.target.value)}
            />

            <Label>Paragraph 2</Label>
            <Textarea
              rows={3}
              value={data.hero_paragraph2}
              onChange={(e) => handleChange("hero_paragraph2", e.target.value)}
            />

            <Label>Hero Image</Label>
            <div className="flex items-center gap-4">
              <Input
                value={data.hero_image_url}
                onChange={(e) => handleChange("hero_image_url", e.target.value)}
              />

              <input
                id="heroImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && uploadImage(e.target.files[0], "hero_image_url")}
              />

              <Button onClick={() => document.getElementById("heroImageUpload")!.click()}>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>

            {data.hero_image_url && <img src={data.hero_image_url} className="w-40 rounded-xl mt-4" />}
          </CardContent>
        </Card>

        {/* ===================== VALUES SECTION ===================== */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Values</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Value {i}</h3>

                <Label>Icon (Name or Image URL)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    value={data[`value_${i}_icon`]}
                    onChange={(e) => handleChange(`value_${i}_icon`, e.target.value)}
                  />

                  <input
                    id={`valueUpload${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && uploadImage(e.target.files[0], `value_${i}_icon`)
                    }
                  />

                  <Button onClick={() => document.getElementById(`valueUpload${i}`)!.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                </div>

                {data[`value_${i}_icon`]?.startsWith("http") && (
                  <img src={data[`value_${i}_icon`]} className="w-20 rounded-xl mt-2" />
                )}

                <Label>Title</Label>
                <Input
                  value={data[`value_${i}_title`]}
                  onChange={(e) => handleChange(`value_${i}_title`, e.target.value)}
                />

                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={data[`value_${i}_desc`]}
                  onChange={(e) => handleChange(`value_${i}_desc`, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===================== TIMELINE SECTION ===================== */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <Label>Timeline Heading</Label>
            <Input
              value={data.timeline_heading}
              onChange={(e) => handleChange("timeline_heading", e.target.value)}
            />

            <Label>Timeline Subheading</Label>
            <Input
              value={data.timeline_subheading}
              onChange={(e) => handleChange("timeline_subheading", e.target.value)}
            />

            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Milestone {i}</h3>

                <Label>Year</Label>
                <Input
                  value={data[`milestone_${i}_year`]}
                  onChange={(e) => handleChange(`milestone_${i}_year`, e.target.value)}
                />

                <Label>Title</Label>
                <Input
                  value={data[`milestone_${i}_title`]}
                  onChange={(e) => handleChange(`milestone_${i}_title`, e.target.value)}
                />

                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={data[`milestone_${i}_desc`]}
                  onChange={(e) => handleChange(`milestone_${i}_desc`, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===================== TEAM SECTION ===================== */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Team Member {i}</h3>

                <Label>Name</Label>
                <Input
                  value={data[`team_${i}_name`]}
                  onChange={(e) => handleChange(`team_${i}_name`, e.target.value)}
                />

                <Label>Role</Label>
                <Input
                  value={data[`team_${i}_role`]}
                  onChange={(e) => handleChange(`team_${i}_role`, e.target.value)}
                />

                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    value={data[`team_${i}_image`]}
                    onChange={(e) =>
                      handleChange(`team_${i}_image`, e.target.value)
                    }
                  />

                  <input
                    id={`teamUpload${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && uploadImage(e.target.files[0], `team_${i}_image`)
                    }
                  />

                  <Button onClick={() => document.getElementById(`teamUpload${i}`)!.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                </div>

                {data[`team_${i}_image`]?.startsWith("http") && (
                  <img src={data[`team_${i}_image`]} className="w-24 rounded-xl mt-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===================== STATS SECTION ===================== */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["stat_years", "stat_flavors", "stat_countries", "stat_customers"].map((field) => (
              <div key={field}>
                <Label>{field.replace("stat_", "").toUpperCase()}</Label>
                <Input
                  value={data[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <Button onClick={save} disabled={saving} className="mt-4">
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Changes
        </Button>
      </AdminLayout>
    </ProtectedRoute>
  );
}
