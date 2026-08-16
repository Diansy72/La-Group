"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface PolicyCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  content: string;
  color: string; // bg-blue-500, bg-emerald-500, dll
  bgLight: string; // bg-blue-50, bg-emerald-50, dll
}


export default function PolicyCard({
  icon,
  title,
  description,
  content,
  color,
  bgLight,
}: PolicyCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        y: -2,
      }}
      onClick={() => setIsOpen(!isOpen)}
      className={`group flex items-start gap-4 p-4 rounded-xl bg-white border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
        isOpen
          ? `border-blue-500 ${bgLight}`
          : "border-gray-200 hover:border-gray-3  00"
      }`}
    >
      {/* ICON */}
      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className={`shrink-0 p-2.5 rounded-xl ${bgLight} transition-all duration-300`}
      >
        <div className={`${color} text-white p-2 rounded-lg`}>{icon}</div>
      </motion.div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>

          {/* ARROW */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 mt-0.5 text-gray-500"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>

        {/* DROPDOWN CONTENT */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-gray-200 pt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
