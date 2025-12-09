import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API = "http://localhost:5000/api/admin";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const r = await fetch(API + "/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(await r.json());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const action = async (url: string, method = "PUT") => {
    await fetch(url, {
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
              {/* User info */}
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

              {/* Actions */}
              <div className="flex gap-2">
                
                {!u.isApproved && (
                  <Button onClick={() => action(`${API}/approve/${u.id}`)}>
                    Approve
                  </Button>
                )}

                {!u.isApproved && (
                  <Button
                    variant="destructive"
                    onClick={() => action(`${API}/reject/${u.id}`, "DELETE")}
                  >
                    Reject
                  </Button>
                )}

                {u.role === "user" && u.isApproved && (
                  <Button
                    variant="secondary"
                    onClick={() => action(`${API}/promote/${u.id}`)}
                  >
                    Promote to Admin
                  </Button>
                )}

                {u.role === "admin" && (
                  <Button
                    variant="outline"
                    onClick={() => action(`${API}/demote/${u.id}`)}
                  >
                    Demote Admin
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => action(`${API}/delete/${u.id}`, "DELETE")}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
