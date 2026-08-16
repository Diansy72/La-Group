import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/supabase/storage";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const vehicleData = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      include: { packages: true },
    });

    if (!vehicleData) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...vehicleData,
      features: vehicleData.features ? JSON.parse(vehicleData.features) : [],
      withFuel: vehicleData.withFuel || false,
      createdAt: vehicleData.createdAt.toISOString().split("T")[0],
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Get current vehicle image to check if it has changed
    const currentVehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      select: { imageUrl: true },
    });

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: resolvedParams.id },
      data: {
        name: body.name,
        type: body.type,
        licensePlate: body.licensePlate,
        pricePerDay: body.pricePerDay ? Number(body.pricePerDay) : null,
        status: body.status,
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
      }
    });

    // Delete old image if a new one was uploaded or if it was removed
    if (
      currentVehicle &&
      currentVehicle.imageUrl &&
      currentVehicle.imageUrl !== body.imageUrl
    ) {
      await deleteFile(currentVehicle.imageUrl);
    }

    // Recreate packages if type is car
    await prisma.rentalPackage.deleteMany({
      where: { vehicleId: resolvedParams.id }
    });

    if (body.type === "car" && body.packages && body.packages.length > 0) {
      await prisma.rentalPackage.createMany({
        data: body.packages.map((pkg: any) => ({
          vehicleId: resolvedParams.id,
          duration: pkg.duration,
          driverType: pkg.driverType,
          fuelOption: pkg.fuelOption,
          price: Number(pkg.price),
        }))
      });
    }

    const finalVehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      include: { packages: true }
    });

    if (!finalVehicle) {
      throw new Error("Vehicle not found after update");
    }

    // ── OPSI A: Sinkronisasi status ke semua unit dengan plat nomor yang sama ──
    // Jika status diubah (booking/cancel), update semua kendaraan ber-plat sama
    // agar tidak terjadi double booking pada unit fisik yang sama.
    if (body.status !== undefined && finalVehicle.licensePlate) {
      await prisma.vehicle.updateMany({
        where: {
          licensePlate: finalVehicle.licensePlate,
          NOT: { id: resolvedParams.id }, // Kecualikan kendaraan yang baru saja diupdate
        },
        data: {
          status: body.status,
        },
      });
    }

    return NextResponse.json({
      ...finalVehicle,
      features: finalVehicle.features ? JSON.parse(finalVehicle.features) : [],
      withFuel: finalVehicle.withFuel || false,
      createdAt: finalVehicle.createdAt.toISOString().split("T")[0]
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    
    // Find the vehicle to get its imageUrl
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      select: { imageUrl: true },
    });

    await prisma.vehicle.delete({
      where: { id: resolvedParams.id },
    });

    // If deleting from database succeeded, delete the file from storage
    if (vehicle && vehicle.imageUrl) {
      await deleteFile(vehicle.imageUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
