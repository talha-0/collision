import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  if (role === "ADMIN") {
    const records = await prisma.attendance.findMany({
      where: clientId ? { clientId } : undefined,
      include: { client: { include: { user: { select: { name: true, email: true } } } } },
      orderBy: { checkIn: "desc" },
      take: 100,
    });
    return NextResponse.json(records);
  }

  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const records = await prisma.attendance.findMany({
    where: { clientId: client.id },
    orderBy: { checkIn: "desc" },
    take: 50,
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const body = await req.json();
  const { action } = body;

  if (action === "checkin") {
    const existing = await prisma.attendance.findFirst({
      where: { clientId: client.id, checkOut: null },
    });
    if (existing) {
      return NextResponse.json({ error: "Already checked in" }, { status: 400 });
    }
    const record = await prisma.attendance.create({
      data: { clientId: client.id, checkIn: new Date(), date: new Date() },
    });
    return NextResponse.json(record, { status: 201 });
  }

  if (action === "checkout") {
    const record = await prisma.attendance.findFirst({
      where: { clientId: client.id, checkOut: null },
      orderBy: { checkIn: "desc" },
    });
    if (!record) return NextResponse.json({ error: "No active check-in" }, { status: 400 });
    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data: { checkOut: new Date() },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
