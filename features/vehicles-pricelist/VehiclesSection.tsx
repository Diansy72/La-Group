"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Settings, Clock, Users, Fuel } from "lucide-react";

import { formatVehiclePrice } from "@/lib/formatters";
import { useVehicles } from "@/hooks/useVehicles";
import Button from "@/components/atoms/button";
import Badge from "@/components/atoms/badge";
import EmptyState from "@/components/atoms/empty-state";
import TabSearch from "@/components/molecules/TabSearch";
import FilterTabs from "@/components/molecules/FilterTabs";
import {
  WayangCornerTopLeft,
  WayangCornerTopRight,
  WayangCornerBottomLeft,
  WayangCornerBottomRight,
} from "@/components/atoms/wayang-ornament";

import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useTranslations } from "next-intl";
import { Vehicle } from "@/types";
import { getPublicUrl } from "@/lib/supabase/storage";

const categories = [
  "Self Drive",
  "With Driver",
  "Full Day",
  "Half Day",
  "2 Seat",
  "5 Seat",
  "7 Seat",
  "12 Seat",
  "14 Seat",
] as const;

export default function VehicleCard() {
  const t = useTranslations("Pricelist");
  const {
    vehicles: filteredVehicles,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    selectedFilters,
    toggleFilter,
    clearFilters,
  } = useVehicles();

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search, selectedFilters]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);
  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0 py-10 md:py-20">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-10 relative">
          <h2 className="text-2xl md:text-4xl font-medium">
            {t("title")}
          </h2>
          <p className="text-sm md:text-lg text-gray-500 mt-4">
            {t("description")}
          </p>

          {/* ================= TAB ================= */}
          <div className="mt-6">
            <FilterTabs
              tabs={[
                { id: "all", label: t("all") },
                { id: "motorcycle", label: t("motorcycles") },
                { id: "car", label: t("cars") },
              ]}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id)}
              layoutId="activeTabPricelist"
            />
          </div>

          {/* ================= Tab Search ================= */}
          <div className="mt-6">
            <TabSearch
              searchPlaceholder={t("searchPlaceholder")}
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilter}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* ================= GRID ================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <EmptyState
            title={t("errorTitle")}
            description={error}
          />
        ) : filteredVehicles.length === 0 ? (
          <EmptyState
            title={t("noVehiclesTitle")}
            description={t("noVehiclesDesc")}
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, margin: "-500px" }}
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
              gap-6
              auto-rows-fr
              items-stretch
            "
          >
            {paginatedVehicles.map((item) => {
              const defaultPackage = item.type === "car" && item.packages && item.packages.length > 0
                ? item.packages[0]
                : null;
              
              const displayPrice = item.type === "car"
                ? (defaultPackage ? defaultPackage.price : 0)
                : (item.pricePerDay || 0);

              const availableUnits = item.availableUnits ?? (item.status === "available" ? 1 : 0);
              const isAvailable = availableUnits > 0;

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className="
                  group
                  relative
                  bg-white rounded-3xl
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  p-4
                  flex flex-col
                  min-h-85
                  w-full
                  overflow-hidden
                "
                >
                  {/* ================= WAYANG ORNAMENT ================= */}
                  <WayangCornerTopLeft className="absolute -top-1 -left-1 w-16 md:w-20 opacity-25 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none z-0" />
                  <WayangCornerTopRight className="absolute -top-1 -right-1 w-16 md:w-20 opacity-25 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none z-0" />
                  <WayangCornerBottomLeft className="absolute -bottom-1 -left-1 w-16 md:w-20 opacity-25 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none z-0" />
                  <WayangCornerBottomRight className="absolute -bottom-1 -right-1 w-16 md:w-20 opacity-25 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none z-0" />

                  {/* CONTENT */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* IMAGE */}
                    <div className="relative w-full h-40 shrink-0 rounded-xl overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={getPublicUrl(item.imageUrl)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-xs">{t("noImage")}</span>
                        </div>
                      )}
                    </div>

                    {/* NAME */}
                    <h3 className="font-medium text-gray-800 text-lg md:text-xl mt-2">
                      {item.name}
                    </h3>

                    {/* PRICE + STATUS */}
                    <div className="flex justify-between items-center mt-2 md:mt-4">
                      <Badge
                        status={isAvailable ? "available" : "booked"}
                        label={isAvailable ? t("available") : t("booked")}
                      />

                      <span className="text-blue-900 font-semibold">
                        {formatVehiclePrice(displayPrice)} / {t("day")}
                      </span>
                    </div>

                    {/* ================= SPECS ================= */}
                    {item.type === "car" ? (
                      /* Car: 1. Duration, 2. Driver, 3. Fuel */
                      <div className="flex justify-between gap-4 text-xs text-gray-500 mt-4 border-t pt-2 border-gray-100 transition-colors duration-300 group-hover:text-yellow-500 group-hover:border-yellow-400">
                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Clock className="w-4 h-4" />
                          {defaultPackage ? (defaultPackage.duration === "full_day" ? "Full Day" : "Half Day") : "-"}
                        </div>

                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Settings className="w-4 h-4" />
                          {defaultPackage ? (defaultPackage.driverType === "self_drive" ? t("selfDrive") : t("withDriver")) : "-"}
                        </div>

                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Fuel className="w-4 h-4" />
                          {defaultPackage ? (defaultPackage.fuelOption === "with_fuel" ? "BBM" : "No BBM") : "-"}
                        </div>
                      </div>
                    ) : (
                      /* Motorcycle / Other: Keep original spec layout (Driver, Duration, Seat) */
                      <div className="flex justify-between gap-4 text-xs text-gray-500 mt-4 border-t pt-2 border-gray-100 transition-colors duration-300 group-hover:text-yellow-500 group-hover:border-yellow-400">
                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Settings className="w-4 h-4" />
                          {item.selfDrive ? t("selfDrive") : t("withDriver")}
                        </div>

                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Clock className="w-4 h-4" />
                          {item.rentalDuration || "-"}
                        </div>

                        <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-yellow-500">
                          <Users className="w-4 h-4" />
                          {item.seatCapacity} {t("seat")}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 font-medium mt-3 text-start">
                      {t("available")} {availableUnits} {t("unit")}
                    </div>

                    {/* BUTTON */}
                    {isAvailable ? (
                      <Link href={`/vehicles-pricelist/${item.id}`}>
                        <Button variant="gradient" className="w-full mt-4">
                          {t("rentNow")}
                        </Button>
                      </Link>
                    ) : (
                      <div className="cursor-not-allowed mt-4">
                        <Button
                          variant="gradient"
                          className="w-full pointer-events-none opacity-60"
                        >
                          {t("rentNow")}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        )}
        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            {/* PREV */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="
        px-4 py-2 rounded-xl border
        text-sm font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-blue-900 hover:text-white
      "
            >
              Prev
            </button>

            {/* PAGE NUMBER */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
            w-10 h-10 rounded-xl text-sm font-medium
            transition-all duration-200
            ${currentPage === page
                      ? "bg-blue-900 text-white shadow-md"
                      : "border hover:bg-gray-100"
                    }
          `}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="
        px-4 py-2 rounded-xl border
        text-sm font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        hover:bg-blue-900 hover:text-white
      "
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}