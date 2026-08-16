"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/cn";
import {
  DollarSign,
  CalendarCheck,
  Car,
  CarFront,
} from "lucide-react";
import { useTranslations } from "next-intl";
import ChartFilter from "@/components/molecules/ChartFilter";

interface StatItem {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function AnimatedNumber({ value, isCurrency }: { value: number; isCurrency?: boolean }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const startVal = prevValue.current;
    prevValue.current = value;

    const duration = 1200;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(startVal + (value - startVal) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {isCurrency ? formatCurrency(display) : display.toLocaleString("id-ID")}
    </span>
  );
}

/* ─── Month/Year helpers ─── */
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function getYearOptions(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 4; y--) {
    years.push(y);
  }
  return years;
}

/* ─── Main Component ─── */
export default function StatsCardGrid() {
  const t = useTranslations("Dashboard.main");

  const isID = t("weekly") === "Mingguan";
  const monthNames = isID ? MONTHS_ID : MONTHS_EN;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");

  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [activeBookings, setActiveBookings] = useState<number>(0);
  const [availableUnits, setAvailableUnits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      month: String(selectedMonth + 1), // API expects 1-indexed
      year: String(selectedYear),
      period: activeRange,
    });
    fetch(`/api/dashboard-stats?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setTotalRevenue(data.totalRevenue ?? 0);
          setTotalBookings(data.totalBookings ?? 0);
          setActiveBookings(data.activeBookings ?? 0);
          setAvailableUnits(data.availableUnits ?? 0);
        }
      })
      .catch((err) => console.error("Failed to fetch stats:", err))
      .finally(() => setIsLoading(false));
  }, [selectedMonth, selectedYear, activeRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats: StatItem[] = [
    {
      label: t("totalRevenue"),
      icon: <DollarSign size={22} strokeWidth={2.5} />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: t("totalBookings"),
      icon: <CalendarCheck size={22} strokeWidth={2.5} />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: t("activeRentals"),
      icon: <Car size={22} strokeWidth={2.5} />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: t("availableVehicles"),
      icon: <CarFront size={22} strokeWidth={2.5} />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const statValues = [totalRevenue, totalBookings, activeBookings, availableUnits];

  return (
    <div>
      {/* Header: Title + ChartFilter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold text-gray-900">{t("dashboardTitle")}</h2>

        <ChartFilter
          activeRange={activeRange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthNames={monthNames}
          yearOptions={getYearOptions()}
          onRangeChange={setActiveRange}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "bg-white rounded-2xl border border-gray-200 p-5",
              "hover:shadow-lg hover:border-gray-200 hover:scale-[1.02]",
              "transition-all duration-300 cursor-default",
              "stat-card-animate opacity-0",
              "flex items-center gap-4"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                "transition-transform duration-300",
                stat.iconBg,
                stat.iconColor
              )}
            >
              {stat.icon}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <p className="text-sm text-gray-500 font-medium mb-0.5 truncate">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 truncate">
                {isLoading ? (
                  <span className="inline-block w-20 h-7 bg-gray-200 rounded-md animate-pulse" />
                ) : (
                  <AnimatedNumber
                    value={statValues[index]}
                    isCurrency={index === 0}
                  />
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
