"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/cn";
import { X } from "lucide-react";
import VehicleTypeCard from "@/components/molecules/VehicleTypeCard";
import { VehicleType } from "@/types";

interface VehicleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: VehicleType) => void;
}

export default function VehicleTypeModal({
  isOpen,
  onClose,
  onSelect,
}: VehicleTypeModalProps) {
  const [selected, setSelected] = useState<VehicleType | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const handleSelect = (type: VehicleType) => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm modal-backdrop"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-xl",
          "p-8 w-full max-w-md modal-content"
        )}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "absolute top-4 right-4 p-1.5 rounded-lg",
            "text-gray-400 hover:bg-gray-50 hover:text-gray-900",
            "transition-colors duration-200 cursor-pointer"
          )}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
          Select Vehicle Type
        </h2>

        {/* Type Cards */}
        <div className="flex items-center justify-center gap-5">
          <VehicleTypeCard
            type="motorcycle"
            isSelected={selected === "motorcycle"}
            onClick={() => handleSelect("motorcycle")}
          />
          <VehicleTypeCard
            type="car"
            isSelected={selected === "car"}
            onClick={() => handleSelect("car")}
          />
        </div>
      </div>
    </div>
  );
}
