"use client";

import React from "react";
import { Check, Trophy, Car, Activity } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { scaleUp } from "@/lib/animations";
import Button from "@/components/atoms/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function MembershipSection() {
  const t = useTranslations("Membership");

  const stats = [
    { value: "10x", label: t("rental") },
    { value: "1x", label: t("freeReward") },
  ];

  const vehicles = [
    "Grand Toyota Avanza",
    "Honda Brio",
    "Daihatsu Xenia",
    "Honda Mobilio",
    "Daihatsu Xenia",
    "Honda Jazz",
    "Brio Agya",
    "Xpander",
  ];

  return (
    <section className="py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          variants={scaleUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-linear-to-br from-yellow-400 via-yellow-500 to-amber-600" />

          {/* PATTERN */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern
                  id="grid"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="15" cy="15" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="400" height="200" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-6 md:gap-10 p-10 lg:p-14 items-center">
            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white text-xs font-semibold rounded-full mb-6 uppercase tracking-wider">
                <Trophy size={14} />
                {t("tagline")}
              </span>

              {/* STATS */}
              <div className="flex items-center gap-6 mb-6">
                {stats.map((stat, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <span className="text-3xl md:text-5xl text-white/70">
                        →
                      </span>
                    )}
                    <div>
                      <p className="text-5xl lg:text-6xl font-extrabold text-white">
                        {stat.value}
                      </p>
                      <p className="text-white text-sm mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* DESC */}
              <p className="text-white text-sm mb-6 max-w-md">
                {t("desc")}
              </p>

              {/* IMAGES */}
              <div className="grid md:grid-cols-1 gap-4">
                {/* ITEM 1 */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-full h-100  relative rounded-xl overflow-hidden bg-white/20">
                    <Image
                      src="/images/sewa10x.jpg"
                      alt="reward"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <Trophy size={16} className="text-yellow-100" />
                    <span className="text-sm text-white font-semibold">
                      {t("rewardGuaranteed")}
                    </span>
                  </div>
                </div>

                {/* ITEM 2 */}
                {/* <div className="hidden md:flex flex-col items-center">
                  <div className="w-full h-52 relative rounded-xl overflow-hidden bg-white/20">
                    <Image
                      src="/images/tracking-your-progress.png"
                      alt="tracking"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2 justify-center">
                    <Activity size={16} className="text-yellow-100" />
                    <span className="text-sm text-white font-semibold">
                      {t("trackProgress")}
                    </span>
                  </div>
                </div> */}
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Car size={20} className="text-yellow-500" />
                {t("vehiclesIncluded")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {vehicles.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-200 bg-yellow-50"
                  >
                    <Check className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="w-full">
                <Button variant="gold" type="button" className="w-full">
                  {t("askAdmin")}
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {t("terms")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}