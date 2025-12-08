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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const API_URL = "http://localhost:5000/api";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
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

  // -----------------------------------------------
  // LOAD PRODUCT FOR EDITING (FROM BACKEND)
  // -----------------------------------------------
  useEffect(() => {
    if (isEditing) {
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
    }
  }, [id, isEditing, navigate, toast]);

  // -----------------------------------------------
  // VALIDATE INPUT
  // -----------------------------------------------
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

  // -----------------------------------------------
  // SAVE PRODUCT (CREATE / UPDATE)
  // -----------------------------------------------
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
      const response = await fetch(
        isEditing
          ? `${API_URL}/products/${id}`
          : `${API_URL}/products`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) throw new Error("Failed to save product");

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

  // -----------------------------------------------
  // LOADING UI FOR EDIT MODE
  // -----------------------------------------------
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

  // -----------------------------------------------
  // FORM UI
  // -----------------------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 max-w-2xl">
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-3xl text-chocolate">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing
                ? "Update product information"
                : "Create a new product for your catalog"}
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Classic Butter Cookies"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="12.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/cookies.jpg"
                  />

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover mt-2 rounded-lg border"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/placeholder.svg")
                      }
                    />
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                  <div>
                    <Label>Featured Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Featured products appear on the homepage
                    </p>
                  </div>

                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
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
