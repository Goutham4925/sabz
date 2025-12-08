import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, Eye } from "lucide-react";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: 0,
    averagePrice: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const products = await res.json();

        if (Array.isArray(products)) {
          const categories = new Set(products.map((p) => p.category));

          const avgPrice =
            products.reduce((sum, p) => sum + Number(p.price || 0), 0) /
            (products.length || 1);

          setStats({
            totalProducts: products.length,
            featuredProducts: products.filter((p) => p.is_featured).length,
            categories: categories.size,
            averagePrice: avgPrice || 0,
          });
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Featured Products",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Avg. Price",
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-3xl text-chocolate">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back to Golden Crust admin panel
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.title} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/products/new"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Add New Product</p>
              </a>

              <a
                href="/admin/products"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Products</p>
              </a>

              <a
                href="/admin/settings"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Site Settings</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
