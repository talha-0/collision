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

  const expenses = await prisma.expense.findMany({
    include: { branch: { select: { name: true, city: true } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { branchId, category, amount, description, date } = body;

  if (!branchId || !category || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      branchId,
      category,
      amount: parseFloat(amount),
      description: description || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
