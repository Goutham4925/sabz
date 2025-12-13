import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config/api";

// 🔐 Decode JWT to get logged-in user
function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { id, email, role }
  } catch {
    return null;
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  // -------------------------------
  // LOAD USERS (SAFE)
  // -------------------------------
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 🔒 Token invalid / expired / user deleted
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      // 🛡️ Prevent crash
      if (!Array.isArray(data)) {
        console.error("Invalid users response:", data);
        setUsers([]);
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -------------------------------
  // USER ACTION HANDLER
  // -------------------------------
  const action = async (path: string, method = "PUT") => {
    try {
      const res = await fetch(`${API_URL}/admin${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      await loadUsers();
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 className="text-3xl font-display font-bold mb-6">
          User Management
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">
            No users found.
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((u) => (
              <div
                key={u.id}
                className="border p-4 rounded-xl flex justify-between items-center"
              >
                {/* USER INFO */}
                <div>
                  <p className="font-semibold text-lg">{u.email}</p>

                  <div className="flex gap-3 mt-1">
                    <Badge variant={u.isApproved ? "default" : "destructive"}>
                      {u.isApproved ? "Approved" : "Pending"}
                    </Badge>

                    <Badge variant="outline">
                      Role: {u.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  {!u.isApproved && (
                    <>
                      <Button onClick={() => action(`/approve/${u.id}`)}>
                        Approve
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() =>
                          action(`/reject/${u.id}`, "DELETE")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {u.role === "user" && u.isApproved && (
                    <Button
                      variant="secondary"
                      onClick={() => action(`/promote/${u.id}`)}
                    >
                      Promote to Admin
                    </Button>
                  )}

                  {u.role === "admin" && u.id !== currentUser?.id && (
                    <Button
                      variant="outline"
                      onClick={() => action(`/demote/${u.id}`)}
                    >
                      Demote Admin
                    </Button>
                  )}

                  {u.id !== currentUser?.id && (
                    <Button
                      variant="destructive"
                      onClick={() =>
                        action(`/delete/${u.id}`, "DELETE")
                      }
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
