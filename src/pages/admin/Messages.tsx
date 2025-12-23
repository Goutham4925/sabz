import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Eye, Mail, Phone, Calendar, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

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
        <div className="space-y-6 w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-lg">
                Customer Messages & Enquiries
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
                  <p className="text-gray-500">Customer messages will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((m) => (
                    <Card 
                      key={m.id} 
                      className={`overflow-hidden ${m.is_read ? '' : 'border-yellow-200 bg-yellow-50/50'}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          {/* MESSAGE CONTENT */}
                          <div className="space-y-3 flex-1">
                            {/* HEADER WITH BADGES */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {!m.is_read && (
                                <Badge className="bg-red-500 text-white flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  Unread
                                </Badge>
                              )}
                              
                              {m.productId ? (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  Product Enquiry
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  General Message
                                </Badge>
                              )}
                            </div>

                            {/* SENDER INFO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="font-semibold text-sm text-gray-500">From</p>
                                <p className="font-medium">{m.name}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-gray-500">Contact</p>
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{m.email}</span>
                                </div>
                                {m.phone && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Phone className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm">{m.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* PRODUCT LINK (if applicable) */}
                            {m.productId && (
                              <div>
                                <p className="font-semibold text-sm text-gray-500">Product</p>
                                <Link
                                  to={`/products/${m.productId}`}
                                  className="inline-flex items-center gap-1 text-primary hover:underline"
                                >
                                  <Package className="h-3 w-3" />
                                  {m.productName || "View Product"}
                                </Link>
                              </div>
                            )}

                            {/* MESSAGE CONTENT */}
                            <div>
                              <p className="font-semibold text-sm text-gray-500">Subject</p>
                              <p className="font-medium">{m.subject}</p>
                            </div>

                            <div>
                              <p className="font-semibold text-sm text-gray-500">Message</p>
                              <p className="text-gray-700 mt-1 whitespace-pre-line">{m.message}</p>
                            </div>

                            {/* TIMESTAMP */}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>Received on {new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex flex-row lg:flex-col gap-2 pt-2 lg:pt-0 lg:border-l lg:pl-4">
                            {!m.is_read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsRead(m.id)}
                                disabled={readingId === m.id}
                                className="flex items-center gap-1 flex-1 lg:flex-none"
                              >
                                {readingId === m.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                                <span className="hidden sm:inline">Mark Read</span>
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteMessage(m.id)}
                              disabled={loadingId === m.id}
                              className="flex items-center gap-1 flex-1 lg:flex-none"
                            >
                              {loadingId === m.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}