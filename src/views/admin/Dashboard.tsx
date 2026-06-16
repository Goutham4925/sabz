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
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Clock,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const [productRes, userRes, msgRes, categoryRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/messages`),
        fetch(`${API_URL}/categories`),
      ]);


      const [products, users, messages, categories] = await Promise.all([
        productRes.json(),
        userRes.json(),
        msgRes.json(),
        categoryRes.json(),
      ]);


      const avgPrice =
        products.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0) /
        (products.length || 1);

      const pendingUsers = users.filter((u: any) => !u.isApproved).length;
      const admins = users.filter((u: any) => u.role === "admin").length;
      const unreadMessages = messages.filter((m: any) => !m.is_read).length;

      setStats({
        totalProducts: products.length,
        featuredProducts: products.filter((p: any) => p.is_featured).length,
        categories: categories.length,
        averagePrice: avgPrice,
        totalUsers: users.length,
        pendingUsers,
        admins,
        totalMessages: messages.length,
        unreadMessages,
        apiStatus: productRes.ok ? "Online" : "Offline",
        dbStatus: "Connected",
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const productStats = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Featured",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Avg Price",
      value: `₹${stats.averagePrice.toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const userStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Pending",
      value: stats.pendingUsers,
      icon: ShieldCheck,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Admins",
      value: stats.admins,
      icon: Users,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const messageStats = [
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: Mail,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Unread",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  const systemStats = [
    {
      title: "API Status",
      value: stats.apiStatus,
      icon: Server,
      color: stats.apiStatus === "Online" ? "text-emerald-600" : "text-red-600",
      bgColor: stats.apiStatus === "Online" ? "bg-emerald-50" : "bg-red-50",
    },
    {
      title: "Database",
      value: stats.dbStatus,
      icon: Database,
      color: stats.dbStatus === "Connected" ? "text-emerald-600" : "text-red-600",
      bgColor: stats.dbStatus === "Connected" ? "bg-emerald-50" : "bg-red-50",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create new product listing",
      icon: Plus,
      href: "/admin/products/new",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Users",
      description: "Approve & manage users",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "View Messages",
      description: "Check customer inquiries",
      icon: Mail,
      href: "/admin/messages",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Homepage Settings",
      description: "Configure website",
      icon: Home,
      href: "/admin/settings",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                className="flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                Refresh
              </Button>
              <Badge variant="outline" className="hidden sm:flex">
                <BarChart3 className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>

          {/* PRODUCT STATS */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {productStats.map((stat) => (
                <Card key={stat.title} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="text-xs text-gray-500">{stat.title}</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* USER & MESSAGE STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* USER STATS */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {userStats.map((stat) => (
                  <Card key={stat.title} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <span className="text-xs text-gray-500">{stat.title}</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* MESSAGE STATS */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Messages
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {messageStats.map((stat) => (
                  <Card key={stat.title} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <span className="text-xs text-gray-500">{stat.title}</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      {stat.title === "Unread" && stats.unreadMessages > 0 && (
                        <Badge variant="destructive" className="mt-2 text-xs">
                          Needs attention
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {systemStats.map((stat) => (
                <Card key={stat.title} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <span className="text-xs text-gray-500">{stat.title}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xl font-bold">{stat.value}</p>
                      {stat.value === "Online" || stat.value === "Connected" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.title}
                  href={action.href}
                  className="block"
                >
                  <Card className="border hover:border-gray-300 hover:shadow-md transition-all cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col items-center text-center h-full">
                      <div className={`p-3 rounded-full ${action.bgColor} mb-3`}>
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <h3 className="font-semibold text-base mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PRODUCTS SUMMARY */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Products</span>
                  <span className="font-semibold">{stats.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Featured</span>
                  <span className="font-semibold">{stats.featuredProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Categories</span>
                  <span className="font-semibold">{stats.categories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Average Price</span>
                  <span className="font-semibold">₹{stats.averagePrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* USERS SUMMARY */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Users</span>
                  <span className="font-semibold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Pending Approval</span>
                  <span className="font-semibold">{stats.pendingUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Admins</span>
                  <span className="font-semibold">{stats.admins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Regular Users</span>
                  <span className="font-semibold">{stats.totalUsers - stats.admins}</span>
                </div>
              </CardContent>
            </Card>

            {/* MESSAGES SUMMARY */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Messages Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Messages</span>
                  <span className="font-semibold">{stats.totalMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Unread</span>
                  <span className="font-semibold">{stats.unreadMessages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Read</span>
                  <span className="font-semibold">{stats.totalMessages - stats.unreadMessages}</span>
                </div>
                {stats.unreadMessages > 0 && (
                  <div className="pt-2">
                    <Badge variant="destructive" className="flex items-center gap-1 w-full justify-center">
                      <AlertCircle className="h-3 w-3" />
                      {stats.unreadMessages} unread messages
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}