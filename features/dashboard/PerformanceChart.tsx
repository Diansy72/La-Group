"use client";

import RevenueChart from "./RevenueChart";
import BookingChart from "./BookingChart";

export default function PerformanceChart() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RevenueChart />
      <BookingChart />
    </div>
  );
}