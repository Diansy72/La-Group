jest.mock("@/lib/supabase/storage", () => ({
  deleteFile: jest.fn(),
}));

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { deleteFile } from "@/lib/supabase/storage";
import { GET, POST } from "@/app/api/tours/route";
import { GET as GET_BY_ID, PUT, DELETE } from "@/app/api/tours/[id]/route";


function makeRequest(url: string, options: RequestInit = {}) {
  return new Request(`http://localhost:3000${url}`, options);
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const sampleTour = {
  id: "pkg-001",
  title: "Bali Classic Tour",
  titleEn: "Bali Classic Tour",
  description: "A classic tour around Bali",
  descriptionEn: "A classic tour around Bali En",
  imageUrl: "tours/bali.jpg",
  estimatedPrice: 1500000,
  duration: "3 Days",
  minPax: 2,
  maxPax: 10,
  startTime: "08:00",
  endTime: "18:00",
  category: "culture",
  priceType: "per_person",
  status: "active",
  recommendation: "Best Seller",
  includes: '["Hotel", "Breakfast"]',
  excludes: '["Flight tickets"]',
  vehicleOptions: '[{"name":"Avanza","capacity":4,"pricePerDay":500000}]',
  itinerary: '[{"day":1,"title":"Arrival"}]',
  destinationTags: '["Kuta","Ubud"]',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Tours API Routes", () => {
  describe("GET /api/tours", () => {
    it("should return parsed JSON arrays of tours", async () => {
      (prisma.tourPackage.findMany as jest.Mock).mockResolvedValue([sampleTour]);

      const res = await GET(makeRequest("/api/tours"));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data[0].includes).toEqual(["Hotel", "Breakfast"]);
      expect(data[0].excludes).toEqual(["Flight tickets"]);
      expect(data[0].vehicleOptions).toEqual([
        { name: "Avanza", capacity: 4, pricePerDay: 500000 },
      ]);
      expect(data[0].destinationTags).toEqual(["Kuta", "Ubud"]);
    });
  });

  describe("POST /api/tours", () => {
    it("should create tour with incremental pkg ID", async () => {
      (prisma.tourPackage.findFirst as jest.Mock).mockResolvedValue(sampleTour); // pkg-001 is last
      (prisma.tourPackage.create as jest.Mock).mockResolvedValue({
        ...sampleTour,
        id: "pkg-002",
        title: "Bali Adv",
      });

      const body = {
        title: "Bali Adv",
        includes: ["Adventures"],
      };

      const res = await POST(
        makeRequest("/api/tours", {
          method: "POST",
          body: JSON.stringify(body),
        })
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe("pkg-002");
      expect(prisma.tourPackage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: "pkg-002",
          }),
        })
      );
    });
  });

  describe("GET /api/tours/:id", () => {
    it("should return one tour with parsed data", async () => {
      (prisma.tourPackage.findUnique as jest.Mock).mockResolvedValue(sampleTour);

      const res = await GET_BY_ID(makeRequest("/api/tours/pkg-001"), makeParams("pkg-001"));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe("pkg-001");
    });
  });

  describe("PUT /api/tours/:id", () => {
    it("should update tour details and delete old image if replaced", async () => {
      (prisma.tourPackage.findUnique as jest.Mock).mockResolvedValue({
        imageUrl: "tours/old.jpg",
      });
      (prisma.tourPackage.update as jest.Mock).mockResolvedValue({
        ...sampleTour,
        imageUrl: "tours/new.jpg",
      });

      const res = await PUT(
        makeRequest("/api/tours/pkg-001", {
          method: "PUT",
          body: JSON.stringify({
            title: "Updated",
            imageUrl: "tours/new.jpg",
          }),
        }),
        makeParams("pkg-001")
      );

      expect(res.status).toBe(200);
      expect(deleteFile).toHaveBeenCalledWith("tours/old.jpg");
    });
  });

  describe("DELETE /api/tours/:id", () => {
    it("should delete tour and its image", async () => {
      (prisma.tourPackage.findUnique as jest.Mock).mockResolvedValue({
        imageUrl: "tours/bali.jpg",
      });
      (prisma.tourPackage.delete as jest.Mock).mockResolvedValue({});

      const res = await DELETE(
        makeRequest("/api/tours/pkg-001", { method: "DELETE" }),
        makeParams("pkg-001")
      );
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(deleteFile).toHaveBeenCalledWith("tours/bali.jpg");
    });
  });
});
