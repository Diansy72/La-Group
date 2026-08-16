import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Vehicle } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get("limit") || "50", 10);

    const now = new Date();

    const vehicles = await prisma.vehicle.findMany({
      include: { packages: true },
      orderBy: { createdAt: "desc" },
      take: take,
    });

    // Gunakan offset UTC+7 (WIB) untuk penentuan tanggal hari ini agar sinkron dengan input lokal user
    const jakartaOffset = 7 * 60 * 60 * 1000;
    const todayString = new Date(now.getTime() + jakartaOffset).toISOString().split("T")[0];

    const activeBookings = await prisma.vehicleBooking.findMany({
      where: {
        vehicleId: { in: vehicles.map((v) => v.id) },
        status: "BOOKED",
        bookingDate: { lte: todayString },
        releaseDateTime: { gt: now },
      },
    });

    const activeBookingVehicleIds = new Set(activeBookings.map((b) => b.vehicleId));

    const syncedVehicles = await Promise.all(
      vehicles.map(async (v: any) => {
        const hasActiveBooking = activeBookingVehicleIds.has(v.id);
        let targetStatus = v.status;
        if (hasActiveBooking) {
          targetStatus = "rented";
        } else if (v.status === "rented") {
          targetStatus = "available";
        }

        if (targetStatus !== v.status) {
          await prisma.vehicle.update({
            where: { id: v.id },
            data: { status: targetStatus },
          });

          if (v.licensePlate) {
            await prisma.vehicle.updateMany({
              where: {
                licensePlate: v.licensePlate,
                NOT: { id: v.id },
                status: v.status,
              },
              data: { status: targetStatus },
            });
          }
          v.status = targetStatus;
        }
        return v;
      })
    );
    
    // Format JSON array for features and format date
    const formattedVehicles = syncedVehicles.map((v: any) => ({
      ...v,
      features: v.features ? JSON.parse(v.features) : [],
      withFuel: v.withFuel || false,
      createdAt: v.createdAt.toISOString().split("T")[0] // return exactly like mock data (YYYY-MM-DD)
    }));
    
    return NextResponse.json(formattedVehicles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVehicle = await prisma.vehicle.create({
      data: {
        name: body.name,
        type: body.type,
        licensePlate: body.licensePlate,
        pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : null,
        status: body.status || "available",
        imageUrl: body.imageUrl,
        category: body.category || "",
        description: body.description,
        rentalDuration: body.rentalDuration,
        maxSpeed: body.maxSpeed ? Number(body.maxSpeed) : null,
        seatCapacity: body.seatCapacity ? Number(body.seatCapacity) : null,
        selfDrive: body.selfDrive,
        hasPhoneCharger: body.hasPhoneCharger,
        withFuel: body.withFuel,
        features: body.features && body.features.length > 0 ? JSON.stringify(body.features) : null,
        packages: body.type === "car" && body.packages && body.packages.length > 0 ? {
          create: body.packages.map((pkg: any) => ({
            duration: pkg.duration,
            driverType: pkg.driverType,
            fuelOption: pkg.fuelOption,
            price: Number(pkg.price),
          }))
        } : undefined
      },
      include: { packages: true }
    });

    return NextResponse.json({
      ...newVehicle,
      features: newVehicle.features ? JSON.parse(newVehicle.features) : [],
      withFuel: newVehicle.withFuel || false,
      createdAt: newVehicle.createdAt.toISOString().split("T")[0]
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
