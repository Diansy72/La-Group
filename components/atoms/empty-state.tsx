"use client";

import { SearchX } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters",
}: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center  text-center">
      <SearchX className="w-12 h-12 text-gray-400 mb-3" />

      <h3 className="text-lg font-semibold text-gray-700">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>
    </div>
  );
}