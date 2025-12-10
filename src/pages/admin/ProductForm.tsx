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
  category: z.string().min(1, "Category is required"),
  image_url: z.string().optional(),
  is_featured: z.boolean(),
});

const categories = ["Classic", "Premium", "Healthy", "Seasonal"];

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Classic",
    image_url: "",
    is_featured: false,
  });

  // ---------------------------------------------
  // ⭐ IMAGE UPLOAD HANDLER
  // ---------------------------------------------
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formBody = new FormData();
    formBody.append("image", file);

    // IMPORTANT: Send old image to delete
    if (formData.image_url) {
      formBody.append("oldImage", formData.image_url);
    }

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formBody,
      });

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        image_url: data.url,
      }));

      toast({
        title: "Image Updated!",
        description: "Old image deleted successfully.",
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Unable to upload image.",
        variant: "destructive",
      });
    }
  };


  // ---------------------------------------------
  // LOAD EXISTING PRODUCT
  // ---------------------------------------------
  useEffect(() => {
    if (!isEditing) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price?.toString() || "",
          category: data.category || "Classic",
          image_url: data.image_url || "",
          is_featured: data.is_featured || false,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
        navigate("/admin/products");
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  // ---------------------------------------------
  // SUBMIT HANDLER
  // ---------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    const token = localStorage.getItem("token");

    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      category: formData.category,
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
          body: JSON.stringify(productData),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      toast({
        title: "Success",
        description: `Product ${isEditing ? "updated" : "created"} successfully`,
      });

      navigate("/admin/products");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }

    setSaving(false);
  };

  // ---------------------------------------------
  // LOADING STATE
  // ---------------------------------------------
  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // ---------------------------------------------
  // FORM UI
  // ---------------------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-2xl">

          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {/* Title */}
          <h1 className="font-display text-3xl text-chocolate">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h1>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    rows={4}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="10.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="space-y-2">
                  <Label>Product Image</Label>

                  <div className="flex items-center gap-3">
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

                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("productUpload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                  </div>

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      className="w-32 h-32 object-cover rounded mt-2 border"
                    />
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label>Featured Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Appears on homepage highlights
                    </p>
                  </div>

                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                </div>

                {/* Submit */}
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
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />{" "}
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
};

export default ProductForm;
