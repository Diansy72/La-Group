import React, { useState } from "react";
import { BookingHistory } from "@/types";
import { cn } from "@/lib/cn";
import { useTranslations } from "next-intl";
import Badge from "@/components/atoms/badge";
import { Eye } from "lucide-react";
import DetailModal from "@/components/organisms/DetailModal";
import { formatCurrency } from "@/lib/formatters";

interface BookingHistoryTableProps {
  data: BookingHistory[];
  className?: string;
}

function getReturnDate(bookingDateStr: string, timeStr: string, durationStr: string): string {
  if (!bookingDateStr) return "-";
  const time = timeStr || "08:00";
  const [year, month, day] = bookingDateStr.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0);

  if (durationStr === "Half Day") {
    date.setHours(date.getHours() + 12);
  } else {
    date.setHours(date.getHours() + 24);
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const getDisplayDuration = (item: BookingHistory) => {
  if (item.duration === "Half Day" || item.duration === "Full Day") {
    return item.duration;
  }
  if (item.type === "car") {
    const pkg = item.vehiclePackages?.find((p) => p.id === item.packageId);
    if (pkg) {
      return pkg.duration === "half_day" ? "Half Day" : "Full Day";
    }
  }
  if (item.type === "motorcycle" && item.vehicleRentalDuration) {
    return item.vehicleRentalDuration === "Half Day" ? "Half Day" : "Full Day";
  }
  const durLower = (item.duration || "").toLowerCase();
  if (durLower.includes("half") || durLower.includes("12")) {
    return "Half Day";
  }
  return "Full Day";
};

export default function BookingHistoryTable({ data, className }: BookingHistoryTableProps) {
  const t = useTranslations("Dashboard.historyTable");
  const [selectedItem, setSelectedItem] = useState<BookingHistory | null>(null);

  const columns = [
    t("vehicle"),
    t("plate"),
    t("price"),
    t("customer"),
    t("phone"),
    t("status"),
    t("action"),
  ];

  if (data.length === 0) {
    return (
      <div className={cn("bg-white rounded-2xl border border-gray-200 p-8 text-center", className)}>
        <p className="text-gray-500">{t("noHistory")}</p>
      </div>
    );
  }

  // Get Detail Modal Items for Selected Item
  const getModalItems = (item: BookingHistory) => {
    const displayType = item.type === "car" ? "Car" : (item.type === "motorcycle" ? "Motorcycle" : item.type);
    const displayDuration = getDisplayDuration(item);
    const returnDate = getReturnDate(item.bookingDate, item.time, displayDuration);
    const isCancelled = item.status === "CANCELLED";
    const badgeStatus = isCancelled ? "cancelled_txn" : "booked_txn";
    const badgeLabel = isCancelled ? "Cancelled" : "Booked";

    return [
      { label: t("vehicle"), value: item.vehicleName },
      { label: t("plate"), value: <span className="font-mono tracking-widest">{item.licensePlate}</span> },
      { label: t("type"), value: displayType },
      { label: t("date"), value: `${item.bookingDate} → ${returnDate}` },
      { label: t("time"), value: item.time },
      { label: t("duration"), value: displayDuration },
      { label: t("price"), value: item.finalPrice ? formatCurrency(item.finalPrice) : "-" },
      { label: t("customer"), value: item.customer },
      { label: t("phone"), value: item.phone || "-" },
      { label: t("status"), value: <Badge status={badgeStatus} label={badgeLabel} /> },
      { label: t("notes"), value: <div className="break-words max-w-sm whitespace-pre-wrap">{item.notes || "-"}</div> },
    ];
  };

  return (
    <div className="bg-white rounded-b-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-5 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, index) => {
              const isCancelled = item.status === "CANCELLED";
              const badgeStatus = isCancelled ? "cancelled_txn" : "booked_txn";
              const badgeLabel = isCancelled ? "Cancelled" : "Booked";

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-[#F8FAFC]/50 transition-colors",
                    index % 2 === 1 && "bg-[#FAFBFC]"
                  )}
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[#1E293B]">
                    {item.vehicleName}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-[#64748B] tracking-widest">
                      {item.licensePlate}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#1E293B]">
                    {item.finalPrice ? formatCurrency(item.finalPrice) : "-"}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {item.customer}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {item.phone || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <Badge status={badgeStatus} label={badgeLabel} />
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Detail History"
        items={selectedItem ? getModalItems(selectedItem) : []}
      />
    </div>
  );
}
