import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Cookie,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Mail,
  MessageCircle,
  Users,
  Tags,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from "@/config/api";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/settings', label: 'Homepage', icon: Home },
  { path: '/admin/categories', label: 'Categories', icon: Tags },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/about', label: 'About Page', icon:  BookOpen },
  { path: '/admin/contact', label: 'Contact Page', icon: Mail },
  { path: '/admin/messages', label: 'Messages', icon: MessageCircle },
  { path: '/admin/users', label: 'Users', icon: Users },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Load site settings (logo + brand image)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const r = await fetch(`${API_URL}/settings`);
        const data = await r.json();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const logo = settings?.navbar_logo;
  const brandImage = settings?.navbar_brand_image;

  return (
    <div className="min-h-screen bg-muted/30">

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logo ? (
            <img src={logo} className="h-8 w-auto object-contain" />
          ) : (
            <img src="https://res.cloudinary.com/dglumbcje/image/upload/v1766763015/saabz_kitchen/0769bd28-050c-4886-a8f6-d3714a683ce2.png" className="h-8 w-auto object-contain" />
          )}
          <span className="font-display text-lg text-chocolate">Admin</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          
          {/* LOGO BLOCK */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">

              {/* MAIN LOGO */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img
                    src={logo}
                    className="object-contain w-full h-full"
                    alt="Admin Logo"
                  />
                ) : (
                  <img src="https://res.cloudinary.com/dglumbcje/image/upload/v1766763015/saabz_kitchen/0769bd28-050c-4886-a8f6-d3714a683ce2.png" className="object-contain w-full h-full" />
                )}
              </div>

              {/* BRAND AREA */}
              <div>
                {brandImage && (
                  <img
                    src={brandImage}
                    className="h-6 w-auto object-contain mb-1"
                    alt="Brand"
                  />
                )}

                <span className="font-display text-lg text-chocolate block">
                  Saabz Kitchen
                </span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>

            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* FOOTER LINKS */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              View Site
            </Link>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

    </div>
  );
};

export default AdminLayout;
