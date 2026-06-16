import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken, getTokenFromRequest } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const body = await req.json();

  if (action === "login") {
    const { email, password } = body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
      if (!user.isApproved) return NextResponse.json({ message: "Account pending approval" }, { status: 403 });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return NextResponse.json({ message: "Login successful", token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }

  if (action === "register") {
    const { email, password } = body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ message: "User already exists" }, { status: 400 });

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { email, password: hashed, role: "user", isApproved: false } });
      return NextResponse.json({ message: "Signup successful. Waiting for admin approval.", user: { id: user.id, email: user.email, isApproved: user.isApproved } });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Unknown action" }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "Missing token" }, { status: 401 });
  try {
    const decoded = verifyToken(token);
    return NextResponse.json(decoded);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
