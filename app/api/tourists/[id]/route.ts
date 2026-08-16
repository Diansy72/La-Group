import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/supabase/storage";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get current tourist photoUrl to check if it has changed
    const currentTourist = await prisma.tourist.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    const updated = await prisma.tourist.update({
      where: { id },
      data: {
        nationality: body.nationality,
        continent: body.continent,
        packageTaken: body.packageTaken,
        photoUrl: body.photoUrl || null,
      },
    });

    // Delete old photo if new one uploaded or removed
    if (
      currentTourist &&
      currentTourist.photoUrl &&
      currentTourist.photoUrl !== body.photoUrl
    ) {
      await deleteFile(currentTourist.photoUrl);
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update tourist:", error);
    return NextResponse.json({ error: "Failed to update tourist" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Find the tourist item to get its photoUrl
    const tourist = await prisma.tourist.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    await prisma.tourist.delete({ where: { id } });

    // Delete file from storage
    if (tourist && tourist.photoUrl) {
      await deleteFile(tourist.photoUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tourist:", error);
    return NextResponse.json({ error: "Failed to delete tourist" }, { status: 500 });
  }
}
