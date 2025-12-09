import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:5000/api/messages";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setMessages);
  }, []);

  const deleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setLoadingId(id);

    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: "Deleted",
        description: "Message was removed successfully.",
      });
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
            <CardTitle>Customer Messages</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {messages.length === 0 && <p>No messages yet.</p>}

            {messages.map((m) => (
              <div
                key={m.id}
                className="border p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <p><strong>Name:</strong> {m.name}</p>
                  <p><strong>Email:</strong> {m.email}</p>
                  <p><strong>Subject:</strong> {m.subject}</p>
                  <p><strong>Message:</strong> {m.message}</p>
                  <p className="text-xs text-muted-foreground">
                    Sent on {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  className="ml-4"
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
            ))}
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
}
