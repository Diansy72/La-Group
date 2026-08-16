"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/molecules/SectionHeader";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import FilterTabs from "@/components/molecules/FilterTabs";
import { Tourist } from "@/types";
import { useTranslations } from "next-intl";
import { getPublicUrl } from "@/lib/supabase/storage";

type Category = "all" | "Asia" | "Europe" | "Americas";

export default function Gallery() {
  const t = useTranslations("About.gallery");
  const [filter, setFilter] = useState<Category>("all");
  const [items, setItems] = useState<Tourist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tourists")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error("Failed to fetch tourists:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.continent === filter);

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 xl:px-0 py-10 md:py-20">
      {/* HEADER */}
      <SectionHeader
        subtitle=""
        title={t("title")}
        description={t("description")}
        className="text-center mb-4"
      />

      {/* ===== FILTER (FIXED LIKE TAB EXAMPLE) ===== */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mb-12"
      >
        <FilterTabs
          tabs={[
            { id: "all", label: t("all") },
            { id: "Asia", label: t("asia") },
            { id: "Europe", label: t("europe") },
            { id: "Americas", label: t("americas") },
          ]}
          activeTab={filter}
          onTabChange={(id) => setFilter(id as Category)}
          layoutId="activeGalleryTab"
        />
      </motion.div>

      {/* ===== GRID ===== */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          {t("noItems")}
        </div>
      ) : (
        <motion.div
          key={filter}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-48">
                <Image
                  src={getPublicUrl(item.photoUrl) || "/images/company.png"}
                  alt={item.packageTaken}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-4">
                  {item.packageTaken}
                </h3>

                <span className="block w-20 h-[3px] bg-yellow-400"></span>

                <p className="text-sm md:text-base text-gray-500 mt-2">
                  {t("from", { country: item.nationality })}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}