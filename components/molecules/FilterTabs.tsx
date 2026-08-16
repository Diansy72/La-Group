"use client";

import { motion } from "framer-motion";

export type FilterTabItem = {
  id: string;
  label: string;
};

type Props = {
  tabs: FilterTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  layoutId: string;
  className?: string;
};

export default function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  layoutId,
  className = "flex justify-center gap-6 md:gap-10 text-base md:text-lg font-medium",
}: Props) {
  return (
    <div className={className}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative capitalize pb-2 transition-colors ${
              isActive ? "text-blue-500" : "text-gray-400 hover:text-black"
            }`}
          >
            {tab.label}

            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-500"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
