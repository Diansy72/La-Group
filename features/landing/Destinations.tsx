"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Button from "@/components/atoms/button";
import SectionHeader from "@/components/molecules/SectionHeader";
import { useTours } from "@/hooks/useTours";
import { useTranslations } from "next-intl";
import { TourPackage } from "@/types";
import { getPublicUrl } from "@/lib/supabase/storage";

type TourWithCount = TourPackage & { _count?: { bookings: number } };

export default function Destinations() {
  const t = useTranslations("Destinations");
  const router = useRouter();
  const { tours, isLoading } = useTours();

  const displayDestinations = [...tours]
    .filter((tour) => tour.status === "active")
    .sort((a, b) => (((b as TourWithCount)._count?.bookings || 0) - ((a as TourWithCount)._count?.bookings || 0)))
    .slice(0, 3)
    .map((tour) => ({
      title: tour.title,
      description: tour.description,
      image: getPublicUrl(tour.imageUrl) || "/images/placeholder.png",
      location: tour.destinationTags?.[0] || "Indonesia",
      id: tour.id,
    }));

  return (
    <section className="relative px-4 md:px-8 xl:px-0 py-10 md:py-20 overflow-hidden bg-gradient-to-r from-yellow-100/30 via-white to-yellow-100/30">
      {/* ORNAMENT LEFT */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-105 opacity-70 pointer-events-none">
        <Image
          src="/images/background-4.png"
          alt="ornament"
          fill
          className="object-cover object-left"
        />
      </div>

      {/* ORNAMENT RIGHT */}
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-105 opacity-70 pointer-events-none">
        <Image
          src="/images/background-3.png"
          alt="ornament"
          fill
          className="object-cover object-right"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <SectionHeader
          subtitle={t("subtitle")}
          title={t("title")}
          description={t("description")}
          highlightWord="last"
          className = "text-center mb-12"
        />

        {/* CARDS */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-6 mb-10"
          >
            {displayDestinations.map((dest, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                onClick={() => router.push(`/tourpackages/${dest.id}`)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={dest.image}
                  alt={dest.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* hover tint */}
                <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* location */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <MapPin size={12} className="text-white" />
                  <span className="text-white text-xs font-medium">
                    {dest.location}
                  </span>
                </div>

                {/* content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {dest.title}
                  </h3>
                  <p className="text-white/70 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {dest.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            variant="text"
            type="button"
            onClick={() => router.push("/tourpackages")}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            className="inline-flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            {t("exploreMore")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}