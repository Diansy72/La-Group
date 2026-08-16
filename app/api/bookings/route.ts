import { NextResponse } from "next/server";
import { PrismaClient, Vehicle, VehicleBooking, RentalPackage } from "@prisma/client";

const prisma = new PrismaClient();

type VehicleBookingWithVehicle = VehicleBooking & {
  vehicle: Vehicle & {
    packages: RentalPackage[];
  };
};

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
            { customer: { contains: search } },
            { vehicle: { name: { contains: search } } },
            { vehicle: { licensePlate: { contains: search } } },
          ],
        }
      : {
          createdAt: {
            gte: sixtyDaysAgo,
          },
        };

    const [bookings, total]: [VehicleBookingWithVehicle[], number] = await Promise.all([
      prisma.vehicleBooking.findMany({
        where: whereClause,
        include: {
          vehicle: {
            include: {
              packages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.vehicleBooking.count({
        where: whereClause,
      }),
    ]);

    // Map to the frontend interface
    const mappedBookings = bookings.map((b: VehicleBookingWithVehicle) => ({
      id: b.id,
      vehicleName: b.vehicle?.name || "Unknown Vehicle",
      licensePlate: b.vehicle?.licensePlate || "-",
      category: b.vehicle?.category || "-",
      type: b.vehicle?.type || "car",
      bookingDate: b.bookingDate,
      time: b.time,
      duration: b.duration,
      customer: b.customer,
      phone: b.phone,
      notes: b.notes || "-",
      status: b.status,
      packageId: b.packageId || null,
      basePrice: b.basePrice || null,
      finalPrice: b.finalPrice || null,
      vehicleRentalDuration: b.vehicle?.rentalDuration || null,
      vehiclePackages: b.vehicle?.packages || [],
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
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      customer,
      phone,
      bookingDate,
      time,
      duration,
      notes,
      status,
      packageId,
      basePrice,
      finalPrice,
    } = body;

    const parsedTime = time || "08:00";
    const [year, month, day] = bookingDate.split("-").map(Number);
    const [hours, minutes] = parsedTime.split(":").map(Number);
    const bookingDT = new Date(year, month - 1, day, hours, minutes, 0);

    const releaseDT = new Date(bookingDT.getTime());
    if (duration === "Half Day") {
      releaseDT.setHours(releaseDT.getHours() + 12);
    } else {
      releaseDT.setHours(releaseDT.getHours() + 24);
    }

    const newBooking: VehicleBookingWithVehicle = await prisma.vehicleBooking.create({
      data: {
        vehicleId,
        customer,
        phone,
        bookingDate,
        time: parsedTime,
        duration,
        notes,
        status: status || "BOOKED",
        packageId: packageId || null,
        basePrice: basePrice ? Number(basePrice) : null,
        finalPrice: finalPrice ? Number(finalPrice) : null,
        bookingDateTime: bookingDT,
        releaseDateTime: releaseDT,
      },
      include: {
        vehicle: {
          include: {
            packages: true,
          },
        },
      },
    });

    const mappedBooking = {
      id: newBooking.id,
      vehicleName: newBooking.vehicle.name,
      licensePlate: newBooking.vehicle.licensePlate,
      category: newBooking.vehicle.category,
      type: newBooking.vehicle.type,
      bookingDate: newBooking.bookingDate,
      time: newBooking.time,
      duration: newBooking.duration,
      customer: newBooking.customer,
      phone: newBooking.phone,
      notes: newBooking.notes || "-",
      status: newBooking.status,
      packageId: newBooking.packageId || null,
      basePrice: newBooking.basePrice || null,
      finalPrice: newBooking.finalPrice || null,
      vehicleRentalDuration: newBooking.vehicle.rentalDuration || null,
      vehiclePackages: newBooking.vehicle.packages || [],
    };

    return NextResponse.json(mappedBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { vehicleId, status } = body;

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId is required" }, { status: 400 });
    }

    if (status === "CANCELLED") {
      // Find the active booking for this vehicle
      const activeBooking = await prisma.vehicleBooking.findFirst({
        where: {
          vehicleId: vehicleId,
          status: "BOOKED",
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      if (activeBooking) {
        // Update booking status to CANCELLED
        await prisma.vehicleBooking.update({
          where: { id: activeBooking.id },
          data: { status: "CANCELLED" },
        });
      }

      // Find the vehicle to get its plate number
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId }
      });

      if (vehicle) {
        // Update all vehicles with the same plate number to available
        await prisma.vehicle.updateMany({
          where: { licensePlate: vehicle.licensePlate },
          data: { status: "available" },
        });
      }

      // Return the updated vehicle object matching client expectations
      const updatedVehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId },
        include: { packages: true }
      });

      return NextResponse.json(updatedVehicle);
    }

    return NextResponse.json({ error: "Invalid status or operation" }, { status: 400 });
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
