import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Settings from "./pages/admin/Settings";
import AboutPage from "./pages/admin/AboutPage";
import ContactPageAdmin from "./pages/admin/ContactPageAdmin";
import MessagesPage from "./pages/admin/Messages";
import UserManagement from "./pages/admin/UserManagement";

// GLOBAL LOADING
import { LoadingProvider, useGlobalLoading } from "@/context/LoadingContext";
import UniversalLoader from "@/components/ui/UniversalLoader";

const queryClient = new QueryClient();

function RouterWrapper() {
  const { loading } = useGlobalLoading();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Show loader only on PUBLIC screens */}
      {!isAdmin && loading && <UniversalLoader />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ADMIN ROUTES (no loader) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/:id/edit" element={<ProductForm />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/about" element={<AboutPage />} />
        <Route path="/admin/contact" element={<ContactPageAdmin />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LoadingProvider>
            <RouterWrapper />
          </LoadingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
