"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { PerformanceChartDataPoint } from "@/types";
import ChartFilter from "@/components/molecules/ChartFilter";
import { useTranslations } from "next-intl";

export default function BookingChart() {
  const t = useTranslations("Dashboard.main");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState<PerformanceChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i).toLocaleString("id-ID", { month: "long" })
  );

  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

  const fetchChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        range: activeRange,
        month: String(selectedMonth + 1),
        year: String(selectedYear),
      });
      const res = await fetch(`/api/dashboard-charts?${params}`);
      const result = await res.json();
      if (Array.isArray(result)) {
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch booking chart data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeRange, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const periodLabel = activeRange === "weekly"
    ? `${t("weekly")} - ${monthNames[selectedMonth]} ${selectedYear}`
    : `${t("monthly")} - ${selectedYear}`;

  const chartWidth = 900;
  const chartHeight = 320;

  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 45;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxBookings = useMemo(() => {
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.vehicleBookings || 0, d.tourBookings || 0))
    ) || 10;
    return Math.ceil(maxVal / 5) * 5;
  }, [data]);

  const yLabels = Array.from({ length: 6 }, (_, i) => Math.round((maxBookings / 5) * i));

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-[18px] text-slate-900">
            Total Pemesanan (Bookings)
          </h3>
          <p className="text-sm text-[#D97706] font-medium mt-1">
            {periodLabel}
          </p>
        </div>

        <ChartFilter
          activeRange={activeRange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthNames={monthNames}
          yearOptions={yearOptions}
          onRangeChange={setActiveRange}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {/* CHART */}
      <div className="relative">
        {isLoading ? (
          <div className="h-[320px] flex items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span>Memuat data...</span>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* GRID */}
            {yLabels.map((_, i) => {
              const y = paddingTop + plotHeight - (i / 5) * plotHeight;
              return (
                <line
                  key={i}
                  x1={paddingLeft}
                  x2={chartWidth - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Y LABELS */}
            {yLabels.map((label, i) => {
              const y = paddingTop + plotHeight - (i / 5) * plotHeight;
              return (
                <text
                  key={i}
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {label}
                </text>
              );
            })}

            {/* BARS */}
            {data.map((item, index) => {
              const groupGap = plotWidth / data.length;
              const barWidth = Math.min(24, groupGap * 0.35);
              const barSpacing = 4;

              const groupCenterX = paddingLeft + index * groupGap + groupGap / 2;
              const xVehicle = groupCenterX - barWidth - barSpacing / 2;
              const xTour = groupCenterX + barSpacing / 2;

              const vehicleBarHeight = ((item.vehicleBookings || 0) / maxBookings) * plotHeight;
              const tourBarHeight = ((item.tourBookings || 0) / maxBookings) * plotHeight;

              const yVehicle = paddingTop + plotHeight - vehicleBarHeight;
              const yTour = paddingTop + plotHeight - tourBarHeight;

              const targetX = paddingLeft + index * groupGap;

              return (
                <g key={index}>
                  {/* Hover background highlight */}
                  {hoveredIndex === index && (
                    <rect
                      x={targetX + 4}
                      y={paddingTop - 10}
                      width={groupGap - 8}
                      height={plotHeight + 20}
                      fill="#F8FAFC"
                      rx={8}
                      className="opacity-60 pointer-events-none"
                    />
                  )}

                  {/* Vehicle Bar */}
                  <rect
                    x={xVehicle}
                    y={yVehicle}
                    width={barWidth}
                    height={Math.max(2, vehicleBarHeight)}
                    rx={4}
                    fill={hoveredIndex === index ? "#2563EB" : "#3B82F6"}
                    className="transition-all duration-200"
                  />

                  {/* Tour Bar */}
                  <rect
                    x={xTour}
                    y={yTour}
                    width={barWidth}
                    height={Math.max(2, tourBarHeight)}
                    rx={4}
                    fill={hoveredIndex === index ? "#059669" : "#10B981"}
                    className="transition-all duration-200"
                  />

                  {/* X LABEL */}
                  <text
                    x={groupCenterX}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748B"
                    fontWeight="600"
                  >
                    {item.label}
                  </text>

                  {/* Transparent hover catcher */}
                  <rect
                    x={targetX}
                    y={paddingTop}
                    width={groupGap}
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend at the bottom middle */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#3B82F6] inline-block" />
          <span>Sewa Kendaraan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#10B981] inline-block" />
          <span>Paket Tur</span>
        </div>
      </div>

      {/* Dynamic Floating Tooltip tracking cursor */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute z-10 bg-slate-950/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs flex flex-col gap-2 pointer-events-none transition-all duration-75"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 10}px`,
            transform: "translate(-50%, -100%)",
            minWidth: "160px",
          }}
        >
          <div className="font-bold border-b border-white/10 pb-1.5 mb-1 text-slate-300 flex justify-between">
            <span>Detail Pemesanan</span>
            <span className="text-yellow-400">{data[hoveredIndex].label}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-medium">Kendaraan:</span>
            <span className="font-bold text-blue-400">
              {data[hoveredIndex].vehicleBookings} booking
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-medium">Paket Tur:</span>
            <span className="font-bold text-emerald-400">
              {data[hoveredIndex].tourBookings} booking
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 border-t border-white/10 pt-1.5 font-bold">
            <span>Total:</span>
            <span className="text-yellow-300">
              {data[hoveredIndex].vehicleBookings + data[hoveredIndex].tourBookings} booking
            </span>
          </div>
        </div>
      )}
    </div>
  );
}