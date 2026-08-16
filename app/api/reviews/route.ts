import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  country: z.string().min(2, "Country is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  avatarPath: z.string().optional().nullable().or(z.literal("")),
  mediaType: z.string().optional().nullable().or(z.literal("")),
  mediaPath: z.string().optional().nullable().or(z.literal("")),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("limit") || "50", 10);
    
    const reviews = await prisma.googleReview.findMany({
      orderBy: { createdAt: "desc" },
      take: take, // Limit to prevent massive payload
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    
    // Validasi data dengan Zod
    const result = reviewSchema.safeParse(rawBody);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const data = result.data;

    const review = await prisma.googleReview.create({
      data: {
        name: data.name,
        country: data.country,
        rating: data.rating,
        comment: data.comment,
        avatarPath: data.avatarPath || null,
        mediaType: data.mediaType || null,
        mediaPath: data.mediaPath || null,
      },
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
