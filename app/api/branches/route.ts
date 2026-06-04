import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, address, city, phone } = body;

  if (!name || !address || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const branch = await prisma.branch.create({
    data: { name, address, city, phone: phone || null },
  });

  return NextResponse.json(branch, { status: 201 });
}
