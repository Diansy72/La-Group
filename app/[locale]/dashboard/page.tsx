"use client";

import React from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import StatsCardGrid from "@/features/dashboard/StatsCardGrid";
import PerformanceChart from "@/features/dashboard/PerformanceChart";
import RecentBookingsList from "@/features/dashboard/RecentBookingsList";
import {
  weeklyChartData,
  monthlyChartData,
} from "@/features/dashboard/services/data";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const sidebarT = useTranslations("Dashboard.sidebar");

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard") },
      ]}
    >
      {/* Stats Cards */}
      <div className="mb-6">
        <StatsCardGrid />
      </div>

      {/* Performance Overview Chart */}
      <div className="mb-6">
        <PerformanceChart />
      </div>

      {/* Recent Bookings */}
      <div>
        <RecentBookingsList />
      </div>
    </DashboardLayout>
  );
}
