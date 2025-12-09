import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If true, only users with isAdmin === true are allowed.
   * If false, any authenticated user is allowed.
   */
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute
 *
 * - Shows a loading spinner while auth state is being fetched.
 * - If the user is not authenticated, redirects to /admin/login.
 * - If requireAdmin is true and the user is not an admin, redirects to /admin/login.
 * - Otherwise renders children.
 *
 * It preserves the attempted URL in location.state.from so the login page
 * can optionally redirect back after successful authentication.
 */
const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // only act once auth finished loading
    if (loading) return;

    // Not authenticated -> go to login
    if (!user) {
      navigate("/admin/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    // Authenticated but not admin (when required) -> go to login
    if (requireAdmin && !isAdmin) {
      navigate("/admin/login", { replace: true, state: { from: location.pathname } });
    }
  }, [user, isAdmin, loading, navigate, location.pathname, requireAdmin]);

  // While auth library is still checking token -> spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or not allowed, render nothing (we redirected above)
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // Authorized — render children
  return <>{children}</>;
};

export default ProtectedRoute;
