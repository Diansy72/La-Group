"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabGroup({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabGroupProps) {
  return (
    <div className={cn("flex items-center gap-1 bg-gray-50 rounded-xl p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer",
            "transition-all duration-200 ease-out",
            activeTab === tab.id
              ? "bg-blue-900 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900 hover:bg-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
