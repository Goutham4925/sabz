import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000/api/contact-page";

export default function ContactPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((d) => {
        const fields = [
          "hero_badge", "hero_title", "hero_subtitle",

          "card_1_icon", "card_1_title", "card_1_line1", "card_1_line2",
          "card_2_icon", "card_2_title", "card_2_line1", "card_2_line2",
          "card_3_icon", "card_3_title", "card_3_line1", "card_3_line2",
          "card_4_icon", "card_4_title", "card_4_line1", "card_4_line2",

          "faq_1_q", "faq_1_a",
          "faq_2_q", "faq_2_a",
          "faq_3_q", "faq_3_a",
          "faq_4_q", "faq_4_a",

          "map_title", "map_address",
        ];

        const cleaned: any = { id: d.id };

        fields.forEach((f) => (cleaned[f] = d[f] ?? ""));

        setData(cleaned);
        setLoading(false);
      });
  }, []);

  const handle = (field: string, value: any) =>
    setData((prev: any) => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);

    await fetch(`${API}/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    toast({ title: "Saved", description: "Contact page updated!" });
    setSaving(false);
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Card>
          <CardHeader>
            <CardTitle>Contact Page Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* HERO */}
            <div>
              <Label>Hero Badge</Label>
              <Input value={data.hero_badge} onChange={(e) => handle("hero_badge", e.target.value)} />
            </div>

            <div>
              <Label>Hero Title</Label>
              <Input value={data.hero_title} onChange={(e) => handle("hero_title", e.target.value)} />
            </div>

            <div>
              <Label>Hero Subtitle</Label>
              <Textarea rows={2} value={data.hero_subtitle} onChange={(e) => handle("hero_subtitle", e.target.value)} />
            </div>

            {/* CONTACT CARDS */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border p-4 rounded-lg space-y-3">
                <Label>Card {i} Icon</Label>
                <Input value={data[`card_${i}_icon`]} onChange={(e) => handle(`card_${i}_icon`, e.target.value)} />

                <Label>Title</Label>
                <Input value={data[`card_${i}_title`]} onChange={(e) => handle(`card_${i}_title`, e.target.value)} />

                <Label>Line 1</Label>
                <Input value={data[`card_${i}_line1`]} onChange={(e) => handle(`card_${i}_line1`, e.target.value)} />

                <Label>Line 2</Label>
                <Input value={data[`card_${i}_line2`]} onChange={(e) => handle(`card_${i}_line2`, e.target.value)} />
              </div>
            ))}

            {/* FAQ */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border p-4 rounded-lg space-y-3">
                <Label>FAQ {i} – Question</Label>
                <Input value={data[`faq_${i}_q`]} onChange={(e) => handle(`faq_${i}_q`, e.target.value)} />

                <Label>FAQ {i} – Answer</Label>
                <Textarea rows={2} value={data[`faq_${i}_a`]} onChange={(e) => handle(`faq_${i}_a`, e.target.value)} />
              </div>
            ))}

            {/* MAP */}
            <div>
              <Label>Map Title</Label>
              <Input value={data.map_title} onChange={(e) => handle("map_title", e.target.value)} />
            </div>

            <div>
              <Label>Map Address</Label>
              <Textarea rows={2} value={data.map_address} onChange={(e) => handle("map_address", e.target.value)} />
            </div>

            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
}
