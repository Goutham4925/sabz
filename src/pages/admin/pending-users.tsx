import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";

const API = "http://localhost:5000/api/admin";

export default function PendingUsers() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);

  const load = async () => {
    const r = await fetch(`${API}/pending-users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setPending(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    await fetch(`${API}/approve/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  const reject = async (id: string) => {
    await fetch(`${API}/reject/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-6">Pending Users</h1>

        <div className="space-y-4">
          {pending.map((u: any) => (
            <div key={u.id} className="p-4 border rounded-xl flex justify-between">
              <div>
                <p className="font-semibold">{u.email}</p>
                <p className="text-sm text-muted-foreground">Waiting for approval</p>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => approve(u.id)}>Approve</Button>
                <Button variant="destructive" onClick={() => reject(u.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
