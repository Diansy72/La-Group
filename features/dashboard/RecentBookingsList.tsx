"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Badge from "@/components/atoms/badge";
import { getPublicUrl } from "@/lib/supabase/storage";

interface RecentBookingItem {
  id: string;
  type: "vehicle" | "tour";
  title: string;
  subtitle: string;
  initial: string;
  imageUrl?: string | null;
  date: string;
  createdAt: string;
  status?: string;
}

export default function RecentBookingsList() {
  const t = useTranslations("Dashboard.main");
  const router = useRouter();
  const [bookings, setBookings] = useState<RecentBookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function timeAgo(dateString: string): string {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return t("justNow");
    if (diffMin < 60) return t("ago", { time: t("minute", { count: diffMin }) });
    if (diffHr < 24) return t("ago", { time: t("hour", { count: diffHr }) });
    if (diffDay < 30) return t("ago", { time: t("day", { count: diffDay }) });
    return t("ago", { time: t("month", { count: diffMonth }) });
  }

  useEffect(() => {
    fetch("/api/recent-bookings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
      })
      .catch((err) => console.error("Failed to fetch recent bookings:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleClick = (item: RecentBookingItem) => {
    if (item.type === "vehicle") {
      router.push("/dashboard/vehicles-pricelist?tab=booking-history");
    } else {
      router.push("/dashboard/tour-packages?tab=booking-history");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">{t("recentBookings")}</h2>
        <p className="text-sm text-gray-400 text-center py-6">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">
        {t("recentBookings")}
      </h2>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t("noBookings")}</p>
      ) : (
        <div className="space-y-0">
          {bookings.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={cn(
                "flex items-center justify-between py-4 px-3 -mx-3 rounded-xl cursor-pointer",
                "border-b border-gray-100 last:border-b-0",
                "hover:bg-slate-50/80 transition-colors"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {item.imageUrl ? (
                  <img
                    src={getPublicUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                    item.type === "vehicle"
                      ? "bg-blue-900 text-white"
                      : "bg-emerald-600 text-white"
                  )}>
                    {item.initial}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {timeAgo(item.createdAt)}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {item.date}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    item.type === "vehicle"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-emerald-50 text-emerald-700"
                  )}>
                    {item.type === "vehicle" ? t("vehicle") : t("tour")}
                  </span>
                  {item.status && (
                    <Badge 
                      status={item.status === "CANCELLED" ? "cancelled_txn" : "booked_txn"} 
                      label={item.status === "CANCELLED" ? "Cancelled" : "Booked"} 
                      className="text-[9px] px-1.5 py-0 scale-90 origin-right"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
