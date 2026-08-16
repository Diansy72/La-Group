import { NextResponse } from "next/server";
import { PrismaClient, TourBooking, TourPackage } from "@prisma/client";

const prisma = new PrismaClient();

type TourBookingWithPackage = TourBooking & {
  tourPackage: TourPackage;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const bookings: TourBookingWithPackage[] = await prisma.tourBooking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        tourPackage: true,
      },
      orderBy: {
        bookingDate: "asc",
      },
    });

    const mappedBookings = bookings.map((b: TourBookingWithPackage) => ({
      id: b.id,
      packageName: b.tourPackage?.title || "Unknown Tour",
      customerName: b.customerName,
      priceType: b.tourPackage?.priceType || "per_car",
      vehicleType: b.vehicleType,
      pax: b.pax,
      totalPrice: b.totalPrice,
      bookingDate: b.bookingDate,
      time: b.time,
      phone: b.phone,
      status: b.status,
      notes: b.notes || "-",
      category: b.tourPackage?.category || "-",
    }));

    return NextResponse.json(mappedBookings);
  } catch (error) {
    console.error("Failed to fetch tour bookings report data:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour bookings report data" },
      { status: 500 }
    );
  }
}
