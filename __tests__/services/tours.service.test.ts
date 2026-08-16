/**
 * Unit Tests for Frontend Tours Service API wrapper
 */

import {
  getTourPackages,
  saveTourPackage,
  deleteTourPackage,
  createTourBooking,
} from "@/features/tourpackages/services/api";
import { TourPackage } from "@/types";

const mockTour: TourPackage = {
  id: "pkg-001",
  title: "Bali Classic Tour",
  description: "A tour of Bali",
  estimatedPrice: 1500000,
  duration: "3 Days",
  minPax: 2,
  maxPax: 10,
  startTime: "08:00",
  endTime: "18:00",
  category: "culture",
  priceType: "per_person",
  status: "active",
  imageUrl: "tours/bali.jpg",
  includes: ["Hotel", "Breakfast"],
  excludes: ["Flight tickets"],
  vehicleOptions: [],
};

describe("Tours Frontend Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("getTourPackages should fetch tour packages", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockTour],
    });

    const result = await getTourPackages();

    expect(fetch).toHaveBeenCalledWith("/api/tours");
    expect(result).toEqual([mockTour]);
  });

  it("saveTourPackage should send POST request for new tour", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTour,
    });

    await saveTourPackage(mockTour, false);

    expect(fetch).toHaveBeenCalledWith("/api/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTour),
    });
  });

  it("saveTourPackage should send PUT request for existing tour", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTour,
    });

    await saveTourPackage(mockTour, true);

    expect(fetch).toHaveBeenCalledWith("/api/tours/pkg-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockTour),
    });
  });

  it("deleteTourPackage should send DELETE request", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await deleteTourPackage("pkg-001");

    expect(fetch).toHaveBeenCalledWith("/api/tours/pkg-001", {
      method: "DELETE",
    });
  });

  it("createTourBooking should send POST request to tour bookings", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "tb-001" }),
    });

    const payload = {
      tourPackageId: "pkg-001",
      customerName: "Budi",
      phone: "0812",
      bookingDate: "2026-07-25",
      time: "08:00",
      vehicleType: "Avanza",
      pax: 4,
      totalPrice: 1500000,
    };

    await createTourBooking(payload);

    expect(fetch).toHaveBeenCalledWith("/api/tour-bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });
});
