"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { X } from "lucide-react";
import Button from "@/components/atoms/button";

/* =========================
   TYPES
========================= */
export interface TabSearchProps {
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Current search value */
  search: string;
  /** Callback when search value changes */
  onSearchChange: (value: string) => void;

  /** List of category items for the dropdown */
  categories: readonly string[];
  /** Currently selected filters */
  selectedFilters: string[];
  /** Callback to toggle a single filter */
  onToggleFilter: (item: string) => void;
  /** Callback to clear all filters */
  onClearFilters: () => void;

  /** Optional extra controls rendered between category dropdown and search button (e.g. price range inputs) */
  extraControls?: ReactNode;

  /** Callback when the search button is clicked */
  onSearch?: () => void;
}

/* =========================
   COMPONENT
========================= */
export default function TabSearch({
  searchPlaceholder = "Search...",
  search,
  onSearchChange,
  categories,
  selectedFilters,
  onToggleFilter,
  onClearFilters,
  extraControls,
  onSearch,
}: TabSearchProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---- OUTSIDE CLICK ---- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---- TOGGLE FILTER (wraps parent callback + closes dropdown) ---- */
  const handleToggle = (item: string) => {
    onToggleFilter(item);
    setShowDropdown(false);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      {/* ================= SEARCH BAR ================= */}
      <div
        ref={dropdownRef}
        className="
          max-w-4xl mx-auto bg-white shadow rounded-xl p-4
          flex flex-col md:flex-row gap-3 md:items-center relative
        "
      >
        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:flex-1 min-w-0 border rounded-lg px-4 py-2 text-sm md:text-base outline-none"
        />

        {/* CATEGORY DROPDOWN */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setShowDropdown((p) => !p)}
            className="w-full md:w-auto border rounded-lg px-3 py-2 text-sm md:text-base bg-white whitespace-nowrap"
          >
            All Categories
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-full md:w-48 z-50">
              {categories.map((item) => (
                <div
                  key={item}
                  onClick={() => handleToggle(item)}
                  className={`cursor-pointer px-3 py-2 rounded text-sm ${selectedFilters.includes(item)
                      ? "bg-blue-100 text-blue-900"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXTRA CONTROLS (e.g. price range) */}
        {extraControls}

        {/* SEARCH BUTTON */}
        <div className="flex-none">
          <Button variant="blue" onClick={onSearch}>
            Search
          </Button>
        </div>
      </div>

      {/* ================= FILTER CHIPS ================= */}
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {selectedFilters.map((item) => (
            <button
              key={item}
              onClick={() => handleToggle(item)}
              className="
                flex items-center gap-1
                px-3 py-1
                text-sm
                rounded-full
                bg-blue-100 text-blue-800
                hover:bg-blue-200
                transition
              "
            >
              {item} <X className="w-3 h-3" />
            </button>
          ))}

          <button
            onClick={onClearFilters}
            className="text-xs text-gray-500 hover:text-black transition"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
}
