"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Button from "@/components/atoms/button";
import EmptyState from "@/components/atoms/empty-state";
import TabSearch from "@/components/molecules/TabSearch";
import { Clock, Users, MapPin, Car, Bus } from "lucide-react";
import { formatTourPrice } from "@/features/tourpackages/services/tours";
import { useTours } from "@/hooks/useTours";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";

import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useTranslations, useLocale } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";

export default function TourSection() {
  const t = useTranslations("TourSection");
  const locale = useLocale();
  const router = useRouter();

  const [activeType, setActiveType] = useState<"private" | "group">("group");
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    5000000,
  ]);

  const { tours, isLoading } = useTours();

  const categories = ["Recommended", "Best Seller", "New"] as const;

  const tagStyles: Record<string, string> = {
    recommended: "bg-green-100 text-green-600",
    new: "bg-blue-100 text-blue-600",
    "best seller": "bg-red-100 text-red-600",
  };

  const normalize = (v: string) => v.toLowerCase();

  /* ================= FILTER ================= */
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchType =
        activeType === "group"
          ? tour.priceType === "per_person"
          : tour.priceType === "per_car";

      const matchSearch = tour.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedFilters.length === 0 ||
        selectedFilters.some((f) =>
          normalize(tour.recommendation || "") === normalize(f)
        );

      const matchPrice =
        tour.estimatedPrice >= priceRange[0] &&
        tour.estimatedPrice <= priceRange[1];

      const matchStatus = tour.status === "active";

      return matchStatus && matchType && matchSearch && matchCategory && matchPrice;
    });
  }, [tours, activeType, search, selectedFilters, priceRange]);

  const toggleFilter = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item]
    );
  };

  /* ================= RENDER ================= */
  return (
    <section className="w-full px-4 md:px-8 xl:px-0 py-10 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* ================= TABS ================= */}
        <div className="flex justify-center gap-4 md:gap-6 mb-4 text-sm md:text-base">
          {(["private", "group"] as const).map((type) => {
            const isActive = activeType === type;

            return (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-2 p-1 font-medium transition ${
                  isActive
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                {type === "private" ? (
                  <Car className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Bus className="w-4 h-4 md:w-5 md:h-5" />
                )}

                {type === "private"
                  ? t("privateTour")
                  : t("groupTour")}
              </button>
            );
          })}
        </div>
        <p className="text-center text-sm md:text-xl mb-4 font-medium text-gray-500">
          {t("priceInfo")}
        </p>

        {/* ================= TAB SEARCH ================= */}
        <TabSearch
          searchPlaceholder={t("searchPlaceholder")}
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          selectedFilters={selectedFilters}
          onToggleFilter={toggleFilter}
          onClearFilters={() => setSelectedFilters([])}
      
        />

        {/* ================= GRID ================= */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, margin: "-500px" }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
          {filteredTours.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title={t("noToursTitle")}
                description={t("noToursDesc")}
              />
            </div>
          ) : (
            filteredTours.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group bg-white rounded-2xl shadow overflow-hidden p-4 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative h-55 overflow-hidden rounded-lg bg-gray-100">
                  {item.imageUrl ? (
                    <Image
                      src={getPublicUrl(item.imageUrl)}
                      alt={locale === "en" ? (item.titleEn || item.title) : item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      {t("noImage")}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {item.recommendation && item.recommendation !== "None" && (
                      <span
                        className={`text-sm px-2 py-1 rounded-full capitalize ${
                          tagStyles[item.recommendation.toLowerCase()] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.recommendation}
                      </span>
                    )}
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-gray-800 mt-3">
                  {locale === "en" ? (item.titleEn || item.title) : item.title}
                </h3>

                {/* META */}
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {item.duration}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Max {item.vehicleOptions?.[0]?.capacity || item.maxPax} {t("pax")}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />{" "}
                    <span className="truncate" title={item.destinationTags && item.destinationTags.length > 0 ? item.destinationTags.join(", ") : "Yogyakarta"}>
                      {item.destinationTags && item.destinationTags.length > 0 ? (
                        <>
                          {item.destinationTags.slice(0, 3).join(", ")}
                          {item.destinationTags.length > 3 ? (locale === "en" ? ", etc" : ", dll") : ""}
                        </>
                      ) : (
                        "Yogyakarta"
                      )}
                    </span>
                  </p>
                </div>

                {/* PRICE & INFO */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t("startingFrom")}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-blue-900">
                        {formatTourPrice(item.estimatedPrice)}
                      </p>

                      <Button
                        variant="gradient"
                        className="py-2 px-4 text-sm"
                        onClick={() => router.push(`/tourpackages/${item.id}`)}
                      >
                        {t("seeDetails")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-gray-600">
                      {item.priceType === "per_car"
                        ? t("pricePerCar")
                        : t("pricePerPerson")}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      <span className="font-medium">{t("vehicles")}:</span>{" "}
                      {item.priceType === "per_car"
                        ? t("privateVehicles")
                        : t("groupVehicles")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          </motion.div>
        )}
      </div>
    </section>
  );
}