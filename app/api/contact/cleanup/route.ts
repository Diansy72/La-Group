import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "0");
    
    if (days <= 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const result = await prisma.contactMessage.deleteMany({
      where: {
        createdAt: {
          lt: dateThreshold
        }
      }
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Failed to clean up contact messages:", error);
    return NextResponse.json({ error: "Failed to clean up messages" }, { status: 500 });
  }
}
