import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { VehicleBooking, Vehicle, TourBooking, TourPackage } from "@prisma/client";

export const dynamic = "force-dynamic";

type VehicleBookingWithVehicle = VehicleBooking & { vehicle: Vehicle };
type TourBookingWithPackage = TourBooking & { tourPackage: TourPackage };

export async function GET() {
  try {
    // Fetch latest 4 vehicle bookings
    const vehicleBookings: VehicleBookingWithVehicle[] = await prisma.vehicleBooking.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    }) as unknown as VehicleBookingWithVehicle[];

    // Fetch latest 4 tour bookings
    const tourBookings: TourBookingWithPackage[] = await prisma.tourBooking.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { tourPackage: true },
    }) as unknown as TourBookingWithPackage[];

    // Map vehicle bookings
    const vehicleItems = vehicleBookings.map((b: VehicleBookingWithVehicle) => ({
      id: b.id,
      type: "vehicle" as const,
      title: b.vehicle.name,
      subtitle: `${b.vehicle.licensePlate} · ${b.vehicle.type === "car" ? "Car" : b.vehicle.type === "motorcycle" ? "Motorcycle" : "Minibus"}`,
      initial: b.customer.charAt(0).toUpperCase(),
      imageUrl: b.vehicle.imageUrl,
      date: b.bookingDate,
      createdAt: b.createdAt,
      status: b.status,
    }));

    // Map tour bookings
    const tourItems = tourBookings.map((b: TourBookingWithPackage) => ({
      id: b.id,
      type: "tour" as const,
      title: b.tourPackage.title,
      subtitle: `${b.tourPackage.category || "Tour"} · ${b.tourPackage.priceType === "per_person" ? "Per Person" : "Per Car"}`,
      initial: b.customerName.charAt(0).toUpperCase(),
      imageUrl: b.tourPackage.imageUrl,
      date: b.bookingDate,
      createdAt: b.createdAt,
      status: b.status,
    }));

    // Combine, sort by createdAt desc, take 4
    const combined = [...vehicleItems, ...tourItems]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    return NextResponse.json(combined);
  } catch (error) {
    console.error("Failed to fetch recent bookings:", error);
    return NextResponse.json({ error: "Failed to fetch recent bookings" }, { status: 500 });
  }
}
