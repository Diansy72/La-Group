"use client";

import { MapPin, MessagesSquare, CarFront } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  fadeInUp,
  staggerContainer,
  scaleUp,
} from "@/lib/animations";
import SectionHeader from "@/components/molecules/SectionHeader";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const steps = [
    {
      icon: MapPin,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      icon: MessagesSquare,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      icon: CarFront,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <section className=" px-4 md:px-8 xl:px-0 py-14 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <SectionHeader
          subtitle={t("subtitle")}
          title={t("title")}
          highlightWord={t("highlightWord")}
          showDivider
        />

        <div ref={ref} className="relative text-center">
          {/* CURVES */}
          <motion.svg
            className="hidden xl:block absolute top-0 left-[17%] h-20 w-92 origin-left"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <path
              d="M0,80 C90,120 210,-40 300,20"
              fill="none"
              stroke="#EAB308"
              strokeWidth="2"
            />
          </motion.svg>

          <motion.svg
            className="hidden xl:block absolute top-0 left-[54.5%] h-20 w-92 origin-left"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <path
              d="M0,80 C90,120 210,-40 300,20"
              fill="none"
              stroke="#EAB308"
              strokeWidth="2"
            />
          </motion.svg>

          {/* STEPS */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid md:grid-cols-3 gap-8 md:gap-40 relative z-10"
          >
            {steps.map((step, i) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex flex-col items-center space-y-4"
                >
                  <motion.div
                    variants={scaleUp}
                    whileHover={{ scale: 1.06 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>

                  <h3 className="text-lg md:text-xl font-medium">
                    {step.title}
                  </h3>

                  <p className="text-sm md:text-base text-gray-500 max-w-xs">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}