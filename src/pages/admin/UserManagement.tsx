import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config/api";

// 🔐 Decode JWT to get logged-in user ID
function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return payload; // must include id, email, role
  } catch {
    return null;
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const currentUser = getCurrentUser(); // ⭐ Logged-in user

  const loadUsers = async () => {
    const res = await fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setUsers(await res.json());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const action = async (path: string, method = "PUT") => {
    await fetch(`${API_URL}/admin${path}`, {
      method,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    loadUsers();
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 className="text-3xl font-display font-bold mb-6">User Management</h1>

        <div className="space-y-4">
          {users.map((u: any) => (
            <div
              key={u.id}
              className="border p-4 rounded-xl flex justify-between items-center"
            >
              {/* User Info */}
              <div>
                <p className="font-semibold text-lg">{u.email}</p>

                <div className="flex gap-3 mt-1">
                  <Badge variant={u.isApproved ? "default" : "destructive"}>
                    {u.isApproved ? "Approved" : "Pending"}
                  </Badge>

                  <Badge variant="outline">Role: {u.role?.toUpperCase()}</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">

                {/* Approve / Reject */}
                {!u.isApproved && (
                  <Button onClick={() => action(`/approve/${u.id}`)}>
                    Approve
                  </Button>
                )}

                {!u.isApproved && (
                  <Button
                    variant="destructive"
                    onClick={() => action(`/reject/${u.id}`, "DELETE")}
                  >
                    Reject
                  </Button>
                )}

                {/* Promote user → admin */}
                {u.role === "user" && u.isApproved && (
                  <Button
                    variant="secondary"
                    onClick={() => action(`/promote/${u.id}`)}
                  >
                    Promote to Admin
                  </Button>
                )}

                {/* Demote admin → user
                    🚫 Prevent demoting yourself
                */}
                {u.role === "admin" && u.id !== currentUser?.id && (
                  <Button
                    variant="outline"
                    onClick={() => action(`/demote/${u.id}`)}
                  >
                    Demote Admin
                  </Button>
                )}

                {/* Delete User
                    🚫 Prevent deleting yourself (super important)
                */}
                {u.id !== currentUser?.id && (
                  <Button
                    variant="destructive"
                    onClick={() => action(`/delete/${u.id}`, "DELETE")}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
