import { Users, Car, Bus, CheckCircle, TriangleAlert } from "lucide-react";
import Button from "@/components/atoms/button";
import { TourPackage, PackageVehicleOption } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  tour: TourPackage;
  vehicles: PackageVehicleOption[];
  selectedVehicle: number;
  setSelectedVehicle: (index: number) => void;
  participants: number;
  setParticipants: React.Dispatch<React.SetStateAction<number>>;
  selected: PackageVehicleOption;
};

export default function DetailVehicleSection({
  tour,
  vehicles,
  selectedVehicle,
  setSelectedVehicle,
  participants,
  setParticipants,
  selected,
}: Props) {
  const t = useTranslations("TourDetail");
  const tPrice = useTranslations("Pricelist");

  return (
    <>
      {/* VEHICLES */}
      <div>
        <h3 className="font-medium mb-4 text-xl md:text-2xl">{t("vehicle")}</h3>

        <div className="space-y-3">
          {vehicles.map((v, i) => {
            const isActive = selectedVehicle === i;

            return (
              <div
                key={i}
                onClick={() => setSelectedVehicle(i)}
                className={`rounded-xl p-4 cursor-pointer border transition-all ${
                  isActive
                    ? "border-blue-900 bg-blue-50"
                    : "border-gray-200 bg-white hover:shadow"
                }`}
              >
                {/* TOP */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {/* ICON */}
                    <div className="mt-1">
                      {tour.priceType === "per_person" ? (
                        <Bus className="w-5 h-5 text-blue-900" />
                      ) : (
                        <Car className="w-5 h-5 text-blue-900" />
                      )}
                    </div>

                    {/* TITLE */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 text-base md:text-lg">
                          {v.name}
                        </p>

                        {/* CHECK ICON (ACTIVE) */}
                        {isActive && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>

                      {/* CAPACITY */}
                      <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        {t("maxPeople", { count: v.capacity })}
                      </p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <p className="text-base md:text-lg font-semibold text-blue-900">
                    Rp {v.pricePerDay.toLocaleString()}
                    {tour.priceType === "per_person" && ` / ${tPrice("person")} (max quota)`}
                  </p>
                </div>

                {/* FEATURES - Assuming 'features' might not exist on PackageVehicleOption, handle gracefully */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["AC", "Music", "Comfortable"].map((f: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs md:text-sm px-2 py-1 rounded-full bg-gray-50 text-gray-500"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PARTICIPANTS */}
      {tour.priceType === "per_person" && (
        <div>
          {/* TITLE */}
          <h3 className="font-medium text-lg md:text-2xl mb-2">
            {t("numParticipants")}
          </h3>

          {/* SUBTEXT */}
          <p className="text-sm text-gray-500 mb-4">
            {selected.name} {t("maxCapacity")}: {selected.capacity} {tPrice("person")}
          </p>

          {/* COUNTER */}
          <div className="flex items-center gap-2">
            {/* MINUS */}
            <Button
              variant="outline"
              onClick={() => setParticipants((p) => Math.max(1, p - 1))}
              className="!p-0 w-9 h-9 flex items-center justify-center rounded-lg"
            >
              −
            </Button>

            {/* VALUE */}
            <div className="w-14 h-9 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium">
              {participants}
            </div>

            {/* PLUS */}
            <Button
              variant="outline"
              onClick={() =>
                setParticipants((p) => Math.min(selected.capacity, p + 1))
              }
              className="!p-0 w-9 h-9 flex items-center justify-center rounded-lg"
            >
              +
            </Button>

            {/* LABEL */}
            <span className="ml-2 text-sm text-gray-600">{tPrice("person")}</span>
          </div>
        </div>
      )}

      {/* COST BREAKDOWN */}
      <div>
        <h3 className="font-medium mb-4 text-xl md:text-2xl">{t("breakdown")}</h3>

        <div className="bg-white rounded-xl border overflow-hidden text-sm md:text-base">
          {/* ===== GROUP / PER PERSON TOUR ===== */}
          {tour.priceType === "per_person" ? (
            (() => {
              const totalFixedPrice = selected.pricePerDay * selected.capacity;
              const pricePerPerson = Math.ceil(totalFixedPrice / participants);
              return (
                <>
                  <div className="flex justify-between px-4 py-3 border-b">
                    <span className="text-gray-600">
                      {t("totalBusPrice", { name: selected.name })}
                    </span>
                    <span className="font-medium">
                      Rp {totalFixedPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-3 border-b">
                    <span className="text-gray-600">
                      {t("numParticipants")}
                    </span>
                    <span className="font-medium">{participants} {tPrice("person")}</span>
                  </div>

                  <div className="flex justify-between px-4 py-3 border-b bg-gray-50">
                    <span className="font-medium text-gray-700">
                      {t("pricePerPersonLabel")}
                    </span>
                    <span className="font-semibold text-blue-900">
                      Rp {pricePerPerson.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between px-4 py-3">
                    <span className="text-gray-600">{t("groupTotals")}</span>
                    <span className="font-medium">
                      Rp {totalFixedPrice.toLocaleString()}
                    </span>
                  </div>
                </>
              );
            })()
          ) : (
            /* ===== PRIVATE CAR ===== */
            <>
              <div className="flex justify-between px-4 py-3 border-b">
                <span className="text-gray-600">{t("vehicle")}</span>
                <span className="font-medium">{selected.name}</span>
              </div>

              <div className="flex justify-between px-4 py-3 border-b">
                <span className="text-gray-600">{t("maxCapacity")}</span>
                <span className="font-medium">{selected.capacity} {tPrice("person")}</span>
              </div>

              <div className="flex justify-between px-4 py-3 bg-gray-50">
                <span className="font-medium text-gray-700">{t("pricePerCar")}</span>
                <span className="font-semibold text-blue-900">
                  Rp {selected.pricePerDay.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* NOTE */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-3">
          <TriangleAlert className="w-4 h-4 text-yellow-500" />
          <p className="text-yellow-500">
            {" "}
            {t("mealsNote")}
          </p>
        </div>
      </div>
    </>
  );
}
