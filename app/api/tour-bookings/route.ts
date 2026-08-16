import { NextResponse } from "next/server";
import { PrismaClient, TourBooking, TourPackage } from "@prisma/client";

const prisma = new PrismaClient();

type TourBookingWithPackage = TourBooking & { tourPackage: TourPackage };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    
    const skip = (page - 1) * limit;

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const whereClause: any = search
      ? {
          OR: [
            { customerName: { contains: search } },
            { tourPackage: { title: { contains: search } } },
          ],
        }
      : {
          createdAt: {
            gte: sixtyDaysAgo,
          },
        };

    const [bookings, total]: [TourBookingWithPackage[], number] = await Promise.all([
      prisma.tourBooking.findMany({
        where: whereClause,
        include: {
          tourPackage: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.tourBooking.count({
        where: whereClause,
      }),
    ]);

    // Map to match TourBookingHistory type
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
      notes: b.notes,
      category: b.tourPackage?.category || "",
    }));

    return NextResponse.json({
      data: mappedBookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch tour bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tourPackageId, customerName, phone, bookingDate, time, vehicleType, pax, totalPrice, notes, status } = body;

    const newBooking: TourBookingWithPackage = await prisma.tourBooking.create({
      data: {
        tourPackageId,
        customerName,
        phone,
        bookingDate,
        time: time || "08:00",
        vehicleType,
        pax,
        totalPrice,
        notes,
        status: status || "active",
      },
      include: {
        tourPackage: true,
      },
    });

    const mappedBooking = {
      id: newBooking.id,
      packageName: newBooking.tourPackage.title,
      customerName: newBooking.customerName,
      priceType: newBooking.tourPackage.priceType || "per_car",
      vehicleType: newBooking.vehicleType,
      pax: newBooking.pax,
      totalPrice: newBooking.totalPrice,
      bookingDate: newBooking.bookingDate,
      time: newBooking.time,
      phone: newBooking.phone,
      status: newBooking.status,
      notes: newBooking.notes,
      category: newBooking.tourPackage?.category || "",
    };

    return NextResponse.json(mappedBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create tour booking:", error);
    return NextResponse.json(
      { error: "Failed to create tour booking" },
      { status: 500 }
    );
  }
}
