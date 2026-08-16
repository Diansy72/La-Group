import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/supabase/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const tour = await prisma.tourPackage.findUnique({
      where: { id: resolvedParams.id },
    });
    
    if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...tour,
      includes: tour.includes ? JSON.parse(tour.includes) : [],
      excludes: tour.excludes ? JSON.parse(tour.excludes) : [],
      vehicleOptions: tour.vehicleOptions ? JSON.parse(tour.vehicleOptions) : [],
      itinerary: tour.itinerary ? JSON.parse(tour.itinerary) : [],
      destinationTags: tour.destinationTags ? JSON.parse(tour.destinationTags) : [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tour package" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Find current tour to get old imageUrl
    const currentTour = await prisma.tourPackage.findUnique({
      where: { id: resolvedParams.id },
      select: { imageUrl: true },
    });

    const updatedTour = await prisma.tourPackage.update({
      where: { id: resolvedParams.id },
      data: {
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
        status: body.status,
        recommendation: body.recommendation,
        includes: body.includes ? JSON.stringify(body.includes) : null,
        excludes: body.excludes ? JSON.stringify(body.excludes) : null,
        vehicleOptions: body.vehicleOptions ? JSON.stringify(body.vehicleOptions) : null,
        itinerary: body.itinerary ? JSON.stringify(body.itinerary) : null,
        destinationTags: body.destinationTags ? JSON.stringify(body.destinationTags) : null,
      }
    });

    // Delete old image if a new one was uploaded or if it was removed
    if (
      currentTour &&
      currentTour.imageUrl &&
      currentTour.imageUrl !== body.imageUrl
    ) {
      await deleteFile(currentTour.imageUrl);
    }

    return NextResponse.json({
      ...updatedTour,
      includes: updatedTour.includes ? JSON.parse(updatedTour.includes) : [],
      excludes: updatedTour.excludes ? JSON.parse(updatedTour.excludes) : [],
      vehicleOptions: updatedTour.vehicleOptions ? JSON.parse(updatedTour.vehicleOptions) : [],
      itinerary: updatedTour.itinerary ? JSON.parse(updatedTour.itinerary) : [],
      destinationTags: updatedTour.destinationTags ? JSON.parse(updatedTour.destinationTags) : [],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tour package" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Find the tour package to get its imageUrl
    const tour = await prisma.tourPackage.findUnique({
      where: { id: resolvedParams.id },
      select: { imageUrl: true },
    });

    await prisma.tourPackage.delete({
      where: { id: resolvedParams.id },
    });

    // Delete file from storage
    if (tour && tour.imageUrl) {
      await deleteFile(tour.imageUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tour package" }, { status: 500 });
  }
}
