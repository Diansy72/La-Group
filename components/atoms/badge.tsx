import React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "status" | "promo";

interface BadgeProps {
  variant?: BadgeVariant;
  status?: string;
  label?: string;
  className?: string;
  promoTextTop?: string;
  promoTextBottom?: string;
}

const statusConfig: Record<
  string,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  available: {
    label: "Available",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  rented: {
    label: "Booked",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  booked: {
    label: "Booked",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  service: {
    label: "Service",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  booked_txn: {
    label: "Booked",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  cancelled_txn: {
    label: "Cancelled",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
};

export default function Badge({ 
  variant = "status", 
  status = "available", 
  label,
  className,
  promoTextTop = "The",
  promoTextBottom = "Best"
}: BadgeProps) {
  if (variant === "promo") {
    return (
      <div className={cn(
        "w-[68px] h-[68px] rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(245,158,11,0.5)] border-[3px] border-white z-20",
        className
      )}>
        <span className="text-[10px] font-bold text-amber-950 uppercase tracking-widest leading-none mb-0.5">{promoTextTop}</span>
        <span className="text-[15px] font-black text-amber-950 uppercase tracking-wide leading-none">{promoTextBottom}</span>
      </div>
    );
  }

  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || statusConfig.available;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)}
      />
      {label || config.label}
    </span>
  );
}
