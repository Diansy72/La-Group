import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const history = await prisma.promoBroadcast.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ history });
  } catch (error: unknown) {
    console.error("Failed to fetch promo history:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
