import { useState, useEffect, createContext, useContext } from "react";
import { API_URL } from "@/config/api";

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

// UNIVERSAL SIGNUP SWITCH
const ALLOW_SIGNUP = true;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // LOAD USER FROM TOKEN
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Invalid token");

      const data = await res.json();
      setUser(data);
      setIsAdmin(data.role === "admin");
    } catch {
      setUser(null);
      setIsAdmin(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // LOGIN
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.message || "Login failed" };
      }

      localStorage.setItem("token", data.token);
      await fetchUser();

      return { error: null };
    } catch {
      return { error: "Network error" };
    }
  };

  // SIGNUP
  const signUp = async (email: string, password: string) => {
    if (!ALLOW_SIGNUP) return { error: "Signup is disabled" };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { error: data.message || "Registration failed" };

      return { error: null };
    } catch {
      return { error: "Network error" };
    }
  };

  // LOGOUT
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
