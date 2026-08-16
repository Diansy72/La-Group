"use client";

import React from "react";
import { Link, useRouter } from "@/i18n/routing";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import Button from "@/components/atoms/button";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInRight,
  staggerContainer,
} from "@/lib/animations";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const router = useRouter();
  const t = useTranslations("Hero");

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center lg:justify-start overflow-hidden pt-28 pb-24"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero.png"
          alt="Travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 via-[var(--primary)]/70 to-[var(--primary)]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/60 via-transparent to-transparent" />
      </div>

      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 ">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[var(--accent)]">
          <defs>
            <pattern id="batik" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.3" />
              <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              <circle cx="0" cy="0" r="5" fill="currentColor" opacity="0.2" />
              <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#batik)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-8 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20 mx-auto lg:mx-0"
            >
              <MapPin size={14} className="text-[var(--accent)]" />
              <span className="text-white/90 text-xs font-medium tracking-wider uppercase">
                {t("location")}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6"
            >
              {(() => {
                const title = t("title");
                const highlight = t("highlightWord");
                const parts = title.split(new RegExp(`(${highlight})`, "gi"));
                
                return parts.map((part, i) => {
                  if (part.toLowerCase() === highlight.toLowerCase()) {
                    return (
                      <span key={i} className="relative inline-block">
                        <span className="text-[var(--accent)] italic font-serif">
                          {part}
                        </span>
                        <svg
                          className="absolute -bottom-2 left-0 w-full"
                          viewBox="0 0 200 12"
                          fill="none"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                            d="M2 8C40 2 80 2 100 6C120 10 160 4 198 8"
                            stroke="#D4A843"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    );
                  }
                  return part;
                });
              })()}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {t("description")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Button
                variant="gold"
                onClick={() => router.push("/vehicles-pricelist")}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm"
              >
                {t("viewVehicles")}
              </Button>

              <Button
                variant="glass"
                onClick={() => router.push("#why-us")}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm"
              >
                {t("whyChooseUs")}
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/15"
            >
              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-white">8000+</p>
                <p className="text-xs text-white/50 mt-1">{t("happyCustomers")}</p>
              </div>

              <div className="w-px h-10 bg-white/20" />

              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-white">50+</p>
                <p className="text-xs text-white/50 mt-1">{t("vehicles")}</p>
              </div>

              <div className="w-px h-10 bg-white/20" />

              <div>
                <p className="text-2xl md:text-3xl font-extrabold text-white">5.0</p>
                <p className="text-xs text-white/50 mt-1">{t("rating")}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInRight}
            className="hidden lg:block relative"
          >
            <div className="relative w-full h-[500px]">

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-0 w-72 h-80 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <img src="/images/hero.png" alt="" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-24 right-52 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition-transform duration-500"
              >
                <img src="/images/destinations.png" alt="" className="w-full h-full object-cover" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-12 right-8 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {t("bookingAvailable")}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {t("reserveRide")}
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= WAVE ================= */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-0.5">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}