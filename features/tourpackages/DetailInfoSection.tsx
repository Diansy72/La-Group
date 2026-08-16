import { Clock, Car, MapPin, CheckCircle, XCircle } from "lucide-react";
import { TourPackage } from "@/types";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  tour: TourPackage;
};

export default function DetailInfoSection({ tour }: Props) {
  const locale = useLocale();
  const t = useTranslations("TourDetail");

  const displayDescription = locale === "en" ? (tour.descriptionEn || tour.description) : tour.description;
  const firstVehicle = tour.vehicleOptions?.[0]?.name || "Bus / Car";
  const firstDestination = tour.destinationTags?.[0] || "Yogyakarta";

  return (
    <>
      {/* DESC */}
      <p className="text-gray-600 text-base md:text-lg">{displayDescription}</p>

      {/* INFO */}
      <div className="flex flex-wrap gap-3">
        {tour.duration && (
          <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 text-sm md:text-base">
            <Clock className="w-4 h-4 md:w-6 md:h-6" /> {tour.duration}
          </div>
        )}
        <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 text-sm md:text-base">
          <Car className="w-4 h-4 md:w-6 md:h-6" /> {firstVehicle}
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 text-sm md:text-base">
          <MapPin className="w-4 h-4 md:w-6 md:h-6" /> {firstDestination}
        </div>
      </div>

      {/* DESTINATIONS */}
      <div>
        <h3 className="font-medium mb-4 text-xl md:text-2xl">{t("destination")}</h3>
        <div className="flex flex-wrap gap-2">
          {(tour.destinationTags || []).map((d, i) => (
            <span
              key={i}
              className="bg-yellow-400 text-white text-xs md:text-sm px-3 py-1 rounded-full"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* COST INFO */}
      <div>
        <h3 className="font-medium mb-4 text-xl md:text-2xl">
          {t("costInfo")}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* INCLUDED */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              {t("included")}
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {(tour.includes?.length ? tour.includes : ["Transportation", "Tour guide", "Tickets"]).map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* NOT INCLUDED */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              {t("notIncluded")}
            </h4>
            <ul className="text-sm text-gray-600 space-y-2">
              {(tour.excludes?.length ? tour.excludes : ["Meals", "Personal expenses"]).map(
                (item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
