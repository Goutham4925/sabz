import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEnquiryMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message, productId, address, products } = await req.json();

    let enrichedSubject = subject;
    let enrichedMessage = message;
    let productName: string | null = null;

    if (Array.isArray(products) && products.length > 0) {
      const lines = products.map(
        (p: { name: string; quantity: number; price?: number }) =>
          `• ${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ""}${p.price ? ` — ₹${(p.price * p.quantity).toFixed(2)}` : ""}`
      );
      enrichedSubject = subject || `Cart Enquiry — ${products.length} product(s)`;
      enrichedMessage = ["Products requested:", ...lines, "", address ? `Delivery address: ${address}` : "", message ? `Note: ${message}` : ""]
        .filter((l) => l !== undefined).join("\n").trim();
    } else if (productId) {
      const product = await prisma.product.findUnique({ where: { id: Number(productId) }, select: { name: true } });
      if (product) {
        productName = product.name;
        enrichedSubject = subject || `Enquiry about ${product.name}`;
        enrichedMessage = message || `Customer requested information about "${product.name}".`;
      }
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name, email: email || null, phone: phone || null,
        subject: enrichedSubject, message: enrichedMessage,
        productId: productId ? Number(productId) : null,
        productName, address: address || null,
        products: Array.isArray(products) && products.length > 0 ? products : undefined,
        is_read: false,
      },
    });

    sendEnquiryMail({
      name, email, phone, address, subject: enrichedSubject, message: enrichedMessage,
      products: Array.isArray(products) && products.length > 0 ? products : null,
    }).catch((err) => console.error("Mail send error:", err.message));

    return NextResponse.json({ success: true, message: "Message stored", saved });
  } catch (err) {
    console.error("Failed saving message:", err);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(messages);
  } catch (err) {
    console.error("Load messages error:", err);
    return NextResponse.json({ error: "Failed loading messages" }, { status: 500 });
  }
}
