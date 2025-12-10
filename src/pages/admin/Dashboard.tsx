import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Package,
  TrendingUp,
  Eye,
  DollarSign,
  Users,
  ShieldCheck,
  Mail,
  MessageSquare,
  Server,
  Database,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: 0,
    averagePrice: 0,

    totalUsers: 0,
    pendingUsers: 0,
    admins: 0,

    totalMessages: 0,
    unreadMessages: 0,

    apiStatus: "Online",
    dbStatus: "Connected",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");

    try {
      // Fetch Products
      const productRes = await fetch(`${API}/products`);
      const products = await productRes.json();

      const categories = new Set(products.map((p: any) => p.category));
      const avgPrice =
        products.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0) /
        (products.length || 1);

      // Fetch Users
      const userRes = await fetch(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await userRes.json();

      const pending = users.filter((u: any) => !u.isApproved).length;
      const admins = users.filter((u: any) => u.role === "admin").length;

      // Fetch Messages
      const msgRes = await fetch(`${API}/messages`);
      const messages = await msgRes.json();

      const unread = messages.filter((m: any) => !m.is_read).length;

      setStats({
        totalProducts: products.length,
        featuredProducts: products.filter((p: any) => p.is_featured).length,
        categories: categories.size,
        averagePrice: avgPrice,

        totalUsers: users.length,
        pendingUsers: pending,
        admins,

        totalMessages: messages.length,
        unreadMessages: unread,

        apiStatus: "Online",
        dbStatus: "Connected",
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  const statCards = [
    { title: "Total Products", value: stats.totalProducts, icon: Package },
    { title: "Featured Products", value: stats.featuredProducts, icon: TrendingUp },
    { title: "Categories", value: stats.categories, icon: Eye },
    {
      title: "Avg Price",
      value: `₹${stats.averagePrice.toFixed(2)}`,
      icon: DollarSign,
    },

    { title: "Total Users", value: stats.totalUsers, icon: Users },
    { title: "Pending Users", value: stats.pendingUsers, icon: ShieldCheck },
    { title: "Admins", value: stats.admins, icon: Users },

    { title: "Messages", value: stats.totalMessages, icon: Mail },
    { title: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare },

    { title: "API Status", value: stats.apiStatus, icon: Server },
    { title: "Database", value: stats.dbStatus, icon: Database },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-10">
          <div>
            <h1 className="font-display text-4xl text-chocolate">Dashboard</h1>
            <p className="text-muted-foreground">Admin overview and insights</p>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {statCards.map((s) => (
              <Card key={s.title} className="border-border/50">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-sm text-muted-foreground">
                    {s.title}
                  </CardTitle>
                  <s.icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used admin tools</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/products/new"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Add New Product</p>
              </a>

              <a
                href="/admin/users"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Manage Users</p>
              </a>

              <a
                href="/admin/messages"
                className="p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">View Messages</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
