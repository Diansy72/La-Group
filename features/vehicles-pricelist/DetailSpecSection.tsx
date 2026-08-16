"use client";

import { Users, Wrench, Gauge, Clock, Zap, Fuel } from "lucide-react";
import { Vehicle, RentalPackage } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  vehicle: Vehicle;
  packages?: RentalPackage[];
  selectedDuration?: "full_day" | "half_day";
  selectedDriver?: "self_drive" | "with_driver";
  selectedFuel?: "with_fuel" | "without_fuel";
  onSelectDuration?: (duration: "full_day" | "half_day") => void;
  onSelectDriver?: (driver: "self_drive" | "with_driver") => void;
  onSelectFuel?: (fuel: "with_fuel" | "without_fuel") => void;
  availableDurations?: Set<string>;
  availableDrivers?: Set<string>;
  availableFuels?: Set<string>;
};

export default function DetailSpecSection({
  vehicle,
  packages,
  selectedDuration,
  selectedDriver,
  selectedFuel,
  onSelectDuration,
  onSelectDriver,
  onSelectFuel,
  availableDurations,
  availableDrivers,
  availableFuels,
}: Props) {
  const t = useTranslations("VehicleDetail");
  const tPrice = useTranslations("Pricelist");

  const specs = [
    {
      icon: Users,
      title: t("capacity"),
      value: vehicle.seatCapacity ? `${vehicle.seatCapacity} ${tPrice("seat")}` : "-",
    },
    {
      icon: Wrench,
      title: t("driverService"),
      value: vehicle.selfDrive ? tPrice("selfDrive") : tPrice("withDriver"),
    },
    {
      icon: Fuel,
      title: t("bbm"),
      value: vehicle.withFuel ? t("withFuel") : t("withoutFuel"),
    },
    {
      icon: Clock,
      title: t("rentalDuration"),
      value: vehicle.rentalDuration === "Full Day"
        ? t("fullDay")
        : vehicle.rentalDuration === "Half Day"
          ? t("halfDay")
          : vehicle.rentalDuration || "-",
    },
    {
      icon: Zap,
      title: t("usb"),
      value: vehicle.hasPhoneCharger ? t("available") : t("notAvailable"),
    },
    {
      icon: Gauge,
      title: t("maxSpeed"),
      value: vehicle.maxSpeed ? `${vehicle.maxSpeed} Km/H` : "-",
    },
  ];

  return (
    <section className="px-4 md:px-8 xl:px-0 py-10 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {t("specs")}
        </h2>
        <p className="text-gray-500 mt-2">
          {t("info")}
        </p>

        {/* Dynamic Package Combination Selectors */}
        {packages && packages.length > 0 && (
          <div className="max-w-2xl mx-auto mt-8 mb-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* Duration Selector */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {t("rentalDuration")}
              </span>
              <div className="flex flex-col gap-2">
                {["full_day", "half_day"].map((d) => {
                  const isSelected = selectedDuration === d;
                  const isAvailable = availableDurations?.has(d);
                  if (!isAvailable) return null;
                  return (
                    <button
                      key={d}
                      onClick={() => onSelectDuration?.(d as "full_day" | "half_day")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 text-left ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-400 text-blue-950 font-bold shadow-md shadow-yellow-400/10"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {d === "full_day" ? t("fullDay") : t("halfDay")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Driver Type Selector */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {t("driverService")}
              </span>
              <div className="flex flex-col gap-2">
                {["self_drive", "with_driver"].map((driver) => {
                  const isSelected = selectedDriver === driver;
                  const isAvailable = availableDrivers?.has(driver);
                  if (!isAvailable) return null;
                  return (
                    <button
                      key={driver}
                      onClick={() => onSelectDriver?.(driver as "self_drive" | "with_driver")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 text-left ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-400 text-blue-950 font-bold shadow-md shadow-yellow-400/10"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {driver === "self_drive" ? tPrice("selfDrive") : tPrice("withDriver")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fuel Option Selector */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {t("bbm")}
              </span>
              <div className="flex flex-col gap-2">
                {["with_fuel", "without_fuel"].map((fuel) => {
                  const isSelected = selectedFuel === fuel;
                  const isAvailable = availableFuels?.has(fuel);
                  if (!isAvailable) return null;
                  return (
                    <button
                      key={fuel}
                      onClick={() => onSelectFuel?.(fuel as "with_fuel" | "without_fuel")}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 text-left ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-400 text-blue-950 font-bold shadow-md shadow-yellow-400/10"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {fuel === "with_fuel" ? t("withFuel") : t("withoutFuel")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {specs.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-yellow-400 p-5 flex flex-col items-center transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:bg-yellow-50"
              >
                <div className={`shrink-0 p-2.5 rounded-xl bg-yellow-50 group-hover:scale-110 transition-transform duration-300 mb-3`}>
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-yellow-400 text-yellow-500">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">{item.title}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
