"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function CompanyHistory() {
  const t = useTranslations("About.history");

  const milestones = [
    {
      period: t("items.item0.period"),
      title: t("items.item0.title"),
      desc: t("items.item0.desc"),
    },
    {
      period: t("items.item1.period"),
      title: t("items.item1.title"),
      desc: t("items.item1.desc"),
    },
    {
      period: t("items.item2.period"),
      title: t("items.item2.title"),
      desc: t("items.item2.desc"),
    },
    {
      period: t("items.item3.period"),
      title: t("items.item3.title"),
      desc: t("items.item3.desc"),
    },
    {
      period: t("items.item4.period"),
      title: t("items.item4.title"),
      desc: t("items.item4.desc"),
    },
  ];

  return (
    <div className="relative bg-gray-50 px-6 md:px-8 py-10 md:py-20 overflow-hidden">

      {/* ===== BATIK ORNAMENT ===== */}
      <Image
        src="/images/background.png"
        alt="ornament"
        width={300}
        height={300}
        className="absolute left-0 top-20 opacity-70"
      />
      <Image
        src="/images/background-2.png"
        alt="ornament"
        width={300}
        height={300}
        className="absolute right-0 bottom-20 opacity-70"
      />

      {/* ===== HEADER ===== */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-2xl md:text-4xl font-medium text-gray-800">
          {t("title")}
        </h2>
        <p className="text-sm md:text-lg text-gray-500 mt-4">
          {t("subtitle")}
        </p>
      </div>

      {/* ===== TIMELINE ===== */}
      <div className="relative max-w-6xl mx-auto">

        {/* CENTER LINE */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-400 -translate-x-1/2" />

        <div className="space-y-12">
          {milestones.map((item, i) => {
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col md:flex-row items-center"
              >
                {/* ===== DOT ===== */}
                <div className="z-10 flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400 border-4 border-white shadow md:absolute md:left-1/2 md:-translate-x-1/2" />

                {/* ===== CARD ===== */}
                <div
                  className={`w-full md:w-1/2 ${
                    isLeft
                      ? "md:pr-12 md:text-right"
                      : "md:order-2 md:pl-12"
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-4 md:mt-0 hover:shadow-md transition-shadow">
                    <span className="inline-block text-xs font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 mb-3">
                      {item.period}
                    </span>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* ===== EMPTY SIDE (DESKTOP) ===== */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}