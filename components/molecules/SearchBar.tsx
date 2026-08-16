"use client";

import React from "react";
import Input from "@/components/atoms/input";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Cari di sini...",
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={className}>
      <Input
        hasSearchIcon
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full min-w-[280px] bg-gray-50 border-transparent focus:bg-white"
      />
    </div>
  );
}
