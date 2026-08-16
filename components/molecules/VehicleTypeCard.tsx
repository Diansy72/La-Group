"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { Bike, Car, Bus } from "lucide-react";
import { VehicleType } from "@/types";

interface VehicleTypeCardProps {
  type: VehicleType;
  isSelected?: boolean;
  onClick: () => void;
}

const typeConfig: Record<VehicleType, { label: string; icon: React.ReactNode }> = {
  motorcycle: {
    label: "Motorcycle",
    icon: <Bike size={36} />,
  },
  car: {
    label: "Car",
    icon: <Car size={36} />,
  },
  minibus: {
    label: "Minibus",
    icon: <Bus size={36} />,
  },
};

export default function VehicleTypeCard({
  type,
  isSelected = false,
  onClick,
}: VehicleTypeCardProps) {
  const config = typeConfig[type];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl",
        "border-2 cursor-pointer min-w-[140px] min-h-[130px]",
        "transition-all duration-250 ease-out",
        "hover:scale-[1.03] active:scale-[0.98]",
        isSelected
          ? "border-blue-900 bg-blue-900 text-white shadow-lg"
          : "border-gray-200 bg-white text-blue-900 hover:border-blue-900/40 hover:shadow-md"
      )}
    >
      <span className={cn(
        "p-3 rounded-xl",
        isSelected ? "bg-white/20" : "bg-gray-50"
      )}>
        {config.icon}
      </span>
      <span className="text-sm font-semibold">{config.label}</span>
    </button>
  );
}
