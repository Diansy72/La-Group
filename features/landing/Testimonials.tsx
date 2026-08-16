"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { patternKawung } from "@/lib/pattern";
import SectionHeader from "@/components/molecules/SectionHeader";
import { GoogleReview } from "@/types";
import { useTranslations } from "next-intl";
import VideoPlayerModal from "@/components/organisms/VideoPlayerModal";

import { getPublicUrl } from "@/lib/supabase/storage";

const ITEMS_PER_VIEW = 3;

export default function Testimonials() {
  const t = useTranslations("Testimonials");
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((err) => console.error("Failed to fetch reviews:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const maxIndex = Math.max(
    0,
    Math.ceil(reviews.length / ITEMS_PER_VIEW) - 1
  );

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const visibleItems = useMemo(() => {
    const start = index * ITEMS_PER_VIEW;
    return reviews.slice(start, start + ITEMS_PER_VIEW);
  }, [index, reviews]);

  return (
    <section className="relative px-4 md:px-8 xl:px-0 py-10 md:py-20 overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: patternKawung,
          backgroundRepeat: "repeat",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />

      {/* GLOW */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,rgba(234,179,8,0.06)_35%,rgba(234,179,8,0.02)_60%,transparent_80%)] pointer-events-none" />

      {/* ===== CONTENT ===== */}
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
          className="text-center mb-10 md:mb-20"
        />

        {/* ===== CAROUSEL ===== */}
        <div className="relative px-0 md:px-16">
          {reviews.length > ITEMS_PER_VIEW && (
            <div className="hidden md:block">
              <button
                onClick={prev}
                className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-blue-900/10 flex items-center justify-center text-blue-900 hover:bg-blue-900 hover:text-white transition cursor-pointer bg-white shadow-md z-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-blue-900/10 flex items-center justify-center text-blue-900 hover:bg-blue-900 hover:text-white transition cursor-pointer bg-white shadow-md z-20"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {isLoading ? (
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 shadow-md animate-pulse h-48"
              />
            ))}
          </div>
        ) : (
          <div>
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                {t("noReviews")}
              </p>
            ) : (
              <motion.div
                key={index}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-10"
              >
                {visibleItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                          {item.avatarPath ? (
                            <img src={getPublicUrl(item.avatarPath)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            item.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm">
                        {item.rating}
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">&ldquo;{item.comment}&rdquo;</p>

                    {item.mediaType === "image" && item.mediaPath && (
                      <div className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-100">
                        <img
                          src={getPublicUrl(item.mediaPath)}
                          alt={`${item.name} review photo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {item.mediaType === "video" && item.mediaPath && (
                      <div 
                        onClick={() => {
                          setActiveVideoUrl(getPublicUrl(item.mediaPath) || null);
                          setActiveVideoTitle(`${item.name}'s Video Review`);
                        }}
                        className="relative w-full h-28 rounded-xl overflow-hidden cursor-pointer group bg-black"
                      >
                        <video 
                          src={getPublicUrl(item.mediaPath)} 
                          className="object-cover w-full h-full" 
                          muted 
                          playsInline 
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center text-white text-sm">
                          <Play className="w-5 h-5 mr-2 fill-white text-white" />
                          {t("watchReview")}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
        </div>

        {/* DOTS */}
        {reviews.length > 0 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all ${i === index ? "w-6 h-2 bg-blue-900" : "w-2 h-2 bg-gray-400"
                  } rounded-full`}
              />
            ))}
          </div>
        )}
      </div>

      <VideoPlayerModal 
        isOpen={!!activeVideoUrl}
        onClose={() => {
          setActiveVideoUrl(null);
          setActiveVideoTitle("");
        }}
        videoUrl={activeVideoUrl || ""}
        title={activeVideoTitle}
      />
    </section>
  );
}