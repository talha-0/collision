import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

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

  const invoices = await prisma.invoice.findMany({
    include: {
      client: {
        include: {
          user: { select: { name: true, email: true } },
          branch: { select: { name: true } },
        },
      },
      payments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, amount, dueDate, description } = body;

  if (!clientId || !amount || !dueDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const invoice = await prisma.invoice.create({
    data: { clientId, amount: parseFloat(amount), dueDate: new Date(dueDate), description },
  });

  return NextResponse.json(invoice, { status: 201 });
}
