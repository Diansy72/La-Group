import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { GET, POST, PUT } from "@/app/api/bookings/route";
import { GET as GET_REPORT } from "@/app/api/bookings/report/route";


function makeRequest(url: string, options: RequestInit = {}) {
  return new Request(`http://localhost:3000${url}`, options);
}

const sampleBooking = {
  id: "bk-001",
  vehicleId: "v-001",
  customer: "Budi",
  phone: "0812345",
  bookingDate: "2026-07-25",
  time: "08:00",
  duration: "Full Day",
  status: "BOOKED",
  vehicle: {
    name: "Toyota Avanza",
    licensePlate: "DK 123 AA",
    category: "MPV",
    type: "car",
    packages: [],
  },
  createdAt: new Date(),
};

describe("Bookings API Routes", () => {
  describe("GET /api/bookings", () => {
    it("should return list of vehicle bookings with pagination", async () => {
      (prisma.vehicleBooking.findMany as jest.Mock).mockResolvedValue([sampleBooking]);
      (prisma.vehicleBooking.count as jest.Mock).mockResolvedValue(1);

      const res = await GET(makeRequest("/api/bookings?page=1&limit=10"));
      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.data[0].customer).toBe("Budi");
      expect(result.meta.total).toBe(1);
    });
  });

  describe("POST /api/bookings", () => {
    it("should create a new booking with release calculation", async () => {
      (prisma.vehicleBooking.create as jest.Mock).mockResolvedValue(sampleBooking);

      const payload = {
        vehicleId: "v-001",
        customer: "Budi",
        phone: "0812345",
        bookingDate: "2026-07-25",
        time: "08:00",
        duration: "Full Day",
      };

      const res = await POST(
        makeRequest("/api/bookings", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      );
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.vehicleName).toBe("Toyota Avanza");
    });
  });

  describe("PUT /api/bookings (Cancellation)", () => {
    it("should cancel booking and make vehicle status available", async () => {
      (prisma.vehicleBooking.findFirst as jest.Mock).mockResolvedValue({ id: "bk-001" });
      (prisma.vehicleBooking.update as jest.Mock).mockResolvedValue({});
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ licensePlate: "DK 123 AA" });
      (prisma.vehicle.updateMany as jest.Mock).mockResolvedValue({});
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue({ id: "v-001", status: "available" });

      const res = await PUT(
        makeRequest("/api/bookings", {
          method: "PUT",
          body: JSON.stringify({ vehicleId: "v-001", status: "CANCELLED" }),
        })
      );

      expect(res.status).toBe(200);
      expect(prisma.vehicleBooking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "bk-001" },
          data: { status: "CANCELLED" },
        })
      );
    });
  });

  describe("GET /api/bookings/report", () => {
    it("should return bookings based on startDate and endDate", async () => {
      (prisma.vehicleBooking.findMany as jest.Mock).mockResolvedValue([sampleBooking]);

      const res = await GET_REPORT(
        makeRequest("/api/bookings/report?startDate=2026-07-01&endDate=2026-07-31")
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].customer).toBe("Budi");
    });
  });
});
