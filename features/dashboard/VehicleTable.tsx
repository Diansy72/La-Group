"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { Eye, Pencil, Trash2, Car, Motorbike, CalendarCheck, CalendarX, Copy } from "lucide-react";
import Badge from "@/components/atoms/badge";
import IconButton from "@/components/atoms/icon-button";
import { Vehicle } from "@/types";
import { formatCurrency } from "@/features/dashboard/services/data";

import { useTranslations } from "next-intl";

interface VehicleTableProps {
  vehicles: Vehicle[];
  className?: string;
  onView?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onBooking?: (vehicle: Vehicle) => void;
  onCancelBooking?: (vehicle: Vehicle) => void;
  onDuplicate?: (vehicle: Vehicle) => void;
  startIndex?: number;
}

function getVehicleDuration(vehicle: Vehicle): string {
  if (vehicle.type !== "car") {
    return vehicle.rentalDuration || "-";
  }

  const activePackages = (vehicle.packages || []).filter((pkg) => pkg.price > 0);
  const hasFullDay = activePackages.some((pkg) => pkg.duration === "full_day");
  const hasHalfDay = activePackages.some((pkg) => pkg.duration === "half_day");

  if (hasFullDay && hasHalfDay) {
    return "Full Day / Half Day";
  }
  if (hasFullDay) {
    return "Full Day";
  }
  if (hasHalfDay) {
    return "Half Day";
  }
  return "-";
}

export default function VehicleTable({
  vehicles,
  className,
  onView,
  onEdit,
  onDelete,
  onBooking,
  onCancelBooking,
  onDuplicate,
  startIndex = 0,
}: VehicleTableProps) {
  const t = useTranslations("Dashboard.vehicleTable");
  const columns = [
    t("no"),
    t("image"),
    t("name"),
    t("plate"),
    t("duration"),
    t("price"),
    t("status"),
    t("action"),
  ];

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-b-2xl rounded-t-none",
        "overflow-hidden",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className={cn(
                    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider",
                    "text-gray-500 bg-gray-50/50"
                  )}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={cn(
                  "border-b border-gray-100 table-row-hover",
                  index % 2 === 1 && "bg-[#FAFBFC]"
                )}
              >
                {/* No */}
                <td className="px-5 py-4 text-sm text-gray-500">
                  {startIndex + index + 1}
                </td>

                {/* Image */}
                <td className="px-5 py-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      "bg-blue-900 text-white"
                    )}
                  >
                    {vehicle.type === "car" ? (
                      <Car size={18} />
                    ) : (
                      <Motorbike size={18} />
                    )}
                  </div>
                </td>

                {/* Name */}
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {vehicle.name}
                  </span>
                </td>

                {/* Plate */}
                <td className="px-5 py-4 text-sm text-gray-500">
                  {vehicle.licensePlate}
                </td>

                {/* Duration */}
                <td className="px-5 py-4 text-sm text-gray-500">
                  {getVehicleDuration(vehicle)}
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                  {vehicle.type === "car" && vehicle.packages && vehicle.packages.length > 0 ? (
                    (() => {
                      const activePrices = vehicle.packages
                        .map((p) => p.price)
                        .filter((price) => price > 0);
                      if (activePrices.length === 0) return <span className="text-gray-400">-</span>;
                      const startingFrom = Math.min(...activePrices);
                      return (
                        <div>
                          <span className="text-xs text-gray-400 block">Starting From</span>
                          <span>{formatCurrency(startingFrom)}</span>
                        </div>
                      );
                    })()
                  ) : (
                    formatCurrency(vehicle.pricePerDay ?? 0)
                  )}
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Badge status={vehicle.status === "rented" ? "booked" : vehicle.status} />
                    {vehicle.status === "available" && onBooking && (
                      <button
                        onClick={() => onBooking(vehicle)}
                        className="p-1.5 rounded-lg text-blue-900 hover:bg-blue-900/10 transition-colors cursor-pointer"
                        title="Create Booking"
                      >
                        <CalendarCheck size={14} />
                      </button>
                    )}
                    {vehicle.status === "rented" && onCancelBooking && (
                      <button
                        onClick={() => onCancelBooking(vehicle)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Cancel Booking / Set Available"
                      >
                        <CalendarX size={14} />
                      </button>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <IconButton
                      variant="info"
                      icon={<Eye size={16} />}
                      tooltip="View details"
                      onClick={() => onView?.(vehicle)}
                    />
                    <IconButton
                      variant="warning"
                      icon={<Pencil size={16} />}
                      tooltip="Edit vehicle"
                      onClick={() => onEdit?.(vehicle)}
                    />
                    <IconButton
                      variant="default"
                      icon={<Copy size={16} />}
                      tooltip="Duplicate vehicle"
                      onClick={() => onDuplicate?.(vehicle)}
                      className="text-purple-600 hover:bg-purple-50"
                    />
                    <IconButton
                      variant="danger"
                      icon={<Trash2 size={16} />}
                      tooltip="Delete vehicle"
                      onClick={() => onDelete?.(vehicle)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
