import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

// const API_URL = "http://localhost:5000/api/messages";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [readingId, setReadingId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const res = await fetch(`${API_URL}/messages`);
    setMessages(await res.json());
  };

  const markAsRead = async (id: number) => {
    setReadingId(id);

    const res = await fetch(`${API_URL}/messages/${id}/read`, { method: "PUT" });

    if (res.ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      toast({ title: "Message marked as read" });
    } else {
      toast({
        title: "Error",
        description: "Failed to update message.",
        variant: "destructive",
      });
    }

    setReadingId(null);
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    setLoadingId(id);

    const res = await fetch(`${API_URL}/messages/${id}`, { method: "DELETE" });

    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Deleted", description: "Message removed." });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }

    setLoadingId(null);
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Card>
          <CardHeader>
            <CardTitle>
              Customer Messages & Product Enquiries
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {messages.length === 0 && <p>No messages yet.</p>}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`border p-4 rounded-lg flex justify-between items-start ${
                  m.is_read ? "bg-muted/40" : "bg-yellow-50"
                }`}
              >
                <div className="space-y-2">

                  {!m.is_read && (
                    <Badge className="bg-red-500 text-white">Unread</Badge>
                  )}

                  {/* TYPE BADGE */}
                  {m.productId ? (
                    <Badge className="bg-primary/10 text-primary">
                      Product Enquiry
                    </Badge>
                  ) : (
                    <Badge variant="secondary">General Message</Badge>
                  )}

                  <p><strong>Name:</strong> {m.name}</p>
                  <p><strong>Email:</strong> {m.email}</p>
                  {m.phone && <p><strong>Phone:</strong> {m.phone}</p>}

                  {m.productId && (
                    <p>
                      <strong>Product:</strong>{" "}
                      <Link
                        to={`/products/${m.productId}`}
                        className="text-primary underline"
                      >
                        {m.productName || "View Product"}
                      </Link>
                    </p>
                  )}

                  <p><strong>Subject:</strong> {m.subject}</p>
                  <p><strong>Message:</strong> {m.message}</p>

                  <p className="text-xs text-muted-foreground">
                    Sent on {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {!m.is_read && (
                    <Button
                      variant="outline"
                      onClick={() => markAsRead(m.id)}
                      disabled={readingId === m.id}
                    >
                      {readingId === m.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      Mark Seen
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => deleteMessage(m.id)}
                    disabled={loadingId === m.id}
                  >
                    {loadingId === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
}
