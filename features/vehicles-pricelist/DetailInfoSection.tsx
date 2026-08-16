"use client";

import { AlertTriangle } from "lucide-react";
import { Vehicle } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  vehicle: Vehicle;
};

export default function DetailInfoSection({ vehicle }: Props) {
  const t = useTranslations("VehicleDetail");

  // Derive additional info dynamically from real vehicle data
  const additionalInfo: string[] = [
    t("bookingConfirm"),
    vehicle.selfDrive
      ? t("driverOnRequest")
      : t("driverIsIncluded"),
    vehicle.withFuel
      ? t("fuelIncluded")
      : t("fuelNotIncluded"),
    t("overtimeCharge"),
    ...(vehicle.type === "minibus"
      ? [t("validForGroup")]
      : []),
  ];

  return (
    <section className="px-4 md:px-8 xl:px-0 py-10 md:py-20">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {t("additionalInfo")}
        </h2>
        <p className="text-gray-500 mt-2">
          {t("importantNotes")}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {additionalInfo.map((item, i) => (
            <div
              key={i}
              className="border border-yellow-400 bg-yellow-50 rounded-lg px-4 py-3 text-left text-sm text-gray-700 transition-all duration-300 cursor-pointer flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 hover:bg-yellow-100"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
