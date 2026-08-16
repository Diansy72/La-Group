import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ available: true });
    }

    const allUsers = await prisma.user.findMany({
      select: { name: true },
    });

    const taken = allUsers.some(
      (u: { name: string }) => u.name.toLowerCase() === name.trim().toLowerCase()
    );

    return NextResponse.json({ available: !taken });
  } catch (error) {
    return NextResponse.json({ available: true });
  }
}
