import { Vehicle } from "@/types";

export async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch("/api/vehicles");
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}

export async function getVehicleById(id: string): Promise<Vehicle> {
  const res = await fetch(`/api/vehicles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch vehicle");
  return res.json();
}

export async function deleteVehicle(id: string) {
  const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vehicle");
  return res.json();
}

export async function saveVehicle(vehicle: Vehicle, isEdit: boolean) {
  const url = isEdit ? `/api/vehicles/${vehicle.id}` : "/api/vehicles";
  const method = isEdit ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Failed to save vehicle");
  return res.json();
}

export async function getBookingHistory(page: number, limit: number, search: string) {
  const res = await fetch(`/api/bookings?page=${page}&limit=${limit}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch booking history");
  return res.json();
}

interface CreateBookingData {
  vehicleId: string;
  customer: string;
  phone: string;
  bookingDate: string;
  time: string;
  duration: string;
  notes?: string;
  status?: string;
  packageId?: string;
  basePrice?: number;
  finalPrice?: number;
}

export async function createBooking(data: CreateBookingData) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}

export async function cancelBooking(vehicleId: string) {
  const res = await fetch("/api/bookings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicleId, status: "CANCELLED" }),
  });
  if (!res.ok) throw new Error("Failed to cancel booking");
  return res.json();
}
