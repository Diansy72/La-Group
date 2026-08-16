"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export default function Select({
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "appearance-none w-full bg-white border border-gray-200 rounded-lg",
          "px-4 py-2.5 pr-10 text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900",
          "transition-all duration-200 cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
