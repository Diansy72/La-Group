"use client";

import React from "react";
import { X } from "lucide-react";

interface DetailItem {
  label: string;
  value: React.ReactNode;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DetailItem[];
}

export default function DetailModal({ isOpen, onClose, title, items }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-36 shrink-0 pt-0.5">
                {item.label}
              </span>
              <span className="text-sm text-gray-900 flex-1">
                {item.value || "-"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-50 text-sm font-semibold text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
