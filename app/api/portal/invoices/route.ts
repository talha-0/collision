import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) return NextResponse.json([]);

  const invoices = await prisma.invoice.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(invoices);
}
