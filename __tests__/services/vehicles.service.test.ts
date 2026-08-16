/**
 * Unit Tests for Frontend Vehicles Service API wrapper
 */

import {
  getVehicles,
  getVehicleById,
  deleteVehicle,
  saveVehicle,
  createBooking,
  cancelBooking,
} from "@/features/vehicles-pricelist/services/api";
import { Vehicle } from "@/types";

const mockVehicle: Vehicle = {
  id: "v-001",
  name: "Toyota Avanza",
  type: "car",
  licensePlate: "DK 123 AA",
  pricePerDay: 400000,
  status: "available",
  category: "MPV",
  imageUrl: null,
  createdAt: "2026-07-20",
};

describe("Vehicles Frontend Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("getVehicles should make GET request and return list of vehicles", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockVehicle],
    });

    const result = await getVehicles();

    expect(fetch).toHaveBeenCalledWith("/api/vehicles");
    expect(result).toEqual([mockVehicle]);
  });

  it("getVehicleById should make GET request with specific ID", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockVehicle,
    });

    const result = await getVehicleById("v-001");

    expect(fetch).toHaveBeenCalledWith("/api/vehicles/v-001");
    expect(result).toEqual(mockVehicle);
  });

  it("deleteVehicle should make DELETE request to specific ID", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await deleteVehicle("v-001");

    expect(fetch).toHaveBeenCalledWith("/api/vehicles/v-001", {
      method: "DELETE",
    });
    expect(result.success).toBe(true);
  });

  it("saveVehicle should make POST request when creating a new vehicle", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockVehicle,
    });

    await saveVehicle(mockVehicle, false);

    expect(fetch).toHaveBeenCalledWith("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockVehicle),
    });
  });

  it("saveVehicle should make PUT request when editing an existing vehicle", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockVehicle,
    });

    await saveVehicle(mockVehicle, true);

    expect(fetch).toHaveBeenCalledWith("/api/vehicles/v-001", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockVehicle),
    });
  });

  it("createBooking should make POST request with booking payload", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "booking-001" }),
    });

    const payload = {
      vehicleId: "v-001",
      customer: "Budi",
      phone: "0812",
      bookingDate: "2026-07-25",
      time: "08:00",
      duration: "Full Day",
    };

    await createBooking(payload);

    expect(fetch).toHaveBeenCalledWith("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  });

  it("cancelBooking should make PUT request to cancel booking", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await cancelBooking("v-001");

    expect(fetch).toHaveBeenCalledWith("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: "v-001", status: "CANCELLED" }),
    });
  });
});
