import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter, log: ["error"] });

async function main() {
  console.log("🌱 Seeding Collision database…");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@collision.pk" },
    update: {},
    create: {
      email: "admin@collision.pk",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin:", admin.email);

  // Branches
  const branch1 = await prisma.branch.upsert({
    where: { id: "branch-dha" },
    update: {},
    create: {
      id: "branch-dha",
      name: "DHA Branch",
      address: "Phase 5, DHA, Karachi",
      city: "Karachi",
      phone: "+92 300 111 0001",
    },
  });

  const branch2 = await prisma.branch.upsert({
    where: { id: "branch-gulshan" },
    update: {},
    create: {
      id: "branch-gulshan",
      name: "Gulshan Branch",
      address: "Block 13D, Gulshan-e-Iqbal, Karachi",
      city: "Karachi",
      phone: "+92 300 111 0002",
    },
  });
  console.log("✅ Branches: DHA, Gulshan");

  // Seats — DHA
  for (let i = 1; i <= 10; i++) {
    await prisma.seat.upsert({
      where: { id: `dha-seat-${i}` },
      update: {},
      create: {
        id: `dha-seat-${i}`,
        label: `A-${String(i).padStart(2, "0")}`,
        branchId: branch1.id,
        type: i <= 4 ? "HOT_DESK" : i <= 8 ? "DEDICATED" : "PRIVATE_OFFICE",
        pricePerMonth: i <= 4 ? 1500 : i <= 8 ? 3000 : 8000,
      },
    });
  }

  // Seats — Gulshan
  for (let i = 1; i <= 8; i++) {
    await prisma.seat.upsert({
      where: { id: `gulshan-seat-${i}` },
      update: {},
      create: {
        id: `gulshan-seat-${i}`,
        label: `B-${String(i).padStart(2, "0")}`,
        branchId: branch2.id,
        type: i <= 3 ? "HOT_DESK" : i <= 6 ? "DEDICATED" : "PRIVATE_OFFICE",
        pricePerMonth: i <= 3 ? 1500 : i <= 6 ? 3000 : 8000,
      },
    });
  }
  console.log("✅ Seats: 18 total (10 DHA, 8 Gulshan)");

  // Demo client
  const clientPassword = await bcrypt.hash("client123", 10);
  const clientUser = await prisma.user.upsert({
    where: { email: "demo@collision.pk" },
    update: {},
    create: {
      email: "demo@collision.pk",
      name: "Demo Client",
      password: clientPassword,
      role: "CLIENT",
      client: {
        create: {
          branchId: branch1.id,
          company: "Demo Co.",
          phone: "+92 300 999 0000",
        },
      },
    },
  });
  console.log("✅ Demo client:", clientUser.email);

  // Sample expenses
  const expenseData = [
    { branchId: branch1.id, category: "RENT", amount: 150000, description: "Monthly rent — DHA" },
    { branchId: branch1.id, category: "UTILITIES", amount: 25000, description: "Electricity & water" },
    { branchId: branch2.id, category: "RENT", amount: 100000, description: "Monthly rent — Gulshan" },
    { branchId: branch2.id, category: "UTILITIES", amount: 18000, description: "Electricity & water" },
    { branchId: branch1.id, category: "SALARIES", amount: 80000, description: "Staff salaries" },
  ];

  for (const exp of expenseData) {
    await prisma.expense.create({ data: exp });
  }
  console.log("✅ Sample expenses created");

  // Sample invoice for demo client
  const demoClient = await prisma.client.findUnique({ where: { userId: clientUser.id } });
  if (demoClient) {
    await prisma.invoice.create({
      data: {
        clientId: demoClient.id,
        amount: 3000,
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        status: "PENDING",
        description: "June membership — Dedicated Desk",
      },
    });
    console.log("✅ Demo invoice created");
  }

  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin login:  admin@collision.pk / admin123");
  console.log("Client login: demo@collision.pk  / client123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
