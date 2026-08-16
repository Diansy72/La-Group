import { PrismaClient } from "@prisma/client";

// Mencegah Prisma Client dibuat berulang kali saat proses development (hot-reload) di Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Menampilkan query SQL di terminal (bagus untuk debugging)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// Force TS re-evaluation
