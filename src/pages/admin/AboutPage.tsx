import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000/api/about";

export default function AboutPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // ---------------------------------------------------------
  // FETCH ABOUT PAGE FROM BACKEND
  // ---------------------------------------------------------
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((d) => {
        const cleaned: any = {};

        const fields = [
          "hero_badge","hero_title","hero_paragraph1","hero_paragraph2","hero_image_url",

          // VALUES 1–4
          "value_1_icon","value_1_title","value_1_desc",
          "value_2_icon","value_2_title","value_2_desc",
          "value_3_icon","value_3_title","value_3_desc",
          "value_4_icon","value_4_title","value_4_desc",

          // TIMELINE HEADINGS
          "timeline_heading",
          "timeline_subheading",

          // MILESTONES 1–5
          "milestone_1_year","milestone_1_title","milestone_1_desc",
          "milestone_2_year","milestone_2_title","milestone_2_desc",
          "milestone_3_year","milestone_3_title","milestone_3_desc",
          "milestone_4_year","milestone_4_title","milestone_4_desc",
          "milestone_5_year","milestone_5_title","milestone_5_desc",

          // TEAM
          "team_1_name","team_1_role","team_1_image",
          "team_2_name","team_2_role","team_2_image",
          "team_3_name","team_3_role","team_3_image",

          // STATS
          "stat_years","stat_flavors","stat_countries","stat_customers"
        ];

        fields.forEach((f) => (cleaned[f] = d[f] ?? ""));
        cleaned.id = d.id;

        setData(cleaned);
        setLoading(false);
      });
  }, []);

  // ---------------------------------------------------------
  // SAVE DATA
  // ---------------------------------------------------------
  const save = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      toast({ title: "Saved", description: "About Page updated successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Error saving About Page",
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

  // Helper update function
  const handle = (field: string, value: any) =>
    setData((prev: any) => ({ ...prev, [field]: value }));

  return (
    <ProtectedRoute>
      <AdminLayout>

        {/* --------------------------------------------- */}
        {/* HERO SECTION */}
        {/* --------------------------------------------- */}

        <Card className="mb-8">
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-6">

            <div>
              <Label>Hero Badge</Label>
              <Input value={data.hero_badge} onChange={(e) => handle("hero_badge", e.target.value)} />
            </div>

            <div>
              <Label>Hero Title</Label>
              <Input value={data.hero_title} onChange={(e) => handle("hero_title", e.target.value)} />
            </div>

            <div>
              <Label>Paragraph 1</Label>
              <Textarea rows={3} value={data.hero_paragraph1} onChange={(e) => handle("hero_paragraph1", e.target.value)} />
            </div>

            <div>
              <Label>Paragraph 2</Label>
              <Textarea rows={3} value={data.hero_paragraph2} onChange={(e) => handle("hero_paragraph2", e.target.value)} />
            </div>

            <div>
              <Label>Hero Image URL</Label>
              <Input value={data.hero_image_url} onChange={(e) => handle("hero_image_url", e.target.value)} />
              {data.hero_image_url && <img src={data.hero_image_url} className="w-40 rounded-xl mt-3" />}
            </div>

          </CardContent>
        </Card>



        {/* --------------------------------------------- */}
        {/* VALUES SECTION */}
        {/* --------------------------------------------- */}

        <Card className="mb-8">
          <CardHeader><CardTitle>Values (4 Items)</CardTitle></CardHeader>
          <CardContent className="space-y-8">

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Value {i}</h3>

                <Label>Icon Name (Heart, Leaf, Award, Users)</Label>
                <Input value={data[`value_${i}_icon`]} onChange={(e) => handle(`value_${i}_icon`, e.target.value)} />

                <Label>Title</Label>
                <Input value={data[`value_${i}_title`]} onChange={(e) => handle(`value_${i}_title`, e.target.value)} />

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



        {/* --------------------------------------------- */}
        {/* TIMELINE SECTION */}
        {/* --------------------------------------------- */}

        <Card className="mb-8">
          <CardHeader><CardTitle>Timeline Section</CardTitle></CardHeader>

          <CardContent className="space-y-8">

            <div>
              <Label>Timeline Heading</Label>
              <Input value={data.timeline_heading} onChange={(e) => handle("timeline_heading", e.target.value)} />
            </div>

            <div>
              <Label>Timeline Subheading</Label>
              <Input value={data.timeline_subheading} onChange={(e) => handle("timeline_subheading", e.target.value)} />
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Milestone {i}</h3>

                <Label>Year</Label>
                <Input value={data[`milestone_${i}_year`]} onChange={(e) => handle(`milestone_${i}_year`, e.target.value)} />

                <Label>Title</Label>
                <Input value={data[`milestone_${i}_title`]} onChange={(e) => handle(`milestone_${i}_title`, e.target.value)} />

                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={data[`milestone_${i}_desc`]}
                  onChange={(e) => handle(`milestone_${i}_desc`, e.target.value)}
                />
              </div>
            ))}

          </CardContent>
        </Card>



        {/* --------------------------------------------- */}
        {/* TEAM SECTION */}
        {/* --------------------------------------------- */}

        <Card className="mb-8">
          <CardHeader><CardTitle>Team Members (3)</CardTitle></CardHeader>
          <CardContent className="space-y-8">

            {[1, 2, 3].map((i) => (
              <div key={i} className="border p-4 rounded-xl space-y-3">
                <h3 className="font-semibold">Team Member {i}</h3>

                <Label>Name</Label>
                <Input value={data[`team_${i}_name`]} onChange={(e) => handle(`team_${i}_name`, e.target.value)} />

                <Label>Role</Label>
                <Input value={data[`team_${i}_role`]} onChange={(e) => handle(`team_${i}_role`, e.target.value)} />

                <Label>Image URL</Label>
                <Input value={data[`team_${i}_image`]} onChange={(e) => handle(`team_${i}_image`, e.target.value)} />
                {data[`team_${i}_image`] && <img src={data[`team_${i}_image`]} className="w-32 rounded-xl mt-3" />}
              </div>
            ))}

          </CardContent>
        </Card>



        {/* --------------------------------------------- */}
        {/* STATS SECTION */}
        {/* --------------------------------------------- */}

        <Card className="mb-8">
          <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["stat_years","stat_flavors","stat_countries","stat_customers"].map((field) => (
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
