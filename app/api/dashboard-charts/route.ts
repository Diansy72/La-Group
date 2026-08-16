import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "weekly"; // "weekly" | "monthly"
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1)); // 1-12
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

    if (range === "weekly") {
      // Get the Mon-Sun days of the current/selected week.
      const now = new Date();
      const targetDate = now.getMonth() + 1 === month && now.getFullYear() === year 
        ? now 
        : new Date(year, month - 1, 1);
      
      const dayOfWeek = targetDate.getDay() || 7; // Sunday is 7, Monday is 1
      const startOfWeek = new Date(targetDate);
      startOfWeek.setDate(targetDate.getDate() - dayOfWeek + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dates: string[] = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        dates.push(currentDate.toISOString().split("T")[0]);
      }

      // Fetch all bookings for the dates in bulk
      const vehicleBookings = await prisma.vehicleBooking.findMany({
        where: {
          bookingDate: { in: dates },
        },
        select: {
          bookingDate: true,
          finalPrice: true,
          status: true,
        },
      });

      const tourBookings = await prisma.tourBooking.findMany({
        where: {
          bookingDate: { in: dates },
        },
        select: {
          bookingDate: true,
          totalPrice: true,
          status: true,
        },
      });

      const chartData = dates.map((dateStr, idx) => {
        const dayVehicles = vehicleBookings.filter((b) => b.bookingDate === dateStr);
        const dayTours = tourBookings.filter((b) => b.bookingDate === dateStr);

        const vehicleBookingsCount = dayVehicles.length;
        const vehicleRevenueSum = dayVehicles
          .filter((b) => b.status !== "CANCELLED")
          .reduce((sum, b) => sum + (b.finalPrice ?? 0), 0);

        const tourBookingsCount = dayTours.length;
        const tourRevenueSum = dayTours
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

        return {
          label: daysLabels[idx],
          vehicleBookings: vehicleBookingsCount,
          tourBookings: tourBookingsCount,
          vehicleRevenue: vehicleRevenueSum,
          tourRevenue: tourRevenueSum,
        };
      });

      return NextResponse.json(chartData);
    } else {
      // Monthly - 12 months of the selected year
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

      // Fetch all bookings for the entire year in bulk
      const vehicleBookings = await prisma.vehicleBooking.findMany({
        where: {
          createdAt: { gte: startOfYear, lte: endOfYear },
        },
        select: {
          createdAt: true,
          finalPrice: true,
          status: true,
        },
      });

      const tourBookings = await prisma.tourBooking.findMany({
        where: {
          createdAt: { gte: startOfYear, lte: endOfYear },
        },
        select: {
          createdAt: true,
          totalPrice: true,
          status: true,
        },
      });

      const chartData = [];

      for (let m = 0; m < 12; m++) {
        const monthVehicles = vehicleBookings.filter((b) => {
          const d = new Date(b.createdAt);
          return d.getFullYear() === year && d.getMonth() === m;
        });

        const monthTours = tourBookings.filter((b) => {
          const d = new Date(b.createdAt);
          return d.getFullYear() === year && d.getMonth() === m;
        });

        const vehicleBookingsCount = monthVehicles.length;
        const vehicleRevenueSum = monthVehicles
          .filter((b) => b.status !== "CANCELLED")
          .reduce((sum, b) => sum + (b.finalPrice ?? 0), 0);

        const tourBookingsCount = monthTours.length;
        const tourRevenueSum = monthTours
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

        chartData.push({
          label: monthNames[m],
          vehicleBookings: vehicleBookingsCount,
          tourBookings: tourBookingsCount,
          vehicleRevenue: vehicleRevenueSum,
          tourRevenue: tourRevenueSum,
        });
      }

      return NextResponse.json(chartData);
    }
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
