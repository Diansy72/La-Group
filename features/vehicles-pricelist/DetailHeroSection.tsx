"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import Button from "@/components/atoms/button";
import { Vehicle, RentalPackage } from "@/types";
import { formatVehiclePrice } from "@/lib/formatters";
import { useTranslations } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";

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

export default function DetailHeroSection({
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

  // Generate WhatsApp booking URL with detailed package choices
  const getWhatsAppUrl = () => {
    let msg = "";
    if (packages && packages.length > 0 && selectedDuration && selectedDriver && selectedFuel) {
      const durationLabel = selectedDuration === "full_day" ? t("fullDay") : t("halfDay");
      const driverLabel = selectedDriver === "self_drive" ? tPrice("selfDrive") : tPrice("withDriver");
      const fuelLabel = selectedFuel === "with_fuel" ? t("withFuel") : t("withoutFuel");
      
      msg = t("bookingMsgCar", {
        name: vehicle.name,
        duration: durationLabel,
        driver: driverLabel,
        fuel: fuelLabel,
      });
    } else if (vehicle.type === "motorcycle") {
      msg = t("bookingMsgMotor", { name: vehicle.name });
    } else {
      msg = t("bookingMsg", { name: vehicle.name }); 
    }
    return `https://wa.me/6281211190448?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section className="relative overflow-hidden px-4 md:px-8 xl:px-0 py-20 bg-(--primary)/95">

      {/* Background Depth */}
      <div className="absolute inset-0 z-0">
        {/* Soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />

        {/* Top glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px]" />

        {/* Bottom-right shadow */}
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-black/10 blur-[100px]" />
      </div>

      {/* Spotlight */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 1800px 1400px at 50% -300px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.35) 15%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.05) 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/vehicles-pricelist"
          className="mb-6 inline-flex items-center gap-1 text-sm text-white transition-all duration-300 hover:text-white/80 hover:translate-x-1"
        >
          ← {t("backToPricelist")}
        </Link>

        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Vehicle Image */}
          <div className="relative h-[280px] md:h-[400px] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={getPublicUrl(vehicle.imageUrl) || "/images/placeholder.png"}
              alt={vehicle.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Vehicle Info */}
          <div>
            <h1 className="mb-3 text-2xl font-semibold text-white md:text-4xl">
              {vehicle.name}
            </h1>

            <p className="mb-6 max-w-md text-sm text-gray-200 md:text-base">
              {vehicle.description}
            </p>

            <p className="mb-1 text-sm font-medium text-yellow-400">
              {packages && packages.length > 0 ? t("specs") : t("startFrom")}
            </p>

            <h2 className="mb-6 text-2xl font-semibold text-white md:text-3xl">
              {vehicle.pricePerDay ? `${formatVehiclePrice(vehicle.pricePerDay)} / ${tPrice("day")}` : "-"}
            </h2>

            <Button variant="blue" className="rounded-lg px-6 py-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("bookNow")}
              </a>
            </Button>

            <p className="mt-4 max-w-sm text-xs text-gray-200">
              {t("priceNote")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}