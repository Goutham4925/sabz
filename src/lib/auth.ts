import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
}

export function getTokenFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  return auth.split(" ")[1] || null;
}

export async function requireAdmin(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "No token provided" }, { status: 401 });

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 401 });
    if (!user.isApproved) return NextResponse.json({ message: "Account not approved" }, { status: 403 });
    if (user.role !== "admin") return NextResponse.json({ message: "Admin only" }, { status: 403 });
    return null; // authorized
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

export async function requireAuth(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return { error: NextResponse.json({ message: "No token" }, { status: 401 }), user: null };

  try {
    const decoded = verifyToken(token);
    return { error: null, user: decoded };
  } catch {
    return { error: NextResponse.json({ message: "Invalid token" }, { status: 401 }), user: null };
  }
}
