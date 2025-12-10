import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async () => {
    if (!newCat.trim()) return;

    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat.trim() }),
    });

    if (!res.ok)
      return toast({ title: "Error", description: "Category exists", variant: "destructive" });

    toast({ title: "Added", description: "Category created" });
    setNewCat("");
    load();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete category? Products linked will show 'null'")) return;

    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok)
      return toast({ title: "Error", description: "Cannot delete", variant: "destructive" });

    toast({ title: "Deleted", description: "Category removed" });
    load();
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Add category */}
            <div className="flex gap-2">
              <Input
                placeholder="New category name"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              />
              <Button onClick={addCategory}>Add</Button>
            </div>

            {/* Categories list */}
            {loading ? (
              <Loader2 className="animate-spin h-6 w-6" />
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground">No categories yet.</p>
            ) : (
              <div className="space-y-3">
                {categories.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{c.name}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCategory(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
}
