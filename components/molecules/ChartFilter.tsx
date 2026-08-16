"use client";

import { CalendarDays } from "lucide-react";

export interface ChartFilterProps {
  activeRange: "weekly" | "monthly";

  selectedMonth: number;
  selectedYear: number;

  monthNames: string[];
  yearOptions: number[];

  onRangeChange: (
    value: "weekly" | "monthly"
  ) => void;

  onMonthChange: (
    value: number
  ) => void;

  onYearChange: (
    value: number
  ) => void;
}

export default function ChartFilter({
  activeRange,
  selectedMonth,
  selectedYear,
  monthNames,
  yearOptions,
  onRangeChange,
  onMonthChange,
  onYearChange,
}: ChartFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {/* RANGE */}
      <div className="relative">
        <CalendarDays
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={activeRange}
          onChange={(e) =>
            onRangeChange(
              e.target.value as
                | "weekly"
                | "monthly"
            )
          }
          className="
            h-10
            pl-9
            pr-8
            rounded-lg
            border
            border-slate-200
            text-sm
            font-medium
            bg-white
          "
        >
          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>
        </select>
      </div>

      {/* MONTH */}
      <select
        value={selectedMonth}
        onChange={(e) =>
          onMonthChange(
            Number(e.target.value)
          )
        }
        className="
          h-10
          px-3
          rounded-lg
          border
          border-slate-200
          text-sm
        "
      >
        {monthNames.map((month, index) => (
          <option
            key={index}
            value={index}
          >
            {month}
          </option>
        ))}
      </select>

      {/* YEAR */}
      <select
        value={selectedYear}
        onChange={(e) =>
          onYearChange(
            Number(e.target.value)
          )
        }
        className="
          h-10
          px-3
          rounded-lg
          border
          border-slate-200
          text-sm
        "
      >
        {yearOptions.map((year) => (
          <option
            key={year}
            value={year}
          >
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}