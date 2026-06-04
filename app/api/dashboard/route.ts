import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalClients,
    activeClients,
    branches,
    pendingInvoices,
    overdueInvoices,
    recentPayments,
    expenses,
    totalSeats,
    occupiedSeats,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.branch.findMany({
      include: {
        _count: { select: { clients: true, seats: true } },
        expenses: { select: { amount: true } },
      },
    }),
    prisma.invoice.aggregate({ where: { status: "PENDING" }, _sum: { amount: true }, _count: true }),
    prisma.invoice.aggregate({ where: { status: "OVERDUE" }, _sum: { amount: true }, _count: true }),
    prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      take: 5,
      include: {
        invoice: {
          include: { client: { include: { user: { select: { name: true } } } } },
        },
      },
    }),
    prisma.expense.groupBy({
      by: ["branchId"],
      _sum: { amount: true },
    }),
    prisma.seat.count(),
    prisma.seat.count({ where: { status: "OCCUPIED" } }),
  ]);

  return NextResponse.json({
    totalClients,
    activeClients,
    branches,
    pendingInvoices: {
      count: pendingInvoices._count,
      total: pendingInvoices._sum.amount || 0,
    },
    overdueInvoices: {
      count: overdueInvoices._count,
      total: overdueInvoices._sum.amount || 0,
    },
    recentPayments,
    expenses,
    seats: { total: totalSeats, occupied: occupiedSeats, available: totalSeats - occupiedSeats },
  });
}
