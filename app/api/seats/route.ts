import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const seats = await prisma.seat.findMany({
    include: {
      branch: { select: { name: true, city: true } },
      client: { include: { user: { select: { name: true } } } },
    },
    orderBy: { label: "asc" },
  });
  return NextResponse.json(seats);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { label, branchId, type, pricePerMonth } = body;

  if (!label || !branchId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const seat = await prisma.seat.create({
    data: { label, branchId, type: type || "DEDICATED", pricePerMonth: pricePerMonth || 0 },
  });

  return NextResponse.json(seat, { status: 201 });
}
