"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
};

export default function CustomSelect({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full md:max-w-sm md:mx-auto">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full 
          flex items-center justify-center md:justify-between
          border border-white/30 md:border-none
          rounded-xl md:rounded-none
          px-4 py-2
          text-yellow-400 text-sm
          bg-transparent
        "
      >
        <span>{selected?.label}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {options.map((item) => (
            <div
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`
                px-4 py-2 text-sm text-yellow-500 cursor-pointer text-center md:text-left
                ${
                  item.value === value
                    ? "bg-blue-100 "
                    : "hover:bg-gray-100"
                }
              `}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}