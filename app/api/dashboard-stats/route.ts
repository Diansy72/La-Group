import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // 1-12
    const year = searchParams.get("year"); // e.g. 2025
    const period = searchParams.get("period"); // "weekly" | "monthly"

    // Build date range based on filters
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month);

      if (period === "weekly") {
        // Current week within the selected month
        const now = new Date();
        const currentDay = now.getDate();
        // Get the start of the current week (Monday)
        const dayOfWeek = now.getDay() || 7; // Convert Sunday=0 to 7
        const weekStart = new Date(y, m - 1, currentDay - dayOfWeek + 1);
        const weekEnd = new Date(y, m - 1, currentDay - dayOfWeek + 7, 23, 59, 59, 999);
        // Clamp to month boundaries
        dateFrom = new Date(Math.max(weekStart.getTime(), new Date(y, m - 1, 1).getTime()));
        dateTo = new Date(Math.min(weekEnd.getTime(), new Date(y, m, 0, 23, 59, 59, 999).getTime()));
      } else {
        // Full month
        dateFrom = new Date(y, m - 1, 1);
        dateTo = new Date(y, m, 0, 23, 59, 59, 999);
      }
    } else if (year) {
      const y = parseInt(year);
      dateFrom = new Date(y, 0, 1);
      dateTo = new Date(y, 11, 31, 23, 59, 59, 999);
    }

    // Build where clauses for date filtering
    const vehicleDateFilter = dateFrom && dateTo
      ? { createdAt: { gte: dateFrom, lte: dateTo } }
      : {};
    const tourDateFilter = dateFrom && dateTo
      ? { createdAt: { gte: dateFrom, lte: dateTo } }
      : {};

    // Fetch stats in parallel using Promise.all to reduce latency
    const [
      activeVehicleBookings,
      activeTourBookings,
      availableUnits,
      totalVehicleBookings,
      totalTourBookings,
      vehicleRevenue,
      tourRevenue,
    ] = await Promise.all([
      prisma.vehicleBooking.count({
        where: { status: "BOOKED", ...vehicleDateFilter },
      }),
      prisma.tourBooking.count({
        where: { status: "active", ...tourDateFilter },
      }),
      prisma.vehicle.count({
        where: { status: "available" },
      }),
      prisma.vehicleBooking.count({
        where: { ...vehicleDateFilter },
      }),
      prisma.tourBooking.count({
        where: { ...tourDateFilter },
      }),
      prisma.vehicleBooking.aggregate({
        _sum: { finalPrice: true },
        where: { status: { not: "CANCELLED" }, ...vehicleDateFilter },
      }),
      prisma.tourBooking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: "cancelled" }, ...tourDateFilter },
      }),
    ]);

    const totalActiveBookings = activeVehicleBookings + activeTourBookings;
    const totalBookings = totalVehicleBookings + totalTourBookings;
    const totalRevenue =
      (vehicleRevenue._sum.finalPrice ?? 0) +
      (tourRevenue._sum.totalPrice ?? 0);

    return NextResponse.json({
      activeBookings: totalActiveBookings,
      availableUnits,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
