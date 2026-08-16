"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { PerformanceChartDataPoint } from "@/types";
import ChartFilter from "@/components/molecules/ChartFilter";
import { useTranslations } from "next-intl";

export default function RevenueChart() {
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
      console.error("Failed to fetch revenue chart data:", err);
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

  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 45;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(
      ...data.map((d) => Math.max(d.vehicleRevenue || 0, d.tourRevenue || 0))
    ) || 1000000;
    return Math.ceil(maxVal / 1000000) * 1000000;
  }, [data]);

  const vehiclePoints = useMemo(() => {
    return data.map((d, index) => {
      const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * plotWidth;
      const y = paddingTop + plotHeight - ((d.vehicleRevenue || 0) / maxRevenue) * plotHeight;
      return { x, y, value: d.vehicleRevenue };
    });
  }, [data, maxRevenue, plotWidth, plotHeight]);

  const tourPoints = useMemo(() => {
    return data.map((d, index) => {
      const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * plotWidth;
      const y = paddingTop + plotHeight - ((d.tourRevenue || 0) / maxRevenue) * plotHeight;
      return { x, y, value: d.tourRevenue };
    });
  }, [data, maxRevenue, plotWidth, plotHeight]);

  const getLinePath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) * 0.4;
      const cp2x = prev.x + (curr.x - prev.x) * 0.6;
      path += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const vehicleLinePath = useMemo(() => getLinePath(vehiclePoints), [vehiclePoints]);
  const tourLinePath = useMemo(() => getLinePath(tourPoints), [tourPoints]);

  const vehicleAreaPath = useMemo(() => {
    if (vehiclePoints.length === 0) return "";
    return `
      ${vehicleLinePath}
      L ${vehiclePoints[vehiclePoints.length - 1].x} ${paddingTop + plotHeight}
      L ${vehiclePoints[0].x} ${paddingTop + plotHeight}
      Z
    `;
  }, [vehiclePoints, vehicleLinePath, plotHeight]);

  const tourAreaPath = useMemo(() => {
    if (tourPoints.length === 0) return "";
    return `
      ${tourLinePath}
      L ${tourPoints[tourPoints.length - 1].x} ${paddingTop + plotHeight}
      L ${tourPoints[0].x} ${paddingTop + plotHeight}
      Z
    `;
  }, [tourPoints, tourLinePath, plotHeight]);

  const yLabels = Array.from({ length: 6 }, (_, i) => Math.round((maxRevenue / 5) * i));

  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}Jt`;
    } else if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}Rb`;
    }
    return `Rp ${value}`;
  };

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
            Trend Pendapatan (Revenue)
          </h3>
          <p className="text-sm text-[#2563EB] font-medium mt-1">
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
            <defs>
              <linearGradient id="vehicleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="tourGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>

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

            {/* Y LABEL */}
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
                  {formatRevenue(label)}
                </text>
              );
            })}

            {/* VEHICLE AREA & LINE */}
            <path
              d={vehicleAreaPath}
              fill="url(#vehicleGradient)"
              className="transition-all duration-1000 ease-out"
            />
            <path
              d={vehicleLinePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* TOUR AREA & LINE */}
            <path
              d={tourAreaPath}
              fill="url(#tourGradient)"
              className="transition-all duration-1000 ease-out"
            />
            <path
              d={tourLinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* X AXIS LABELS & INTERACTIVE BARS */}
            {data.map((item, index) => {
              const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * plotWidth;
              const targetWidth = plotWidth / Math.max(data.length - 1, 1);
              const targetX = x - targetWidth / 2;

              return (
                <g key={index}>
                  {/* Vertical Line on Hover */}
                  {hoveredIndex === index && (
                    <line
                      x1={x}
                      x2={x}
                      y1={paddingTop}
                      y2={paddingTop + plotHeight}
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* X Label */}
                  <text
                    x={x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#64748B"
                    fontWeight="600"
                  >
                    {item.label}
                  </text>

                  {/* Vehicle Dots */}
                  <circle
                    cx={x}
                    cy={vehiclePoints[index]?.y}
                    r={hoveredIndex === index ? 6 : 4}
                    fill="#ffffff"
                    stroke="#2563EB"
                    strokeWidth="3"
                    className="transition-all duration-150"
                  />

                  {/* Tour Dots */}
                  <circle
                    cx={x}
                    cy={tourPoints[index]?.y}
                    r={hoveredIndex === index ? 6 : 4}
                    fill="#ffffff"
                    stroke="#10B981"
                    strokeWidth="3"
                    className="transition-all duration-150"
                  />

                  {/* Transparent hover catcher */}
                  <rect
                    x={targetX}
                    y={paddingTop}
                    width={targetWidth}
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
          <span className="w-3.5 h-1.5 rounded bg-[#2563EB] inline-block" />
          <span>Sewa Kendaraan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded bg-[#10B981] inline-block" />
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
            <span>Detail Pendapatan</span>
            <span className="text-yellow-400">{data[hoveredIndex].label}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-medium">Kendaraan:</span>
            <span className="font-bold text-blue-400">
              {formatRevenue(data[hoveredIndex].vehicleRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 font-medium">Paket Tur:</span>
            <span className="font-bold text-emerald-400">
              {formatRevenue(data[hoveredIndex].tourRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4 border-t border-white/10 pt-1.5 font-bold">
            <span>Total:</span>
            <span className="text-yellow-300">
              {formatRevenue(
                data[hoveredIndex].vehicleRevenue + data[hoveredIndex].tourRevenue
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}