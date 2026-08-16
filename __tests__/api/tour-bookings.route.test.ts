import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { GET, POST } from "@/app/api/tour-bookings/route";
import { GET as GET_REPORT } from "@/app/api/tour-bookings/report/route";


function makeRequest(url: string, options: RequestInit = {}) {
  return new Request(`http://localhost:3000${url}`, options);
}

const sampleTourBooking = {
  id: "tb-001",
  tourPackageId: "pkg-001",
  customerName: "Budi",
  phone: "0812345",
  bookingDate: "2026-07-25",
  time: "08:00",
  vehicleType: "Avanza",
  pax: 4,
  totalPrice: 1500000,
  status: "active",
  tourPackage: {
    title: "Bali Classic Tour",
    category: "culture",
    priceType: "per_person",
  },
  createdAt: new Date(),
};

describe("Tour Bookings API Routes", () => {
  describe("GET /api/tour-bookings", () => {
    it("should return a list of tour bookings with pagination", async () => {
      (prisma.tourBooking.findMany as jest.Mock).mockResolvedValue([sampleTourBooking]);
      (prisma.tourBooking.count as jest.Mock).mockResolvedValue(1);

      const res = await GET(makeRequest("/api/tour-bookings?page=1&limit=10"));
      const result = await res.json();

      expect(res.status).toBe(200);
      expect(result.data[0].customerName).toBe("Budi");
      expect(result.meta.total).toBe(1);
    });
  });

  describe("POST /api/tour-bookings", () => {
    it("should create a new tour booking successfully", async () => {
      (prisma.tourBooking.create as jest.Mock).mockResolvedValue(sampleTourBooking);

      const payload = {
        tourPackageId: "pkg-001",
        customerName: "Budi",
        phone: "0812345",
        bookingDate: "2026-07-25",
        time: "08:00",
        vehicleType: "Avanza",
        pax: 4,
        totalPrice: 1500000,
      };

      const res = await POST(
        makeRequest("/api/tour-bookings", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      );
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.packageName).toBe("Bali Classic Tour");
    });
  });

  describe("GET /api/tour-bookings/report", () => {
    it("should return report list within dates", async () => {
      (prisma.tourBooking.findMany as jest.Mock).mockResolvedValue([sampleTourBooking]);

      const res = await GET_REPORT(
        makeRequest("/api/tour-bookings/report?startDate=2026-07-01&endDate=2026-07-31")
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].packageName).toBe("Bali Classic Tour");
    });
  });
});
