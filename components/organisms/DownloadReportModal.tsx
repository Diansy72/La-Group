"use client";

import React, { useState } from "react";
import { X, Download } from "lucide-react";
import Button from "@/components/atoms/button";
import { formatCurrency } from "@/lib/formatters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const getDisplayDuration = (item: any) => {
  if (item.duration === "Half Day" || item.duration === "Full Day") {
    return item.duration;
  }
  if (item.type === "car") {
    const pkg = item.vehiclePackages?.find((p: any) => p.id === item.packageId);
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

const getPackageLabel = (item: any) => {
  const displayDuration = getDisplayDuration(item);
  if (item.type === "motorcycle") {
    return `${displayDuration} + Self Drive + No BBM`;
  }
  const pkg = item.vehiclePackages?.find((p: any) => p.id === item.packageId);
  if (pkg) {
    const driver = pkg.driverType === "with_driver" ? "With Driver" : "Self Drive";
    const fuel = pkg.fuelOption === "with_fuel" ? "BBM" : "Without BBM";
    return `${displayDuration} + ${driver} + ${fuel}`;
  }
  return `${displayDuration} + Self Drive + Without BBM`;
};

const indonesianMonths = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const indonesianMonthsShort = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
];

const formatIndonesianDate = (dateStr: string, isShort = false) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  
  const monthName = isShort ? indonesianMonthsShort[month] : indonesianMonths[month];
  return `${day} ${monthName} ${year}`;
};

const formatIndonesianGeneratedAt = (date: Date) => {
  const day = date.getDate();
  const month = indonesianMonths[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export default function DownloadReportModal({ isOpen, onClose }: DownloadReportModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusBooked, setStatusBooked] = useState(true);
  const [statusCancelled, setStatusCancelled] = useState(false);
  const [format, setFormat] = useState<"PDF" | "Excel">("PDF");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg("Harap pilih tanggal awal dan akhir.");
      return;
    }
    if (!statusBooked && !statusCancelled) {
      setErrorMsg("Harap pilih minimal satu status filter.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const statuses = [];
      if (statusBooked) statuses.push("BOOKED");
      if (statusCancelled) statuses.push("CANCELLED");

      const res = await fetch(
        `/api/bookings/report?startDate=${startDate}&endDate=${endDate}&status=${statuses.join(",")}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch report data");
      }
      const data = await res.json();

      // Calculations
      const totalTransactions = data.length;
      const bookedTransactions = data.filter((b: any) => b.status === "BOOKED").length;
      const cancelledTransactions = data.filter((b: any) => b.status === "CANCELLED").length;
      const totalRevenue = data
        .filter((b: any) => b.status === "BOOKED")
        .reduce((sum: number, b: any) => sum + (b.finalPrice || 0), 0);

      const summary = {
        startDate,
        endDate,
        totalTransactions,
        bookedTransactions,
        cancelledTransactions,
        totalRevenue,
      };

      // Vehicle Performance calculations (descending by Total Revenue)
      const performanceMap: Record<string, { name: string; bookings: number; revenue: number }> = {};
      data.forEach((b: any) => {
        const vName = b.vehicleName;
        if (!performanceMap[vName]) {
          performanceMap[vName] = { name: vName, bookings: 0, revenue: 0 };
        }
        performanceMap[vName].bookings += 1;
        if (b.status === "BOOKED") {
          performanceMap[vName].revenue += b.finalPrice || 0;
        }
      });

      const vehiclePerformance = Object.values(performanceMap).sort(
        (a, b) => b.revenue - a.revenue
      );

      if (format === "Excel") {
        // Sheet 1: Ringkasan
        const summaryData = [
          { Indikator: "Total Transaksi", Nilai: summary.totalTransactions },
          { Indikator: "Transaksi Dipesan", Nilai: summary.bookedTransactions },
          { Indikator: "Transaksi Dibatalkan", Nilai: summary.cancelledTransactions },
          { Indikator: "Total Pendapatan", Nilai: summary.totalRevenue },
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);

        // Append vehicle performance to Sheet 1 Summary
        XLSX.utils.sheet_add_aoa(wsSummary, [[]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(wsSummary, [["Performa Kendaraan"]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(wsSummary, [["Nama Kendaraan", "Total Pemesanan", "Total Pendapatan"]], { origin: -1 });
        const perfRows = vehiclePerformance.map((p) => [p.name, `${p.bookings} pemesanan`, p.revenue]);
        XLSX.utils.sheet_add_aoa(wsSummary, perfRows, { origin: -1 });

        // Sheet 2: Detail Pemesanan
        const detailsData = data.map((item: any) => {
          const displayDuration = getDisplayDuration(item);
          const retDate = getReturnDate(item.bookingDate, item.time, displayDuration);
          const pkgLabel = getPackageLabel(item);

          return {
            "Tanggal Pemesanan": item.bookingDate,
            "Tanggal Pengembalian": retDate,
            "Nama Kendaraan": item.vehicleName,
            "Nomor Plat": item.licensePlate,
            "Tipe": item.type === "car" ? "Mobil" : "Motor",
            "Durasi": displayDuration,
            "Nama Pelanggan": item.customer,
            "Nomor Telepon": item.phone || "-",
            "Paket": pkgLabel,
            "Harga": item.finalPrice || 0,
            "Status": item.status === "BOOKED" ? "Dipesan" : "Dibatalkan",
          };
        });
        const wsDetails = XLSX.utils.json_to_sheet(detailsData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
        XLSX.utils.book_append_sheet(wb, wsDetails, "Detail Pemesanan");

        XLSX.writeFile(wb, `Laporan_Pemesanan_Kendaraan_${startDate}_to_${endDate}.xlsx`);
      } else {
        // PDF Export
        const doc = new jsPDF();
        doc.setFont("Helvetica");

        // Header Section
        doc.setFontSize(20);
        doc.setTextColor(0, 59, 115); // L.A Group primary blue
        doc.text("L.A Group Official", 14, 20);

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("Laporan Pemesanan Kendaraan", 14, 28);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Periode: ${formatIndonesianDate(startDate)} - ${formatIndonesianDate(endDate)}`, 14, 35);
        doc.text(`Dibuat Pada: ${formatIndonesianGeneratedAt(new Date())}`, 14, 41);

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 45, 196, 45);

        // Summary Cards Section
        autoTable(doc, {
          startY: 50,
          head: [["Total Transaksi", "Transaksi Dipesan", "Transaksi Dibatalkan", "Total Pendapatan"]],
          body: [[
            summary.totalTransactions,
            summary.bookedTransactions,
            summary.cancelledTransactions,
            formatCurrency(summary.totalRevenue)
          ]],
          theme: "striped",
          headStyles: { fillColor: [0, 59, 115], textColor: [255, 255, 255], fontStyle: "bold" },
          styles: { halign: "center", fontSize: 11 },
        });

        // Booking Details Section Title
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont("Helvetica", "bold");
        doc.text("Detail Pemesanan", 14, (doc as any).lastAutoTable.finalY + 10);

        // Booking Details Table
        const detailsRows = data.map((item: any) => {
          const displayDuration = getDisplayDuration(item);
          const retDate = getReturnDate(item.bookingDate, item.time, displayDuration);
          const pkgLabel = getPackageLabel(item);

          return [
            `${formatIndonesianDate(item.bookingDate, true)}\n${item.time}`,
            formatIndonesianDate(retDate, true),
            `${item.vehicleName}\n(${item.licensePlate})`,
            item.type === "car" ? "Mobil" : "Motor",
            displayDuration,
            `${item.customer}\n${item.phone || "-"}`,
            pkgLabel,
            formatCurrency(item.finalPrice || 0),
            item.status === "BOOKED" ? "Dipesan" : "Dibatalkan"
          ];
        });

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [["Tgl Pemesanan", "Tgl Pengembalian", "Kendaraan (Plat)", "Tipe", "Durasi", "Pelanggan", "Paket", "Harga", "Status"]],
          body: detailsRows,
          theme: "grid",
          styles: { fontSize: 8, overflow: "linebreak" },
          headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 22 },
            2: { cellWidth: 22 },
            3: { cellWidth: 15 },
            4: { cellWidth: 15 },
            5: { cellWidth: 22 },
            6: { cellWidth: 32 },
            7: { cellWidth: 20 },
            8: { cellWidth: 18 },
          },
          didParseCell: (cellData) => {
            if (cellData.section === 'body' && cellData.column.index === 8) {
              const statusVal = cellData.cell.raw as string;
              if (statusVal === 'Dipesan') {
                cellData.cell.styles.textColor = [22, 163, 74];
                cellData.cell.styles.fontStyle = 'bold';
              } else if (statusVal === 'Dibatalkan') {
                cellData.cell.styles.textColor = [220, 38, 38];
                cellData.cell.styles.fontStyle = 'bold';
              }
            }
          }
        });

        // Vehicle Performance Section Title
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont("Helvetica", "bold");
        doc.text("Performa Kendaraan", 14, (doc as any).lastAutoTable.finalY + 10);

        // Vehicle Performance Table
        const perfRows = vehiclePerformance.map(p => [
          p.name,
          `${p.bookings} pemesanan`,
          formatCurrency(p.revenue)
        ]);

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [["Nama Kendaraan", "Total Pemesanan", "Total Pendapatan"]],
          body: perfRows,
          theme: "striped",
          headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
          styles: { fontSize: 9 },
        });

        doc.save(`Laporan_Pemesanan_Kendaraan_${startDate}_to_${endDate}.pdf`);
      }

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat menghasilkan laporan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Download Laporan</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleDownload} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Periode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Tanggal Awal</span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Tanggal Akhir</span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Filter Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusBooked}
                  onChange={(e) => setStatusBooked(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900/20"
                />
                Booked
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusCancelled}
                  onChange={(e) => setStatusCancelled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900/20"
                />
                Cancelled
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === "PDF"}
                  onChange={() => setFormat("PDF")}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-900/20"
                />
                PDF
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === "Excel"}
                  onChange={() => setFormat("Excel")}
                  className="w-4 h-4 text-blue-900 focus:ring-blue-900/20"
                />
                Excel (.xlsx)
              </label>
            </div>
          </div>

          {errorMsg && <p className="text-xs font-semibold text-red-600">{errorMsg}</p>}

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-50 text-sm font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold flex items-center gap-2"
            >
              {isLoading ? (
                "Membuat Laporan..."
              ) : (
                <>
                  <Download size={16} />
                  Download
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
