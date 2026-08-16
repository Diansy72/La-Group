import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TourPackage } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("limit") || "50", 10);

    const tours = await prisma.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
      take: take,
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });
    
    // Format JSON arrays
    const formattedTours = tours.map((t: TourPackage & { _count?: { bookings: number } }) => ({
      ...t,
      includes: t.includes ? JSON.parse(t.includes) : [],
      excludes: t.excludes ? JSON.parse(t.excludes) : [],
      vehicleOptions: t.vehicleOptions ? JSON.parse(t.vehicleOptions) : [],
      itinerary: t.itinerary ? JSON.parse(t.itinerary) : [],
      destinationTags: t.destinationTags ? JSON.parse(t.destinationTags) : [],
    }));
    
    return NextResponse.json(formattedTours);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tour packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const lastTour = await prisma.tourPackage.findFirst({
      where: { id: { startsWith: "pkg-" } },
      orderBy: { id: "desc" }
    });
    
    let nextNum = 1;
    if (lastTour) {
      const match = lastTour.id.match(/^pkg-(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    
    const newId = `pkg-${String(nextNum).padStart(3, '0')}`;

    const body = await request.json();
    const newTour = await prisma.tourPackage.create({
      data: {
        id: newId,
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        imageUrl: body.imageUrl,
        estimatedPrice: body.estimatedPrice,
        duration: body.duration,
        minPax: body.minPax,
        maxPax: body.maxPax,
        startTime: body.startTime,
        endTime: body.endTime,
        category: body.category,
        priceType: body.priceType,
        status: body.status || "draft",
        recommendation: body.recommendation,
        includes: body.includes ? JSON.stringify(body.includes) : null,
        excludes: body.excludes ? JSON.stringify(body.excludes) : null,
        vehicleOptions: body.vehicleOptions ? JSON.stringify(body.vehicleOptions) : null,
        itinerary: body.itinerary ? JSON.stringify(body.itinerary) : null,
        destinationTags: body.destinationTags ? JSON.stringify(body.destinationTags) : null,
      }
    });

    return NextResponse.json({
      ...newTour,
      includes: newTour.includes ? JSON.parse(newTour.includes) : [],
      excludes: newTour.excludes ? JSON.parse(newTour.excludes) : [],
      vehicleOptions: newTour.vehicleOptions ? JSON.parse(newTour.vehicleOptions) : [],
      itinerary: newTour.itinerary ? JSON.parse(newTour.itinerary) : [],
      destinationTags: newTour.destinationTags ? JSON.parse(newTour.destinationTags) : [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tour package" }, { status: 500 });
  }
}
