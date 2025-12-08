import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const API = "http://localhost:5000/api/messages";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setMessages);
  }, []);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <Card>
          <CardHeader>
            <CardTitle>Customer Messages</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {messages.length === 0 && <p>No messages yet.</p>}

            {messages.map((m: any) => (
              <div key={m.id} className="border p-4 rounded-lg">
                <p><strong>Name:</strong> {m.name}</p>
                <p><strong>Email:</strong> {m.email}</p>
                <p><strong>Subject:</strong> {m.subject}</p>
                <p><strong>Message:</strong> {m.message}</p>
                <p className="text-xs text-muted-foreground">Sent on {new Date(m.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </AdminLayout>
    </ProtectedRoute>
  );
}
