import { TourPackage } from "@/types";

export async function getTourPackages(): Promise<TourPackage[]> {
  const res = await fetch("/api/tours");
  if (!res.ok) throw new Error("Failed to fetch tours");
  return res.json();
}

export async function deleteTourPackage(id: string) {
  const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete tour package");
  return res.json();
}

export async function saveTourPackage(pkg: TourPackage, isEdit: boolean) {
  const url = isEdit ? `/api/tours/${pkg.id}` : "/api/tours";
  const method = isEdit ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pkg),
  });
  if (!res.ok) throw new Error("Failed to save tour package");
  return res.json();
}

export async function getTourBookingHistory(page: number, limit: number, search: string) {
  const res = await fetch(`/api/tour-bookings?page=${page}&limit=${limit}&search=${search}`);
  if (!res.ok) throw new Error("Failed to fetch tour booking history");
  return res.json();
}

interface CreateTourBookingData {
  tourPackageId: string;
  customerName: string;
  phone: string;
  bookingDate: string;
  time: string;
  vehicleType: string;
  pax: number;
  totalPrice: number;
  notes?: string;
}

export async function createTourBooking(data: CreateTourBookingData) {
  const res = await fetch("/api/tour-bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create tour booking");
  return res.json();
}
