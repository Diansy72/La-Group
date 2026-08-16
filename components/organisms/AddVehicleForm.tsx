"use client";

import React, { useState } from "react";
import { X, Motorbike, Car, Tag } from "lucide-react";
import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import ImageUpload from "@/components/molecules/ImageUpload";
import { Vehicle } from "@/types";

interface AddVehicleFormProps {
  type?: "motorcycle" | "car";
  nextId?: string;
  initialData?: Vehicle;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

export default function AddVehicleForm({ type, nextId, initialData, onClose, onSave }: AddVehicleFormProps) {
  const formType = initialData?.type || type || "car";

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    licensePlate: initialData?.licensePlate || "",
    pricePerDay: initialData && initialData.pricePerDay ? String(initialData.pricePerDay) : "",
    rentalDuration: initialData?.rentalDuration || "Full Day",
    maxSpeed: initialData && initialData.maxSpeed ? String(initialData.maxSpeed) : "",
    seatCapacity: initialData && initialData.seatCapacity ? String(initialData.seatCapacity) : "",
    selfDrive: initialData?.selfDrive === false ? "NO" : "YES",
    hasPhoneCharger: initialData?.hasPhoneCharger || false,
    withFuel: initialData?.withFuel || false,
    features: initialData?.features || ([] as string[]),
    imageUrl: initialData?.imageUrl || "",
  });

  const defaultCarPackages = [
    { duration: "full_day", driverType: "self_drive", fuelOption: "with_fuel", price: "" },
    { duration: "full_day", driverType: "self_drive", fuelOption: "without_fuel", price: "" },
    { duration: "full_day", driverType: "with_driver", fuelOption: "with_fuel", price: "" },
    { duration: "full_day", driverType: "with_driver", fuelOption: "without_fuel", price: "" },
    { duration: "half_day", driverType: "self_drive", fuelOption: "with_fuel", price: "" },
    { duration: "half_day", driverType: "self_drive", fuelOption: "without_fuel", price: "" },
    { duration: "half_day", driverType: "with_driver", fuelOption: "with_fuel", price: "" },
    { duration: "half_day", driverType: "with_driver", fuelOption: "without_fuel", price: "" },
  ];

  const initialPackages = initialData?.packages && initialData.packages.length > 0
    ? defaultCarPackages.map(def => {
        const matched = initialData.packages?.find(
          p => p.duration === def.duration &&
               p.driverType === def.driverType &&
               p.fuelOption === def.fuelOption
        );
        return matched ? { ...def, price: String(matched.price) } : def;
      })
    : defaultCarPackages;

  const [carPackages, setCarPackages] = useState(initialPackages);

  const [currentFeature, setCurrentFeature] = useState("");

  const handleSave = () => {
    const isCar = formType === "car";
    const newVehicle: Vehicle = {
      id: initialData ? initialData.id : (nextId || String(Date.now())),
      name: formData.name || "New Vehicle",
      type: formType,
      licensePlate: formData.licensePlate || "XX 0000 XX",
      pricePerDay: isCar ? undefined : (parseInt(formData.pricePerDay.replace(/\D/g, "")) || 0),
      status: initialData ? initialData.status : "available",
      imageUrl: formData.imageUrl || null,
      category: initialData ? initialData.category : (formType === "car" ? "Car" : "Motorcycle"),
      createdAt: initialData ? initialData.createdAt : new Date().toISOString().split("T")[0],
      rentalDuration: isCar ? undefined : formData.rentalDuration,
      maxSpeed: parseInt(formData.maxSpeed) || undefined,
      seatCapacity: parseInt(formData.seatCapacity) || (formType === "car" ? 4 : 2),
      selfDrive: isCar ? undefined : formData.selfDrive === "YES",
      hasPhoneCharger: formData.hasPhoneCharger,
      withFuel: isCar ? undefined : formData.withFuel,
      features: formData.features,
      packages: isCar ? carPackages
        .filter(pkg => pkg.price.trim() !== "")
        .map(pkg => ({
          duration: pkg.duration as "full_day" | "half_day",
          driverType: pkg.driverType as "self_drive" | "with_driver",
          fuelOption: pkg.fuelOption as "with_fuel" | "without_fuel",
          price: parseInt(pkg.price.replace(/\D/g, "")) || 0
        })) : undefined
    };
    onSave(newVehicle);
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#003B73] flex items-center justify-center text-white">
            {formType === "car" ? <Car size={20} /> : <Motorbike size={20} />}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit" : "Add"} {formType === "car" ? "Car" : "Motorcycle"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Row 1 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Vehicle Name
          </label>
          <Input
            className="bg-gray-50 border border-gray-300"
            placeholder="e.g. Honda Beat"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Plate Number
          </label>
          <Input
            className="bg-gray-50 border border-gray-300"
            placeholder="e.g. AB 1234 CD"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          />
        </div>
        {formType === "motorcycle" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Price per Day (Rp)
              </label>
              <Input
                type="number"
                className="bg-gray-50 border border-gray-300"
                placeholder="e.g. 100000"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rental Duration
              </label>
              <div className="relative">
                <select
                  value={formData.rentalDuration}
                  onChange={(e) => setFormData({ ...formData, rentalDuration: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all cursor-pointer"
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Row 2 */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Max Speed
          </label>
          <Input
            type="number"
            className="bg-gray-50 border border-gray-300"
            placeholder="e.g. 100"
            value={formData.maxSpeed}
            onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Seat Capacity
          </label>
          <Input
            type="number"
            className="bg-gray-50 border border-gray-300"
            placeholder="e.g. 2"
            value={formData.seatCapacity}
            onChange={(e) => setFormData({ ...formData, seatCapacity: e.target.value })}
          />
        </div>
        {formType === "motorcycle" && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Type Drive
            </label>
            <div className="relative">
              <select
                value={formData.selfDrive}
                onChange={(e) => setFormData({ ...formData, selfDrive: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all cursor-pointer"
              >
                <option value="YES">Self Drive</option>
                <option value="NO">With Drive</option>
              </select>
            </div>
          </div>
        )}
        <ImageUpload
          label="Vehicle Image"
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          className="md:col-span-1"
          folder="pricelist"
        />
        {(formType === "motorcycle" || formType === "car") && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Charger Phone
            </label>
            <div className="relative">
              <select
                value={formData.hasPhoneCharger ? "YES" : "NO"}
                onChange={(e) => setFormData({ ...formData, hasPhoneCharger: e.target.value === "YES" })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all cursor-pointer"
              >
                <option value="YES">✓ YES</option>
                <option value="NO">✕ NO</option>
              </select>
            </div>
          </div>
        )}
        {formType === "motorcycle" && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              BBM
            </label>
            <div className="relative">
              <select
                value={formData.withFuel ? "YES" : "NO"}
                onChange={(e) => setFormData({ ...formData, withFuel: e.target.value === "YES" })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 transition-all cursor-pointer"
              >
                <option value="YES">Dengan BBM</option>
                <option value="NO">Tanpa BBM</option>
              </select>
            </div>
          </div>
        )}

        {/* 8 Packages Grid for Cars only */}
        {formType === "car" && (
          <div className="col-span-1 md:col-span-4 border-t pt-6 mt-4">
            <h3 className="text-base font-bold text-gray-900 mb-4">Rental Packages Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {carPackages.map((pkg, idx) => {
                const durationLabel = pkg.duration === "full_day" ? "Full Day" : "Half Day";
                const driverLabel = pkg.driverType === "self_drive" ? "Self Drive" : "With Driver";
                const fuelLabel = pkg.fuelOption === "with_fuel" ? "BBM" : "No BBM";
                const label = `${durationLabel} + ${driverLabel} + ${fuelLabel}`;

                return (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      {label}
                    </label>
                    <Input
                      type="number"
                      className="bg-white border border-gray-300"
                      placeholder="Price (Rp)"
                      value={pkg.price}
                      onChange={(e) => {
                        const updated = [...carPackages];
                        updated[idx].price = e.target.value;
                        setCarPackages(updated);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Row 3 - Additional Features */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Tag size={16} />
          Additional Features
        </label>

        {formData.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.features.map((feature, idx) => (
              <span
                key={`${feature}-${idx}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F1F9] text-[#003B73] rounded-full text-xs font-medium"
              >
                {feature}

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      features: prev.features.filter((_, index) => index !== idx),
                    }))
                  }
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddFeature();
          }}
          className="grid grid-cols-[1fr_auto] gap-3 w-full"
        >
          <Input
            className="bg-gray-50 w-full"
            placeholder="Add Feature..."
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
          />

          <Button
            type="submit"
            variant="blue"
            className="bg-[#E8F1F9] text-[#003B73] hover:bg-[#D1E3F4]"
          >
            Add
          </Button>
        </form>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          className="bg-[#003B73] hover:bg-[#002A54] text-white px-8"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button
          variant="blue"
          className="bg-gray-50 text-gray-900 border-transparent hover:bg-gray-200 px-6"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
