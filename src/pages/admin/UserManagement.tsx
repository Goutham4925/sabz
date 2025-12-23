import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  UserCog,
  UserMinus,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Users,
  Loader2
} from "lucide-react";
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
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
  const handleAction = async (path: string, method = "PUT", userId: string) => {
    setActionLoading(userId);
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
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8 w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-500 text-sm">
              Manage user permissions and approvals
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <Card>
              <CardContent className="py-20 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                <p className="text-muted-foreground">
                  There are no users in the system yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* USER INFO */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{user.email}</p>
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          {/* <p className="text-sm text-gray-500">
                            ID: {user.id}
                          </p> */}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={user.isApproved ? "default" : "destructive"}
                            className="flex items-center gap-1"
                          >
                            {user.isApproved ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Approved
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>

                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {user.role === "admin" ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </>
                            ) : (
                              <>
                                <Users className="h-3 w-3" />
                                User
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Approve/Reject for pending users */}
                        {!user.isApproved && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAction(`/approve/${user.id}`, "PUT", user.id)}
                              disabled={actionLoading === user.id}
                              className="flex items-center gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAction(`/reject/${user.id}`, "DELETE", user.id)}
                              disabled={actionLoading === user.id}
                              className="flex items-center gap-1"
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}

                        {/* Promote/Demote for approved users */}
                        {user.isApproved && (
                          <>
                            {user.role === "user" && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAction(`/promote/${user.id}`, "PUT", user.id)}
                                disabled={actionLoading === user.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <UserCog className="h-3 w-3" />
                                )}
                                Promote to Admin
                              </Button>
                            )}

                            {user.role === "admin" && user.id !== currentUser?.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(`/demote/${user.id}`, "PUT", user.id)}
                                disabled={actionLoading === user.id}
                                className="flex items-center gap-1"
                              >
                                {actionLoading === user.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <UserMinus className="h-3 w-3" />
                                )}
                                Demote to User
                              </Button>
                            )}
                          </>
                        )}

                        {/* Delete button (except current user) */}
                        {user.id !== currentUser?.id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(`/delete/${user.id}`, "DELETE", user.id)}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${user.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-gray-600">
                          Status: {user.isApproved ? 'Active' : 'Awaiting Approval'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                          Last updated: {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {/* {users.length > 0 && (
            <Card className="mt-8">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {users.filter(u => u.isApproved).length}
                    </p>
                    <p className="text-sm text-gray-500">Approved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {users.filter(u => !u.isApproved).length}
                    </p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                    <p className="text-sm text-gray-500">Admins</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}