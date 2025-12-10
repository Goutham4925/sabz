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

// ZOD VALIDATION SCHEMA
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
  categoryId: z.string().optional(),
  image_url: z.string().optional(),
  is_featured: z.boolean().optional(),

  // New product detail fields
  ingredients: z.string().optional(),
  highlights: z.string().optional(),
  nutrition_info: z.string().optional(),
  shelf_life: z.string().optional(),
  weight: z.string().optional(),
  package_type: z.string().optional(),
});

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    categoryId: "none", // FIX: VALID SELECT VALUE
    image_url: "",
    is_featured: false,

    // new fields
    ingredients: "",
    highlights: "",
    nutrition_info: "",
    shelf_life: "",
    weight: "",
    package_type: "",
  });

  // ------------------------------
  // FETCH CATEGORIES
  // ------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data || []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // ------------------------------
  // LOAD PRODUCT IF EDIT MODE
  // ------------------------------
  useEffect(() => {
    if (!isEditing) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    (async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ? String(data.price) : "",
          categoryId: data.category?.id ? String(data.category.id) : "none",
          image_url: data.image_url || "",
          is_featured: !!data.is_featured,

          ingredients: data.ingredients || "",
          highlights: data.highlights || "",
          nutrition_info: data.nutrition_info || "",
          shelf_life: data.shelf_life || "",
          weight: data.weight || "",
          package_type: data.package_type || "",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ------------------------------
  // IMAGE UPLOAD
  // ------------------------------
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    if (formData.image_url) {
      form.append("oldImage", formData.image_url);
    }

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form,
      });

      const out = await res.json();
      setFormData((prev: any) => ({ ...prev, image_url: out.url }));

      toast({ title: "Image uploaded" });
    } catch {
      toast({
        title: "Upload failed",
        variant: "destructive",
      });
    }
  };

  // ------------------------------
  // FORM VALIDATION
  // ------------------------------
  const validateForm = () => {
    try {
      const toValidate = { ...formData };
      productSchema.parse(toValidate);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: any = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  // ------------------------------
  // SUBMIT FORM
  // ------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? Number(formData.price) : null,

      categoryId:
        formData.categoryId === "none" ? null : Number(formData.categoryId),

      image_url: formData.image_url || null,
      is_featured: !!formData.is_featured,

      ingredients: formData.ingredients || null,
      highlights: formData.highlights || null,
      nutrition_info: formData.nutrition_info || null,
      shelf_life: formData.shelf_life || null,
      weight: formData.weight || null,
      package_type: formData.package_type || null,
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
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: `Product ${isEditing ? "updated" : "created"}!`,
      });

      navigate("/admin/products");
    } catch {
      toast({
        title: "Save failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-3xl space-y-6">
          <Button variant="ghost" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="font-display text-3xl">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NAME */}
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
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

                  {/* FIXED CATEGORY SELECT */}
                  <div>
                    <Label>Category</Label>

                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="none">Uncategorized</SelectItem>

                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* IMAGE */}
                <div>
                  <Label>Product Image</Label>

                  <div className="flex gap-3">
                    <Input
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image_url: e.target.value,
                        })
                      }
                    />

                    <input
                      type="file"
                      id="uploadImg"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUpload}
                    />

                    <Button type="button" onClick={() => document.getElementById("uploadImg")?.click()}>
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      className="w-32 h-32 mt-2 object-cover rounded"
                    />
                  )}
                </div>

                {/* FEATURED */}
                <div className="flex justify-between items-center p-4 bg-muted rounded">
                  <div>
                    <Label>Featured Product</Label>
                  </div>

                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, is_featured: v })
                    }
                  />
                </div>

                {/* NEW PRODUCT DETAIL FIELDS */}
                <div className="space-y-4">
                  <Label>Ingredients (comma separated)</Label>
                  <Textarea
                    rows={3}
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                  />

                  <Label>Highlights</Label>
                  <Input
                    value={formData.highlights}
                    onChange={(e) =>
                      setFormData({ ...formData, highlights: e.target.value })
                    }
                  />

                  <Label>Nutrition Info</Label>
                  <Textarea
                    rows={4}
                    value={formData.nutrition_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nutrition_info: e.target.value,
                      })
                    }
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Shelf Life</Label>
                      <Input
                        value={formData.shelf_life}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shelf_life: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Weight</Label>
                      <Input
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Package Type</Label>
                      <Input
                        value={formData.package_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            package_type: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" variant="hero" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isEditing ? "Update Product" : "Create Product"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
