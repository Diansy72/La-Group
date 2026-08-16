"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const t = useTranslations("Dashboard.pagination");
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between mt-6", className)}>
      <p className="text-sm text-gray-500">
        {t("showing", { start: startItem, end: endItem, total: totalItems })}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "text-gray-500 hover:bg-gray-50",
            "transition-colors duration-200 cursor-pointer",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
            >
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg",
                "text-sm font-medium transition-all duration-200 cursor-pointer",
                currentPage === page
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          )
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "text-gray-500 hover:bg-gray-50",
            "transition-colors duration-200 cursor-pointer",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
