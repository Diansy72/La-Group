"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Car, Clock, Users, ArrowRight, Settings, Fuel } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { WayangDivider } from "@/components/atoms/wayang-ornament";
import Button from "@/components/atoms/button";
import FilterTabs from "@/components/molecules/FilterTabs";
import { useRouter } from "@/i18n/routing";
import Badge from "@/components/atoms/badge";
import { Vehicle } from "@/types";
import { formatVehiclePrice } from "@/lib/formatters";
import { useVehicles } from "@/hooks/useVehicles";
import { useTranslations } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";

type Filter = "all" | "car" | "motorcycle";

export default function BestVehicles() {
  const t = useTranslations("BestVehicles");
  const tPrice = useTranslations("Pricelist");
  const [filter, setFilter] = useState<Filter>("all");
  const router = useRouter();
  const { vehicles, isLoading } = useVehicles();

  const filteredVehicles = useMemo(() => {
    // Filter by type
    const carList = vehicles.filter((v) => v.type === "car");
    const motorList = vehicles.filter((v) => v.type === "motorcycle");

    if (filter === "all") {
      return [...motorList.slice(0, 2), ...carList.slice(0, 2)];
    } else if (filter === "car") {
      return carList.slice(0, 4);
    } else {
      return motorList.slice(0, 4);
    }
  }, [vehicles, filter]);

  return (
    <section className="px-4 md:px-8 xl:px-0 py-10 md:py-20 overflow-hidden">
      <div className=" max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs md:text-sm font-semibold tracking-[0.3em] text-blue-500 mb-3"
          >
            {t("subtitle")}
          </motion.p>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-semibold"
          >
            {t("title")} <span className="text-yellow-500">{t("highlightWord")}</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center pt-4 origin-center"
          >
            <WayangDivider className="w-30" />
          </motion.div>
        </motion.div>

        {/* FILTER */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6 md:mb-8"
        >
          <FilterTabs
            tabs={[
              { id: "all", label: t("all") },
              { id: "motorcycle", label: t("motorcycles") },
              { id: "car", label: t("cars") },
            ]}
            activeTab={filter}
            onTabChange={(id) => setFilter(id as Filter)}
            layoutId="activeTabBestVehicles"
          />
        </motion.div>

        {/* GRID */}
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            key={filter}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-4 gap-4 md:gap-6 "
          >
            {filteredVehicles.map((item) => {
              const availableUnits = item.availableUnits ?? (item.status === "available" ? 1 : 0);
              const isAvailable = availableUnits > 0;
              
              // Get first active package for cars, or use pricePerDay
              const activePackages = item.packages?.filter((pkg) => pkg.price > 0) || [];
              const defaultPackage = activePackages[0];
              const displayPrice = item.type === "car"
                ? defaultPackage?.price || 0
                : item.pricePerDay || 0;

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative group"
                >
                  {/* INNER CARD */}
                  <div className="relative h-80 md:h-100 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-300 w-full">
                    {item.imageUrl ? (
                      <Image
                        src={getPublicUrl(item.imageUrl)}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 font-medium">{t("noImage")}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* CONTENT */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                          {item.name}
                        </h3>
                      </div>

                      <div>
                        <div className="flex justify-between items-end mb-3">
                          <Badge
                            status={isAvailable ? "available" : "booked"}
                            label={isAvailable ? t("available") : t("booked")}
                            className={
                              isAvailable
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }
                          />

                          <span className="text-lg font-bold text-yellow-400">
                            {formatVehiclePrice(displayPrice)} / {t("day")}
                          </span>
                        </div>

                        <div className="h-px bg-white/20 mb-3" />

                        {/* SPECIFICATIONS */}
                        {item.type === "car" ? (
                          /* Car specifications: Duration, Driver, BBM */
                          <div className="flex justify-between text-xs text-gray-200 mb-4 font-medium border-t border-transparent pt-1">
                            <span className="flex gap-1.5 items-center">
                              <Clock size={14} className="text-gray-400" />
                              {defaultPackage ? (defaultPackage.duration === "full_day" ? "Full Day" : "Half Day") : "-"}
                            </span>
                            <span className="flex gap-1.5 items-center">
                              <Settings size={14} className="text-gray-400" />
                              {defaultPackage ? (defaultPackage.driverType === "self_drive" ? tPrice("selfDrive") : tPrice("withDriver")) : "-"}
                            </span>
                            <span className="flex gap-1.5 items-center">
                              <Fuel size={14} className="text-gray-400" />
                              {defaultPackage ? (defaultPackage.fuelOption === "with_fuel" ? "BBM" : "No BBM") : "-"}
                            </span>
                          </div>
                        ) : (
                          /* Motorcycle specifications: Category/Type, Duration, Seat */
                          <div className="flex justify-between text-xs text-gray-200 mb-4 font-medium border-t border-transparent pt-1">
                            <span className="flex gap-1.5 items-center capitalize">
                              <Car size={14} className="text-gray-400" /> {item.type}
                            </span>
                            <span className="flex gap-1.5 items-center">
                              <Clock size={14} className="text-gray-400" />
                              {item.rentalDuration || "-"}
                            </span>
                            <span className="flex gap-1.5 items-center">
                              <Users size={14} className="text-gray-400" />
                              {item.seatCapacity} {tPrice("seat")}
                            </span>
                          </div>
                        )}

                        <div className="text-[11px] text-gray-400 font-medium mb-3 text-center">
                          {t("available")} {availableUnits} {t("unit")}
                        </div>

                        <div className="text-center">
                          <Button
                            variant="text"
                            className="text-white hover:text-yellow-400 border-b border-transparent hover:border-yellow-400 rounded-none p-0 focus-visible:ring-0 font-bold"
                            onClick={() => router.push(`/vehicles-pricelist/${item.id}`)}
                            icon={<ArrowRight size={16} />}
                            iconPosition="right"
                          >
                            {t("explore")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OVERLAPPING PROMO BADGE */}
                  <Badge
                    variant="promo"
                    className="absolute -top-3 -right-3 rotate-12 group-hover:-rotate-6 group-hover:scale-110 transition-all duration-300"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}