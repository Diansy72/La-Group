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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const statusFilter = searchParams.get("status");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "startDate and endDate are required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      bookingDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (statusFilter) {
      const statuses = statusFilter.split(",");
      whereClause.status = {
        in: statuses,
      };
    }

    const bookings: VehicleBookingWithVehicle[] = await prisma.vehicleBooking.findMany({
      where: whereClause,
      include: {
        vehicle: {
          include: {
            packages: true,
          },
        },
      },
      orderBy: {
        bookingDate: "asc",
      },
    });

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

    return NextResponse.json(mappedBookings);
  } catch (error) {
    console.error("Failed to generate report data:", error);
    return NextResponse.json(
      { error: "Failed to generate report data" },
      { status: 500 }
    );
  }
}
