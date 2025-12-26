import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

/* ----------------------------
   GLOBAL UTIL
---------------------------- */
import ScrollToTop from "@/components/ui/ScrollToTop";

/* ----------------------------
   LAYOUTS
---------------------------- */
import PublicLayout from "@/components/layout/PublicLayout";

/* ----------------------------
   PUBLIC PAGES
---------------------------- */
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* ----------------------------
   ADMIN PAGES
---------------------------- */
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Settings from "./pages/admin/Settings";
import AboutPage from "./pages/admin/AboutPage";
import ContactPageAdmin from "./pages/admin/ContactPageAdmin";
import MessagesPage from "./pages/admin/Messages";
import UserManagement from "./pages/admin/UserManagement";
import CategoriesPage from "./pages/admin/CategoriesPage";

/* ----------------------------
   QUERY CLIENT
---------------------------- */
const queryClient = new QueryClient();

/* ----------------------------
   ROUTER
---------------------------- */
function RouterWrapper() {
  return (
    <Routes>
      {/* ================= PUBLIC LAYOUT ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/products/new" element={<ProductForm />} />
      <Route path="/admin/products/edit/:id" element={<ProductForm />} />
      <Route path="/admin/products/:id/edit" element={<ProductForm />} />
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/about" element={<AboutPage />} />
      <Route path="/admin/contact" element={<ContactPageAdmin />} />
      <Route path="/admin/messages" element={<MessagesPage />} />
      <Route path="/admin/users" element={<UserManagement />} />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* ----------------------------
   APP ROOT
---------------------------- */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <RouterWrapper />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
