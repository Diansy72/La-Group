"use client";

import { CheckCircle2 } from "lucide-react";
import { Vehicle } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  vehicle: Vehicle;
};

export default function DetailFacilitiesSection({ vehicle }: Props) {
  const t = useTranslations("VehicleDetail");

  // Derive facilities dynamically from real vehicle data
  const facilities: string[] = (vehicle.features && vehicle.features.length > 0) 
    ? vehicle.features 
    : [
        t("ac"),
        t("comfortSeats"),
        t("audio"),
        t("safety"),
        ...(vehicle.hasPhoneCharger ? [t("usbCharger")] : []),
        ...(vehicle.selfDrive ? [t("selfDriveAvail")] : [t("driverIncluded")]),
        ...(vehicle.seatCapacity && vehicle.seatCapacity >= 7 ? [t("extraLuggage")] : []),
      ];

  return (
    <section className="bg-gray-50 px-4 md:px-8 xl:px-0 py-10 md:py-20">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {t("facilitiesTitle")}
        </h2>
        <p className="text-gray-500 mt-2">
          {t("facilitiesDesc")}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {facilities.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 border border-gray-200 bg-white rounded-lg px-4 py-3 transition-all duration-300 cursor-pointer hover:border-green-400 hover:shadow-md hover:translate-x-1 hover:bg-green-50"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
