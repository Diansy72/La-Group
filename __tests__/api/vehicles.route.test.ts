// ── Mock Supabase Storage ──────────────────────────────────
jest.mock("@/lib/supabase/storage", () => ({
  deleteFile: jest.fn(),
}));

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { deleteFile } from "@/lib/supabase/storage";


// ── Import handlers ─────────────────────────────────────────
import { GET, POST } from "@/app/api/vehicles/route";
import {
  GET as GET_BY_ID,
  PUT,
  DELETE,
} from "@/app/api/vehicles/[id]/route";

// ── Helpers ─────────────────────────────────────────────────
function makeRequest(url: string, options: RequestInit = {}) {
  return new Request(`http://localhost:3000${url}`, options);
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

// ── Sample Data ─────────────────────────────────────────────
const sampleVehicle = {
  id: "cltest001",
  name: "Toyota Avanza",
  type: "car",
  licensePlate: "DK 1234 AB",
  pricePerDay: 400000,
  status: "available",
  imageUrl: "vehicles/avanza.jpg",
  category: "MPV",
  description: "Comfortable MPV",
  rentalDuration: "Full Day",
  maxSpeed: 180,
  seatCapacity: 7,
  selfDrive: true,
  hasPhoneCharger: true,
  withFuel: false,
  features: '["AC","USB Charger"]',
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-01-15"),
  packages: [
    {
      id: "pkg001",
      vehicleId: "cltest001",
      duration: "full_day",
      driverType: "self_drive",
      fuelOption: "without_fuel",
      price: 400000,
    },
  ],
};

const sampleMotorcycle = {
  id: "cltest002",
  name: "Honda Vario",
  type: "motorcycle",
  licensePlate: "DK 5678 CD",
  pricePerDay: 80000,
  status: "available",
  imageUrl: "vehicles/vario.jpg",
  category: "Matic",
  description: null,
  rentalDuration: null,
  maxSpeed: 110,
  seatCapacity: 2,
  selfDrive: true,
  hasPhoneCharger: false,
  withFuel: false,
  features: null,
  createdAt: new Date("2025-02-10"),
  updatedAt: new Date("2025-02-10"),
  packages: [],
};

// ═══════════════════════════════════════════════════════════
// TEST SUITE: GET /api/vehicles
// ═══════════════════════════════════════════════════════════
describe("GET /api/vehicles", () => {
  it("should return a list of vehicles with parsed features", async () => {
    (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([sampleVehicle]);
    (prisma.vehicleBooking.findMany as jest.Mock).mockResolvedValue([]);

    const request = makeRequest("/api/vehicles");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe("Toyota Avanza");
    // Features should be parsed from JSON string to array
    expect(Array.isArray(data[0].features)).toBe(true);
    expect(data[0].features).toEqual(["AC", "USB Charger"]);
  });

  it("should return vehicles with null features as empty array", async () => {
    (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([sampleMotorcycle]);
    (prisma.vehicleBooking.findMany as jest.Mock).mockResolvedValue([]);

    const request = makeRequest("/api/vehicles");
    const response = await GET(request);
    const data = await response.json();

    expect(data[0].features).toEqual([]);
  });

  it("should sync vehicle status to 'rented' if active booking exists", async () => {
    const rentedVehicle = { ...sampleVehicle, status: "available" };
    (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([rentedVehicle]);
    (prisma.vehicleBooking.findMany as jest.Mock).mockResolvedValue([
      { vehicleId: "cltest001" },
    ]);
    (prisma.vehicle.update as jest.Mock).mockResolvedValue({});
    (prisma.vehicle.updateMany as jest.Mock).mockResolvedValue({});

    const request = makeRequest("/api/vehicles");
    const response = await GET(request);
    const data = await response.json();

    expect(prisma.vehicle.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "cltest001" },
        data: { status: "rented" },
      })
    );
  });

  it("should return 500 on database error", async () => {
    (prisma.vehicle.findMany as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const request = makeRequest("/api/vehicles");
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════
// TEST SUITE: POST /api/vehicles
// ═══════════════════════════════════════════════════════════
describe("POST /api/vehicles", () => {
  it("should create a new motorcycle (without packages)", async () => {
    const newMotor = {
      name: "Yamaha NMAX",
      type: "motorcycle",
      licensePlate: "DK 9999 EF",
      pricePerDay: 100000,
      category: "Matic",
    };

    const createdMotor = {
      ...newMotor,
      id: "clnew001",
      status: "available",
      features: null,
      withFuel: false,
      createdAt: new Date(),
      packages: [],
    };

    (prisma.vehicle.create as jest.Mock).mockResolvedValue(createdMotor);

    const request = makeRequest("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMotor),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Yamaha NMAX");
    expect(data.features).toEqual([]);
  });

  it("should create a new car with nested packages", async () => {
    const newCar = {
      name: "Toyota Innova",
      type: "car",
      licensePlate: "DK 1111 GH",
      pricePerDay: 600000,
      category: "MPV",
      features: ["AC", "Bluetooth"],
      packages: [
        {
          duration: "full_day",
          driverType: "with_driver",
          fuelOption: "with_fuel",
          price: 800000,
        },
      ],
    };

    const createdCar = {
      ...newCar,
      id: "clnew002",
      status: "available",
      features: '["AC","Bluetooth"]',
      withFuel: false,
      createdAt: new Date(),
      packages: newCar.packages,
    };

    (prisma.vehicle.create as jest.Mock).mockResolvedValue(createdCar);

    const request = makeRequest("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCar),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.name).toBe("Toyota Innova");
    expect(data.features).toEqual(["AC", "Bluetooth"]);
    // Verify that Prisma was called with nested create for packages
    expect(prisma.vehicle.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          packages: expect.objectContaining({
            create: expect.any(Array),
          }),
        }),
      })
    );
  });

  it("should return 500 on creation error", async () => {
    (prisma.vehicle.create as jest.Mock).mockRejectedValue(
      new Error("Unique constraint violation")
    );

    const request = makeRequest("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Duplicate" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});

// ═══════════════════════════════════════════════════════════
// TEST SUITE: GET /api/vehicles/:id
// ═══════════════════════════════════════════════════════════
describe("GET /api/vehicles/:id", () => {
  it("should return vehicle details by ID", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(sampleVehicle);

    const request = makeRequest("/api/vehicles/cltest001");
    const response = await GET_BY_ID(request, makeParams("cltest001"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("Toyota Avanza");
    expect(data.features).toEqual(["AC", "USB Charger"]);
  });

  it("should return 404 if vehicle not found", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

    const request = makeRequest("/api/vehicles/nonexistent");
    const response = await GET_BY_ID(request, makeParams("nonexistent"));

    expect(response.status).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════
// TEST SUITE: PUT /api/vehicles/:id
// ═══════════════════════════════════════════════════════════
describe("PUT /api/vehicles/:id", () => {
  it("should update vehicle and recreate packages", async () => {
    const updateBody = {
      ...sampleVehicle,
      name: "Toyota Avanza Updated",
      features: ["AC", "USB Charger", "GPS"],
      packages: [
        {
          duration: "full_day",
          driverType: "self_drive",
          fuelOption: "with_fuel",
          price: 500000,
        },
      ],
    };

    const updatedVehicle = {
      ...sampleVehicle,
      name: "Toyota Avanza Updated",
      features: '["AC","USB Charger","GPS"]',
    };

    (prisma.vehicle.findUnique as jest.Mock)
      .mockResolvedValueOnce({ imageUrl: "vehicles/avanza.jpg" }) // currentVehicle
      .mockResolvedValueOnce({ ...updatedVehicle, packages: updateBody.packages }); // finalVehicle
    (prisma.vehicle.update as jest.Mock).mockResolvedValue(updatedVehicle);
    (prisma.rentalPackage.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.rentalPackage.createMany as jest.Mock).mockResolvedValue({});
    (prisma.vehicle.updateMany as jest.Mock).mockResolvedValue({});

    const request = makeRequest("/api/vehicles/cltest001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateBody),
    });

    const response = await PUT(request, makeParams("cltest001"));
    const data = await response.json();

    expect(response.status).toBe(200);
    // Verify old packages were deleted before new ones were created
    expect(prisma.rentalPackage.deleteMany).toHaveBeenCalledWith({
      where: { vehicleId: "cltest001" },
    });
    expect(prisma.rentalPackage.createMany).toHaveBeenCalled();
  });

  it("should delete old image from Supabase when image changes", async () => {
    const updateBody = {
      ...sampleVehicle,
      imageUrl: "vehicles/avanza-new.jpg",
    };

    (prisma.vehicle.findUnique as jest.Mock)
      .mockResolvedValueOnce({ imageUrl: "vehicles/avanza-old.jpg" })
      .mockResolvedValueOnce({ ...sampleVehicle, imageUrl: "vehicles/avanza-new.jpg", packages: [] });
    (prisma.vehicle.update as jest.Mock).mockResolvedValue(sampleVehicle);
    (prisma.rentalPackage.deleteMany as jest.Mock).mockResolvedValue({});
    (prisma.vehicle.updateMany as jest.Mock).mockResolvedValue({});

    const request = makeRequest("/api/vehicles/cltest001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateBody),
    });

    await PUT(request, makeParams("cltest001"));

    expect(deleteFile).toHaveBeenCalledWith("vehicles/avanza-old.jpg");
  });
});

// ═══════════════════════════════════════════════════════════
// TEST SUITE: DELETE /api/vehicles/:id
// ═══════════════════════════════════════════════════════════
describe("DELETE /api/vehicles/:id", () => {
  it("should delete vehicle and its image from storage", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({
      imageUrl: "vehicles/avanza.jpg",
    });
    (prisma.vehicle.delete as jest.Mock).mockResolvedValue({});

    const request = makeRequest("/api/vehicles/cltest001", { method: "DELETE" });
    const response = await DELETE(request, makeParams("cltest001"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.vehicle.delete).toHaveBeenCalledWith({
      where: { id: "cltest001" },
    });
    expect(deleteFile).toHaveBeenCalledWith("vehicles/avanza.jpg");
  });

  it("should delete vehicle even if it has no image", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({
      imageUrl: null,
    });
    (prisma.vehicle.delete as jest.Mock).mockResolvedValue({});

    const request = makeRequest("/api/vehicles/cltest002", { method: "DELETE" });
    const response = await DELETE(request, makeParams("cltest002"));

    expect(response.status).toBe(200);
    expect(deleteFile).not.toHaveBeenCalled();
  });

  it("should return 500 on deletion error", async () => {
    (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ imageUrl: null });
    (prisma.vehicle.delete as jest.Mock).mockRejectedValue(
      new Error("Foreign key constraint")
    );

    const request = makeRequest("/api/vehicles/cltest001", { method: "DELETE" });
    const response = await DELETE(request, makeParams("cltest001"));

    expect(response.status).toBe(500);
  });
});
