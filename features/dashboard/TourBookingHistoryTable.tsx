import React, { useState } from "react";
import { TourBookingHistory } from "@/types";
import { cn } from "@/lib/cn";
import Badge from "@/components/atoms/badge";
import { formatCurrency } from "@/features/dashboard/services/data";
import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import DetailModal from "@/components/organisms/DetailModal";

interface TourBookingHistoryTableProps {
  data: TourBookingHistory[];
  className?: string;
}

export default function TourBookingHistoryTable({ data, className }: TourBookingHistoryTableProps) {
  const t = useTranslations("Dashboard.historyTable");
  const [selectedItem, setSelectedItem] = useState<TourBookingHistory | null>(null);

  const columns = [
    t("packageName"),
    t("customer"),
    t("vehicle"),
    t("totalPrice"),
    t("phone"),
    t("action")
  ];

  if (data.length === 0) {
    return (
      <div className={cn("bg-white rounded-b-2xl border border-gray-200 p-8 text-center", className)}>
        <p className="text-gray-500">{t("noHistory")}</p>
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    const s = (status || "active").toLowerCase();
    if (s === "cancelled") {
      return { status: "cancelled_txn", label: "Cancelled" };
    }
    if (s === "completed") {
      return { status: "available", label: "Completed" };
    }
    return { status: "booked_txn", label: "Active" };
  };

  const getModalItems = (item: TourBookingHistory) => {
    const { status, label } = getStatusBadge(item.status);
    return [
      { label: t("packageName"), value: item.packageName },
      { label: t("customer"), value: item.customerName },
      { label: t("category"), value: item.category || "-" },
      { label: t("priceType"), value: item.priceType === "per_person" ? t("perPerson") : t("perCar") },
      { label: t("vehicle"), value: item.vehicleType },
      { label: t("pax"), value: `${item.pax} ${t("pax")}` },
      { label: t("totalPrice"), value: formatCurrency(item.totalPrice) },
      { label: t("date"), value: item.bookingDate },
      { label: t("time"), value: item.time },
      { label: t("phone"), value: item.phone || "-" },
      { label: t("status"), value: <Badge status={status} label={label} /> },
      { label: t("notes"), value: <div className="break-words max-w-sm whitespace-pre-wrap">{item.notes || "-"}</div> },
    ];
  };

  return (
    <div className={cn("bg-white rounded-b-2xl border border-gray-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
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
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={cn(
                  "hover:bg-[#F8FAFC]/50 transition-colors",
                  index % 2 === 1 && "bg-[#FAFBFC]"
                )}
              >
                <td className="px-5 py-4 text-sm font-semibold text-[#1E293B]">
                  {item.packageName}
                </td>
                <td className="px-5 py-4 text-sm text-[#1E293B]">
                  {item.customerName}
                </td>
                <td className="px-5 py-4 text-sm text-[#1E293B]">
                  {item.vehicleType}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#1E293B]">
                  {formatCurrency(item.totalPrice)}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">
                  {item.phone || "-"}
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
            ))}
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
