import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const API_URL = "http://localhost:5000/api";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  categoryId: z.number().nullable(),
  image_url: z.string().optional(),
  is_featured: z.boolean(),
});

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: null as number | null,
    image_url: "",
    is_featured: false,
  });

  // ---------------------------------------------
  // LOAD CATEGORIES FROM BACKEND
  // ---------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => console.error("Failed to load categories"));
  }, []);

  // ---------------------------------------------
  // LOAD EXISTING PRODUCT FOR EDITING
  // ---------------------------------------------
  useEffect(() => {
    if (!isEditing) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price?.toString() || "",
          categoryId: data.categoryId || null,
          image_url: data.image_url || "",
          is_featured: data.is_featured || false,
        });
      })
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        })
      )
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------------------------------------
  // IMAGE UPLOAD WITH OLD IMAGE DELETE
  // ---------------------------------------------
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formBody = new FormData();
    formBody.append("image", file);

    if (formData.image_url) {
      formBody.append("oldImage", formData.image_url);
    }

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formBody,
      });

      const out = await res.json();

      setFormData((prev) => ({
        ...prev,
        image_url: out.url,
      }));

      toast({ title: "Image Updated", description: "Upload successful" });
    } catch {
      toast({
        title: "Upload Failed",
        description: "Could not upload image.",
        variant: "destructive",
      });
    }
  };

  // ---------------------------------------------
  // VALIDATION
  // ---------------------------------------------
  const validateForm = () => {
    try {
      productSchema.parse({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((e) => (fieldErrors[e.path[0]] = e.message));
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  // ---------------------------------------------
  // SAVE PRODUCT
  // ---------------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const token = localStorage.getItem("token");

    const body = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      image_url: formData.image_url || null,
      is_featured: formData.is_featured,
    };

    try {
      const res = await fetch(
        isEditing ? `${API_URL}/products/${id}` : `${API_URL}/products`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: `Product ${isEditing ? "updated" : "created"}`,
      });

      navigate("/admin/products");
    } catch {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  if (loading)
    return (
      <ProtectedRoute>
        <AdminLayout>
          <Loader2 className="animate-spin h-8 w-8 mx-auto mt-20" />
        </AdminLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-2xl space-y-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          <h1 className="font-display text-3xl">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                
                {/* NAME */}
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* PRICE + CATEGORY */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Category</Label>

                    <Select
                      value={formData.categoryId?.toString() || ""}
                      onValueChange={(val) =>
                        setFormData({ ...formData, categoryId: Number(val) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div>
                  <Label>Product Image</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />
                    <input
                      type="file"
                      id="productUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUpload}
                    />
                    <Button type="button" onClick={() => document.getElementById("productUpload")?.click()}>
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>

                  {formData.image_url && (
                    <img src={formData.image_url} className="w-32 h-32 rounded mt-2 object-cover" />
                  )}
                </div>

                {/* FEATURED */}
                <div className="flex items-center justify-between p-4 rounded border bg-muted/30">
                  <div>
                    <Label>Featured Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Appears on homepage.
                    </p>
                  </div>

                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, is_featured: val })
                    }
                  />
                </div>

                {/* SAVE */}
                <Button disabled={saving} type="submit" variant="hero">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default ProductForm;
