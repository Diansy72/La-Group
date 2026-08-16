import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { subject, body } = await request.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get all users who are "user" role
    const users = await prisma.user.findMany({
      where: {
        role: "user"
      },
      select: { id: true }
    });

    if (users.length === 0) {
      return NextResponse.json({ success: true, recipientCount: 0 });
    }

    // Create notifications for all these users
    const notifications = users.map((u: { id: string }) => ({
      userId: u.id,
      title: subject,
      message: body,
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    const broadcastRecord = await prisma.promoBroadcast.create({
      data: {
        subject,
        body,
        recipientCount: users.length,
        status: "sent"
      }
    });

    return NextResponse.json({ success: true, recipientCount: users.length, broadcast: broadcastRecord });
  } catch (error: unknown) {
    console.error("Failed to broadcast promo:", error);
    const message = error instanceof Error ? error.message : "Failed to broadcast promo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
