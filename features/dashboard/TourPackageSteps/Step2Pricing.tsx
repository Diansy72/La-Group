import React, { useState } from "react";
import { Car, Bus, Plus, ChevronRight, ChevronDown, Users } from "lucide-react";
import Button from "@/components/atoms/button";
import { TourPackageFormData, Vehicle } from "@/types";
import { mockVehicles } from "@/features/dashboard/services/data";

interface CustomVehicle {
  id: string;
  name: string;
  type: string;
  category: string;
  seatCapacity: number;
}

interface Step2Props {
  formData: TourPackageFormData;
  setFormData: React.Dispatch<React.SetStateAction<TourPackageFormData>>;
}

export default function Step2Pricing({ formData, setFormData }: Step2Props) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [personPrice, setPersonPrice] = useState("");

  const [customVehicles, setCustomVehicles] = useState<CustomVehicle[]>([]);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCapacity, setCustomCapacity] = useState("4");

  const getVehicleCapacity = (v: Vehicle | CustomVehicle) =>
    v.seatCapacity || (v.category === "MPV" ? 6 : v.category === "Bus" || v.category === "Minibus" ? 15 : 4);

  const predefinedPrivateCars: CustomVehicle[] = [
    { id: "pc-1", name: "Agya", type: "car", category: "Car", seatCapacity: 5 },
    { id: "pc-2", name: "Brio", type: "car", category: "Car", seatCapacity: 5 },
    { id: "pc-3", name: "Jazz", type: "car", category: "Car", seatCapacity: 5 },
    { id: "pc-4", name: "Mobilio", type: "car", category: "Car", seatCapacity: 7 },
    { id: "pc-5", name: "G Avanza", type: "car", category: "Car", seatCapacity: 7 },
    { id: "pc-6", name: "Xenia", type: "car", category: "Car", seatCapacity: 7 },
    { id: "pc-7", name: "Xpander", type: "car", category: "Car", seatCapacity: 7 },
    { id: "pc-8", name: "Innova", type: "car", category: "Car", seatCapacity: 7 },
    { id: "pc-9", name: "Zenix", type: "car", category: "Car", seatCapacity: 7 },
  ];

  const allVehicles = formData.priceType === "per_car"
    ? [...predefinedPrivateCars, ...customVehicles]
    : [...mockVehicles, ...customVehicles].filter((v) => {
        return v.type === "minibus" || v.category === "Minibus" || v.category === "Bus";
      });

  // Auto max pax: sum of all added vehicle seat capacities
  const maxPax = formData.pricingOptions.reduce((sum, po) => sum + (po.capacity || 0), 0);

  const handleAddPricing = () => {
    if (!selectedVehicle) return;
    const vehicle = allVehicles.find((v) => v.id.toString() === selectedVehicle);
    if (!vehicle) return;

    if (formData.priceType === "per_car") {
      if (!carPrice) return;
      setFormData((prev) => ({
        ...prev,
        pricingOptions: [
          ...prev.pricingOptions,
          {
            id: `price-${Date.now()}`,
            type: "per_car" as const,
            vehicleName: vehicle.name,
            capacity: getVehicleCapacity(vehicle),
            price: parseInt(carPrice),
          },
        ],
      }));
      setSelectedVehicle("");
      setCarPrice("");
    } else {
      if (!personPrice) return;
      setFormData((prev) => ({
        ...prev,
        pricingOptions: [
          ...prev.pricingOptions,
          {
            id: `price-${Date.now()}`,
            type: "per_person" as const,
            vehicleName: vehicle.name,
            capacity: getVehicleCapacity(vehicle),
            price: parseInt(personPrice),
          },
        ],
      }));
      setSelectedVehicle("");
      setPersonPrice("");
    }
  };

  const handleSaveCustomVehicle = () => {
    if (!customName || !customCapacity) return;
    const newVehicle = {
      id: `cv-${Date.now()}`,
      name: customName,
      type: formData.priceType === "per_car" ? "car" : "minibus",
      category: formData.priceType === "per_car" ? "Car" : "Minibus",
      seatCapacity: parseInt(customCapacity),
    };
    setCustomVehicles((prev) => [...prev, newVehicle]);
    setIsCustomFormOpen(false);
    setCustomName("");
    setCustomCapacity("4");
  };

  return (
    <div className="space-y-6">
      {/* Mode banner + auto max pax */}
      <div className="bg-blue-900/5 p-4 rounded-xl border border-blue-900/20 flex items-center gap-4">
        <div className="text-blue-900 shrink-0">
          {formData.priceType === "per_car" ? <Car size={24} /> : <Bus size={24} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">
            {formData.priceType === "per_car" ? "Price per Car Mode" : "Price per Person Mode"}
          </h4>
          <p className="text-sm text-gray-500">
            {formData.priceType === "per_car"
              ? "Select cars and set price per car"
              : "Select buses and set price per person"}
          </p>
        </div>
        {maxPax > 0 && (
          <div className="ml-auto flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shrink-0">
            <Users size={16} className="text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">Max {maxPax} pax</span>
          </div>
        )}
      </div>

      {/* Add vehicle row */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">
          {formData.priceType === "per_car" ? "Add Vehicle — Cars" : "Add Vehicle — Buses"}
        </h4>

        <div className="flex items-center gap-3">
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all cursor-pointer"
          >
            <option value="">Select vehicle...</option>
            {allVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({getVehicleCapacity(v)} seat)
              </option>
            ))}
          </select>
          <input
            type="number"
            value={formData.priceType === "per_car" ? carPrice : personPrice}
            onChange={(e) =>
              formData.priceType === "per_car" ? setCarPrice(e.target.value) : setPersonPrice(e.target.value)
            }
            className="w-48 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
            placeholder={formData.priceType === "per_car" ? "Price / car (Rp)" : "Price / person (Rp)"}
          />
          <Button
            className="bg-blue-900 hover:bg-blue-800 text-white shrink-0"
            onClick={handleAddPricing}
            disabled={!selectedVehicle || (formData.priceType === "per_car" ? !carPrice : !personPrice)}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Custom vehicle — simplified: name + seat only */}
      <div className="mt-4">
        <button
          className="text-sm font-semibold text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
          onClick={() => setIsCustomFormOpen(!isCustomFormOpen)}
        >
          <Plus size={16} /> Add Custom Vehicle
          {isCustomFormOpen ? <ChevronDown size={14} className="ml-1" /> : <ChevronRight size={14} className="ml-1" />}
        </button>

        {isCustomFormOpen && (
          <div className="mt-4 bg-slate-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Vehicle Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                  placeholder="e.g. Toyota HiAce"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Seat Count</label>
                <input
                  type="number"
                  min={1}
                  value={customCapacity}
                  onChange={(e) => setCustomCapacity(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>
              <Button
                className="bg-blue-900 hover:bg-blue-800 text-white shrink-0"
                onClick={handleSaveCustomVehicle}
                disabled={!customName || !customCapacity}
              >
                <Plus size={16} className="mr-1" /> Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
