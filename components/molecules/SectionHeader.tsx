"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { WayangDivider } from "@/components/atoms/wayang-ornament";
import { ReactNode } from "react";

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  highlightWord?: string; // kata spesifik untuk di-highlight, atau "last" untuk highlight kata terakhir
  showDivider?: boolean;
  customTitle?: ReactNode;
  className?: string;
}

/**
 * SectionHeader - Reusable molecule component untuk section titles
 * 
 * Fitur yang dapat dikonfigurasi:
 * - Subtitle (selalu ada)
 * - Title dengan optional highlighted word
 * - Optional description
 * - Optional wayang divider
 * 
 * Contoh penggunaan:
 * 
 * // Pattern 1: Subtitle + Title + Divider (tanpa description)
 * <SectionHeader
 *   subtitle="HOW IT WORKS"
 *   title="Simple Steps to Rent"
 *   highlightWord="Rent"
 *   showDivider
 * />
 * 
 * // Pattern 2: Subtitle + Title + Description (tanpa divider)
 * <SectionHeader
 *   subtitle="EXPLORE"
 *   title="Recommended Destinations"
 *   description="Handpicked destinations for the ultimate Indonesian travel experience."
 *   highlightWord="last"
 * />
 */
export default function SectionHeader({
  subtitle,
  title,
  description,
  highlightWord,
  showDivider = false,
  customTitle,
  className = "text-center mb-12",
}: SectionHeaderProps) {
  // Process title untuk highlighting
  let titleNode: ReactNode;

  if (customTitle) {
    titleNode = customTitle;
  } else if (highlightWord) {
    if (highlightWord === "last") {
      // Highlight kata terakhir dari title
      const words = title.split(" ");
      const lastWord = words.pop();
      const mainTitle = words.join(" ");
      titleNode = (
        <>
          {mainTitle} <span className="text-yellow-500">{lastWord}</span>
        </>
      );
    } else {
      // Highlight kata spesifik
      const regex = new RegExp(`(${highlightWord})`, "gi");
      const parts = title.split(regex);
      titleNode = parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-yellow-500">
            {part}
          </span>
        ) : (
          part
        )
      );
    }
  } else {
    titleNode = title;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {/* Subtitle */}
      <motion.p
        variants={fadeInUp}
        className="text-xs md:text-sm font-semibold tracking-[0.3em] text-blue-500 mb-3"
      >
        {subtitle}
      </motion.p>

      {/* Title */}
      <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-semibold">
        {titleNode}
      </motion.h2>

      {/* Wayang Divider */}
      {showDivider && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center pt-4 origin-center"
        >
          <WayangDivider className="w-30" />
        </motion.div>
      )}

      {/* Description (optional) */}
      {description && (
        <motion.p
          variants={fadeInUp}
          className="text-gray-500 text-base md:text-lg mt-4 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
