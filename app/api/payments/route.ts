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

  const payments = await prisma.payment.findMany({
    include: {
      invoice: {
        include: {
          client: {
            include: {
              user: { select: { name: true, email: true } },
              branch: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { paidAt: "desc" },
  });

  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { invoiceId, amount, method, notes } = body;

  if (!invoiceId || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: parseFloat(amount),
      method: method || "CASH",
      notes: notes || null,
    },
  });

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID" },
  });

  return NextResponse.json(payment, { status: 201 });
}
