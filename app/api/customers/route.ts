import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user"
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        // Assuming we count their bookings. For now, since we haven't linked the bookings to user IDs 
        // in the schema (the booking uses string names), we can just return 0 or do a manual count if needed.
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
