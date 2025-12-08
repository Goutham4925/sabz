import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // --------------------------------------------------------
  // FETCH USER INFO FROM BACKEND USING STORED JWT
  // --------------------------------------------------------
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Auth failed");

      const data = await res.json();
      setUser(data);

      // Determine admin role
      setIsAdmin(data.role === "admin");
    } catch (err) {
      setUser(null);
      setIsAdmin(false);
    }

    setLoading(false);
  };

  // Load user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // --------------------------------------------------------
  // LOGIN → POST /api/auth/login
  // --------------------------------------------------------
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      await fetchUser();

      return { error: null };
    } catch {
      return { error: "Network error" };
    }
  };

  // --------------------------------------------------------
  // REGISTER → POST /api/auth/register
  // --------------------------------------------------------
  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Registration failed" };
      }

      // Auto login after signup
      localStorage.setItem("token", data.token);

      await fetchUser();

      return { error: null };
    } catch {
      return { error: "Network error" };
    }
  };

  // --------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume Auth context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
