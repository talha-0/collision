import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
      branch: { select: { id: true, name: true, city: true } },
      seats: { select: { id: true, label: true, type: true } },
      invoices: { select: { id: true, amount: true, status: true, dueDate: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, branchId, company, phone } = body;

  if (!name || !email || !password || !branchId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "CLIENT",
      client: {
        create: { branchId, company: company || null, phone: phone || null },
      },
    },
    include: { client: true },
  });

  return NextResponse.json(user, { status: 201 });
}
