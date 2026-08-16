// Standalone script to seed the admin account
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log("Seeding admin account...");

  const hashedPassword = await bcrypt.hash("adminLAGROUP", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: hashedPassword },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin account seeded successfully!");
  console.log("   Username: admin");
  console.log("   ID:", admin.id);
}

seedAdmin()
  .catch((e) => {
    console.error("Failed to seed admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
