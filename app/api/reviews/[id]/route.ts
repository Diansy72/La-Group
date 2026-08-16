import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/supabase/storage";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Get current review to check if media files have changed
    const currentReview = await prisma.googleReview.findUnique({
      where: { id },
      select: { avatarPath: true, mediaPath: true },
    });

    const updated = await prisma.googleReview.update({
      where: { id },
      data: {
        name: body.name,
        country: body.country,
        rating: body.rating,
        comment: body.comment,
        avatarPath: body.avatarPath || null,
        mediaType: body.mediaType || null,
        mediaPath: body.mediaPath || null,
      },
    });

    // Delete old avatar file if a new one was uploaded or if it was removed
    if (
      currentReview &&
      currentReview.avatarPath &&
      currentReview.avatarPath !== body.avatarPath
    ) {
      await deleteFile(currentReview.avatarPath);
    }

    // Delete old media file if a new one was uploaded or if it was removed
    if (
      currentReview &&
      currentReview.mediaPath &&
      currentReview.mediaPath !== body.mediaPath
    ) {
      await deleteFile(currentReview.mediaPath);
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get current review to find its mediaPath
    const review = await prisma.googleReview.findUnique({
      where: { id },
      select: { mediaPath: true },
    });

    await prisma.googleReview.delete({ where: { id } });

    // Delete media file from storage
    if (review && review.mediaPath) {
      await deleteFile(review.mediaPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
