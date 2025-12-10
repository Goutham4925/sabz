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
import { API_URL } from "@/config/api"; 

// const API_URL = "http://localhost:5000/api/about";

export default function AboutPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // -------------------------
  // GENERIC IMAGE UPLOADER
  // -------------------------
  const uploadImage = async (file: File, field: string) => {
    const form = new FormData();
    form.append("image", file);

    // Send old image URL for deletion
    if (data[field]) {
      form.append("oldImage", data[field]);
    }

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
      });

      const out = await res.json();

      setData((prev: any) => ({
        ...prev,
        [field]: out.url, // save new url
      }));

      toast({
        title: "Image Updated!",
        description: "Old image deleted automatically.",
      });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Could not upload image.",
        variant: "destructive",
      });
    }
  };


  // -------------------------
  // FETCH ABOUT PAGE
  // -------------------------
  useEffect(() => {
    fetch(`${API_URL}/about`)
      .then((res) => res.json())
      .then((d) => {
        const fields = [
          "hero_badge", "hero_title", "hero_paragraph1", "hero_paragraph2", "hero_image_url",
          "value_1_icon","value_1_title","value_1_desc",
          "value_2_icon","value_2_title","value_2_desc",
          "value_3_icon","value_3_title","value_3_desc",
          "value_4_icon","value_4_title","value_4_desc",
          "timeline_heading","timeline_subheading",
          "milestone_1_year","milestone_1_title","milestone_1_desc",
          "milestone_2_year","milestone_2_title","milestone_2_desc",
          "milestone_3_year","milestone_3_title","milestone_3_desc",
          "milestone_4_year","milestone_4_title","milestone_4_desc",
          "milestone_5_year","milestone_5_title","milestone_5_desc",
          "team_1_name","team_1_role","team_1_image",
          "team_2_name","team_2_role","team_2_image",
          "team_3_name","team_3_role","team_3_image",
          "stat_years","stat_flavors","stat_countries","stat_customers",
        ];

        const cleaned: any = {};
        fields.forEach((f) => (cleaned[f] = d[f] ?? ""));
        cleaned.id = d.id;

        setData(cleaned);
        setLoading(false);
      });
  }, []);

  const handle = (f: string, v: any) =>
    setData((prev: any) => ({ ...prev, [f]: v }));

  // -------------------------
  // SAVE TO BACKEND
  // -------------------------
  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      toast({ title: "Saved!", description: "About Page updated." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  if (loading)
    return (
      <ProtectedRoute>
        <AdminLayout>
          <Loader2 className="animate-spin w-6 h-6" />
        </AdminLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <AdminLayout>

        {/* HERO SECTION */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-6">

            <Label>Hero Badge</Label>
            <Input value={data.hero_badge} onChange={(e) => handle("hero_badge", e.target.value)} />

            <Label>Hero Title</Label>
            <Input value={data.hero_title} onChange={(e) => handle("hero_title", e.target.value)} />

            <Label>Paragraph 1</Label>
            <Textarea rows={3} value={data.hero_paragraph1} onChange={(e) => handle("hero_paragraph1", e.target.value)} />

            <Label>Paragraph 2</Label>
            <Textarea rows={3} value={data.hero_paragraph2} onChange={(e) => handle("hero_paragraph2", e.target.value)} />

            <Label>Hero Image</Label>
            <div className="flex items-center gap-3">
              <Input value={data.hero_image_url} onChange={(e) => handle("hero_image_url", e.target.value)} />

              <input
                type="file"
                accept="image/*"
                id="heroUpload"
                className="hidden"
                onChange={(e) => e.target.files && uploadImage(e.target.files[0], "hero_image_url")}
              />

              <Button onClick={() => document.getElementById("heroUpload")?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>

            {data.hero_image_url && (
              <img src={data.hero_image_url} className="w-40 rounded-xl mt-3" />
            )}

          </CardContent>
        </Card>

        {/* VALUES SECTION */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Values</CardTitle></CardHeader>
          <CardContent className="space-y-8">

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Value {i}</h3>

                <Label>Value Icon (Image or Icon Name)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={data[`value_${i}_icon`]}
                    onChange={(e) => handle(`value_${i}_icon`, e.target.value)}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`valueUpload${i}`}
                    onChange={(e) =>
                      e.target.files && uploadImage(e.target.files[0], `value_${i}_icon`)
                    }
                  />

                  <Button onClick={() => document.getElementById(`valueUpload${i}`)?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                </div>

                {data[`value_${i}_icon`] && (
                  <img src={data[`value_${i}_icon`]} className="w-20 rounded-xl mt-2" />
                )}

                <Label>Title</Label>
                <Input
                  value={data[`value_${i}_title`]}
                  onChange={(e) => handle(`value_${i}_title`, e.target.value)}
                />

                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={data[`value_${i}_desc`]}
                  onChange={(e) => handle(`value_${i}_desc`, e.target.value)}
                />
              </div>
            ))}

          </CardContent>
        </Card>

        {/* TEAM SECTION */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
          <CardContent className="space-y-8">

            {[1, 2, 3].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Team Member {i}</h3>

                <Label>Name</Label>
                <Input
                  value={data[`team_${i}_name`]}
                  onChange={(e) => handle(`team_${i}_name`, e.target.value)}
                />

                <Label>Role</Label>
                <Input
                  value={data[`team_${i}_role`]}
                  onChange={(e) => handle(`team_${i}_role`, e.target.value)}
                />

                <Label>Image</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={data[`team_${i}_image`]}
                    onChange={(e) => handle(`team_${i}_image`, e.target.value)}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`teamUpload${i}`}
                    onChange={(e) =>
                      e.target.files && uploadImage(e.target.files[0], `team_${i}_image`)
                    }
                  />

                  <Button onClick={() => document.getElementById(`teamUpload${i}`)?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Upload
                  </Button>
                </div>

                {data[`team_${i}_image`] && (
                  <img src={data[`team_${i}_image`]} className="w-24 rounded-xl mt-2" />
                )}

              </div>
            ))}

          </CardContent>
        </Card>

        {/* STATS SECTION */}
        <Card className="mb-8">
          <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["stat_years", "stat_flavors", "stat_countries", "stat_customers"].map((field) => (
              <div key={field}>
                <Label>{field.replace("stat_", "").toUpperCase()}</Label>
                <Input value={data[field]} onChange={(e) => handle(field, e.target.value)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SAVE BUTTON */}
        <Button onClick={save} disabled={saving} className="mt-4">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save All Changes
            </>
          )}
        </Button>

      </AdminLayout>
    </ProtectedRoute>
  );
}
