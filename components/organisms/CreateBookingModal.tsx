"use client";

import React, { useState, useEffect } from "react";
import { X, CalendarCheck, Tag, Wallet, BadgeDollarSign } from "lucide-react";
import Button from "@/components/atoms/button";
import { Vehicle, RentalPackage } from "@/types";
import { formatCurrency } from "@/features/dashboard/services/data";

interface BookingSubmitData {
  customerName: string;
  phone: string;
  startDate: string;
  endDate: string;
  time: string;
  notes: string;
  packageId?: string;
  basePrice?: number;
  finalPrice?: number;
}

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSubmit: (vehicleId: string, bookingData: BookingSubmitData) => void;
}

function getPackageLabel(pkg: RentalPackage): string {
  const duration = pkg.duration === "full_day" ? "Full Day" : "Half Day";
  const driver = pkg.driverType === "self_drive" ? "Self Drive" : "With Driver";
  const fuel = pkg.fuelOption === "with_fuel" ? "BBM Included" : "No BBM";
  return `${duration} · ${driver} · ${fuel} — ${formatCurrency(pkg.price)}`;
}

export default function CreateBookingModal({ isOpen, onClose, vehicle, onSubmit }: CreateBookingModalProps) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    startDate: "",
    endDate: "",
    time: "08:00",
    notes: "",
  });

  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [finalPrice, setFinalPrice] = useState<number | "">("");

  // Reset form when vehicle changes or modal opens
  useEffect(() => {
    if (isOpen && vehicle) {
      setForm({ customerName: "", phone: "", startDate: "", endDate: "", time: "08:00", notes: "" });
      setSelectedPackageId("");
      if (vehicle.type !== "car") {
        setBasePrice(vehicle.pricePerDay || "");
        setFinalPrice(vehicle.pricePerDay || "");
      } else {
        setBasePrice("");
        setFinalPrice("");
      }
    }
  }, [isOpen, vehicle?.id]);

  if (!isOpen || !vehicle) return null;

  const isCar = vehicle.type === "car";
  const activePackages: RentalPackage[] = isCar
    ? (vehicle.packages || []).filter((p) => p.price > 0)
    : [];

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const pkg = activePackages.find((p) => p.id === pkgId);
    if (pkg) {
      setBasePrice(pkg.price);
      setFinalPrice(pkg.price); // default final = base, editable
    } else {
      setBasePrice("");
      setFinalPrice("");
    }
  };

  const handleSubmit = () => {
    if (!form.customerName || !form.startDate || !form.endDate || !form.time) return;
    onSubmit(vehicle.id, {
      ...form,
      packageId: selectedPackageId || undefined,
      basePrice: basePrice !== "" ? Number(basePrice) : undefined,
      finalPrice: finalPrice !== "" ? Number(finalPrice) : undefined,
    });
    onClose();
  };

  const isValid =
    form.customerName &&
    form.startDate &&
    form.endDate &&
    form.time &&
    (!isCar || !activePackages.length || selectedPackageId); // For cars with packages, package is required

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create Booking</h3>
              <p className="text-xs text-gray-500">{vehicle.name} — {vehicle.licensePlate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Customer Name *</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              placeholder="Nama pelanggan"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              placeholder="+62 812-xxxx-xxxx"
            />
          </div>

          {/* Dates & Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Booking Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
          </div>

          {/* Package Dropdown — cars only */}
          {isCar && activePackages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5 flex items-center gap-1.5">
                <Tag size={13} className="text-blue-900" />
                Rental Package *
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => handlePackageChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
              >
                <option value="">— Pilih paket rental —</option>
                {activePackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {getPackageLabel(pkg)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Section — shown when package is selected OR for non-cars (motorcycles/minibuses) */}
          {(selectedPackageId || (!isCar && vehicle.pricePerDay)) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              {/* Base Price (read-only auto-filled) */}
              <div>
                <label className="block text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                  <Wallet size={12} />
                  {isCar ? "Base Package Price (auto-filled)" : "Base Price (auto-filled)"}
                </label>
                <div className="w-full bg-white border border-blue-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-900">
                  {basePrice !== "" ? formatCurrency(Number(basePrice)) : "-"}
                </div>
              </div>

              {/* Final / Deal Price (editable) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <BadgeDollarSign size={12} />
                  Final Deal Price (editable)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
                {finalPrice !== "" && basePrice !== "" && Number(finalPrice) !== Number(basePrice) && (
                  <p className={`text-xs mt-1 ${Number(finalPrice) < Number(basePrice) ? "text-orange-500" : "text-green-600"}`}>
                    {Number(finalPrice) < Number(basePrice)
                      ? `Diskon Rp ${(Number(basePrice) - Number(finalPrice)).toLocaleString("id-ID")}`
                      : `+Rp ${(Number(finalPrice) - Number(basePrice)).toLocaleString("id-ID")} ${isCar ? "dari harga paket" : "dari harga normal"}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
              placeholder="Catatan tambahan..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="blue" onClick={onClose}>Batal</Button>
          <Button
            icon={<CalendarCheck size={16} />}
            onClick={handleSubmit}
            disabled={!isValid}
          >
            Create Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
