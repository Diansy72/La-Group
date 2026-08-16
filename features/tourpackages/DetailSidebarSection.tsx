import Button from "@/components/atoms/button";
import { TourPackage, PackageVehicleOption } from "@/types";
import { useTranslations } from "next-intl";

type Props = {
  tour: TourPackage;
  selected: PackageVehicleOption;
  participants: number;
  onOrder: () => void;
};

export default function DetailSidebarSection({
  tour,
  selected,
  participants,
  onOrder,
}: Props) {
  const t = useTranslations("TourDetail");

  return (
    <div className="bg-white rounded-xl shadow p-6 h-fit">
      {/* ===== GROUP / PER_PERSON TOUR ===== */}
      {tour.priceType === "per_person" ? (
        (() => {
          const totalFixedPrice = selected.pricePerDay * selected.capacity;
          const pricePerPerson = Math.ceil(totalFixedPrice / participants);
          return (
            <>
              <h3 className="text-base md:text-lg font-semibold text-gray-700">
                {t("pricePerPerson")}
              </h3>

              <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
                Rp {pricePerPerson.toLocaleString()}
              </p>

              <p className="text-sm text-gray-500 mb-4">
                {t("basedOn", { count: participants })}
              </p>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("vehicle")}</span>
                  <span className="font-medium">{selected.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t("participants")}</span>
                  <span className="font-medium">{participants}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t("totalPrice")}</span>
                  <span className="font-semibold text-blue-900">
                    Rp {totalFixedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                variant="gradient"
                onClick={onOrder}
              >
                {t("orderNow")}
              </Button>
            </>
          );
        })()
      ) : (
        /* ===== PRIVATE / PER_CAR ===== */
        <>
          <h3 className="text-base md:text-lg font-semibold text-gray-700">
            {t("pricePerCar")}
          </h3>

          <p className="text-2xl md:text-3xl font-bold text-blue-900 mt-2">
            Rp {selected.pricePerDay.toLocaleString()}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            {t("maxPeople", { count: selected.capacity })}
          </p>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("vehicle")}</span>
              <span className="font-medium">{selected.name}</span>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            variant="gradient"
            onClick={onOrder}
          >
            {t("orderNow")}
          </Button>
        </>
      )}
    </div>
  );
}
