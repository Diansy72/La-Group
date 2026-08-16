import React, { useState } from "react";
import { X, CalendarCheck } from "lucide-react";
import Button from "@/components/atoms/button";
import { TourPackage } from "@/types";

interface CreateTourBookingModalProps {
  pkg: TourPackage;
  onClose: () => void;
  onSubmit: (data: { customerName: string; phone: string; date: string; time: string; vehicleName: string; pax: number; notes: string; totalPrice: number }) => void;
}

export default function CreateTourBookingModal({ pkg, onClose, onSubmit }: CreateTourBookingModalProps) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    date: "",
    time: "08:00",
    vehicleName: pkg.vehicleOptions?.[0]?.name || "",
    pax: 1,
    notes: "",
  });

  const handleSubmit = () => {
    // Calculate total price based on price type
    let totalPrice = 0;
    const selectedVehicle = pkg.vehicleOptions?.find(v => v.name === form.vehicleName);
    const basePrice = selectedVehicle?.pricePerDay || pkg.estimatedPrice;

    if (pkg.priceType === "per_person") {
      totalPrice = basePrice * form.pax;
    } else {
      // per car
      const carsNeeded = Math.ceil(form.pax / (selectedVehicle?.capacity || 4));
      totalPrice = basePrice * carsNeeded;
    }

    onSubmit({
      ...form,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Create Tour Booking</h3>
              <p className="text-xs text-gray-500 truncate max-w-[200px]">{pkg.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Customer Name</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              placeholder="Nama pelanggan"
            />
          </div>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Vehicle Type</label>
              <select
                value={form.vehicleName}
                onChange={(e) => setForm({ ...form, vehicleName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
              >
                {pkg.vehicleOptions?.map((v, i) => (
                  <option key={i} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Pax</label>
              <input
                type="number"
                min="1"
                value={form.pax}
                onChange={(e) => setForm({ ...form, pax: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
              />
            </div>
          </div>

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

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="blue" onClick={onClose}>Batal</Button>
          <Button
            icon={<CalendarCheck size={16} />}
            onClick={handleSubmit}
            disabled={!form.customerName || !form.phone || !form.date || !form.time}
          >
            Create Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
