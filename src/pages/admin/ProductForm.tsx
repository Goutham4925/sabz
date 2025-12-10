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
import {
  ArrowLeft,
  Loader2,
  Save,
  Upload,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const API_URL = "http://localhost:5000/api";

/* ---------------------------------------------
   VALIDATION SCHEMA
--------------------------------------------- */
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().optional()
  ),
  categoryId: z.string().optional(),
  image_url: z.string().optional(),
  is_featured: z.boolean().optional(),
  ingredients: z.string().optional(),
  highlights: z.string().optional(),
  nutrition_info: z.string().optional(),
  shelf_life: z.string().optional(),
  weight: z.string().optional(),
  package_type: z.string().optional(),
});

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
interface GalleryImage {
  id: number;
  url: string;
}

interface FormDataType {
  name: string;
  description: string;
  price: string | number;
  categoryId: string;
  image_url: string;
  is_featured: boolean;
  ingredients: string;
  highlights: string;
  nutrition_info: string;
  shelf_life: string;
  weight: string;
  package_type: string;
}

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  /* ---------------------------------------------
     STATE
  --------------------------------------------- */
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    description: "",
    price: "",
    categoryId: "none",
    image_url: "",
    is_featured: false,
    ingredients: "",
    highlights: "",
    nutrition_info: "",
    shelf_life: "",
    weight: "",
    package_type: "",
  });

  /* ---------------------------------------------
     FETCH CATEGORIES
  --------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        setCategories(await res.json());
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  /* ---------------------------------------------
     LOAD PRODUCT IF EDITING
  --------------------------------------------- */
  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      setLoading(true);

      const res = await fetch(`${API_URL}/products/${id}`);
      const data = await res.json();

      setFormData({
        name: data.name,
        description: data.description || "",
        price: data.price || "",
        categoryId: data.category?.id ? String(data.category.id) : "none",
        image_url: data.image_url || "",
        is_featured: data.is_featured,
        ingredients: data.ingredients || "",
        highlights: data.highlights || "",
        nutrition_info: data.nutrition_info || "",
        shelf_life: data.shelf_life || "",
        weight: data.weight || "",
        package_type: data.package_type || "",
      });

      setGallery(data.images || []);
      setLoading(false);
    })();
  }, [id]);

  /* ---------------------------------------------
     UPLOAD MAIN IMAGE
  --------------------------------------------- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    if (formData.image_url) {
      form.append("oldImage", formData.image_url);
    }

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: form,
    });

    const out = await res.json();
    setFormData((prev) => ({ ...prev, image_url: out.url }));

    toast({ title: "Uploaded main image" });
  };

  /* ---------------------------------------------
     UPLOAD MULTIPLE GALLERY IMAGES
  --------------------------------------------- */
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    if (!isEditing) {
      return toast({
        title: "Save product first",
        description: "You can upload gallery images after product is created.",
        variant: "destructive",
      });
    }

    for (const file of files) {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch(`${API_URL}/product-images/${id}`, {
        method: "POST",
        body: form,
      });

      const img: GalleryImage = await res.json();
      setGallery((prev) => [...prev, img]);
    }

    toast({ title: "Gallery images uploaded" });
  };

  /* ---------------------------------------------
     DELETE GALLERY IMAGE
  --------------------------------------------- */
  const deleteGalleryImage = async (imageId: number) => {
    await fetch(`${API_URL}/product-images/${imageId}`, { method: "DELETE" });
    setGallery((prev) => prev.filter((img) => img.id !== imageId));
  };

  /* ---------------------------------------------
     VALIDATE FORM
  --------------------------------------------- */
  const validateForm = () => {
    try {
      productSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err: any) {
      const errObj: Record<string, string> = {};
      err.errors?.forEach((e: any) => {
        errObj[e.path[0]] = e.message;
      });
      setErrors(errObj);
      return false;
    }
  };

  /* ---------------------------------------------
     SUBMIT FORM
  --------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const payload = {
      ...formData,
      price: formData.price ? Number(formData.price) : null,
      categoryId:
        formData.categoryId === "none" ? null : Number(formData.categoryId),
    };

    const res = await fetch(
      isEditing ? `${API_URL}/products/${id}` : `${API_URL}/products`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const saved = await res.json();

    if (!isEditing) return navigate(`/admin/products/edit/${saved.id}`);

    navigate("/admin/products");
    toast({ title: "Saved successfully" });
    setSaving(false);
  };

  /* ---------------------------------------------
     LOADING STATE
  --------------------------------------------- */
  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-3xl space-y-6">
          <Button variant="ghost" onClick={() => navigate("/admin/products")}>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NAME */}
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
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
                      value={formData.categoryId}
                      onValueChange={(v) =>
                        setFormData({ ...formData, categoryId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
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

                {/* MAIN IMAGE */}
                <div>
                  <Label>Main Image</Label>

                  <div className="flex gap-3">
                    <Input
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />

                    <input
                      type="file"
                      id="uploadMain"
                      className="hidden"
                      accept="image/*"
                      onChange={handleUpload}
                    />

                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("uploadMain")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      className="w-32 h-32 mt-3 rounded object-cover shadow"
                    />
                  )}
                </div>

                {/* GALLERY UPLOAD */}
                {isEditing && (
                  <div>
                    <Label>Gallery Images</Label>

                    <input
                      type="file"
                      id="uploadGallery"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                    />

                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() =>
                        document.getElementById("uploadGallery")?.click()
                      }
                    >
                      <ImagePlus className="h-4 w-4 mr-1" /> Upload Gallery Images
                    </Button>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {gallery.map((img) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.url}
                            className="w-full h-28 object-cover rounded"
                          />

                          <button
                            type="button"
                            onClick={() => deleteGalleryImage(img.id)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FEATURED */}
                <div className="flex justify-between bg-muted p-4 rounded items-center">
                  <Label>Featured Product</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) =>
                      setFormData({ ...formData, is_featured: v })
                    }
                  />
                </div>

                {/* EXTRA FIELDS */}
                <div className="space-y-4">
                  <Label>Ingredients</Label>
                  <Textarea
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

                {/* SUBMIT BUTTONS */}
                <div className="flex gap-3 pt-4">
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
