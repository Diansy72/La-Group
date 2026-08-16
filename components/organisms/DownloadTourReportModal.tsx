"use client";

import React, { useState } from "react";
import { X, Download } from "lucide-react";
import Button from "@/components/atoms/button";
import { formatCurrency } from "@/lib/formatters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface DownloadTourReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function DownloadTourReportModal({ isOpen, onClose }: DownloadTourReportModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/tour-bookings/report?startDate=${startDate}&endDate=${endDate}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch report data");
      }
      const data = await res.json();

      // Calculations
      const totalTransactions = data.length;
      const totalParticipants = data.reduce((sum: number, b: any) => sum + (b.pax || 0), 0);
      const totalRevenue = data.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

      const summary = {
        startDate,
        endDate,
        totalTransactions,
        totalParticipants,
        totalRevenue,
      };

      // Package Performance calculations (descending by Total Revenue)
      const performanceMap: Record<
        string,
        { name: string; bookings: number; participants: number; revenue: number }
      > = {};
      data.forEach((b: any) => {
        const pName = b.packageName;
        if (!performanceMap[pName]) {
          performanceMap[pName] = { name: pName, bookings: 0, participants: 0, revenue: 0 };
        }
        performanceMap[pName].bookings += 1;
        performanceMap[pName].participants += b.pax || 0;
        performanceMap[pName].revenue += b.totalPrice || 0;
      });

      const packagePerformance = Object.values(performanceMap).sort(
        (a, b) => b.revenue - a.revenue
      );

      if (format === "Excel") {
        // Sheet 1: Ringkasan
        const summaryData = [
          { Indikator: "Total Transaksi", Nilai: summary.totalTransactions },
          { Indikator: "Total Peserta", Nilai: `${summary.totalParticipants} Pax` },
          { Indikator: "Total Pendapatan", Nilai: summary.totalRevenue },
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summaryData);

        // Append Package Performance to Sheet 1
        XLSX.utils.sheet_add_aoa(wsSummary, [[]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(wsSummary, [["Performa Paket Tur"]], { origin: -1 });
        XLSX.utils.sheet_add_aoa(
          wsSummary,
          [["Nama Paket", "Total Pemesanan", "Total Peserta", "Total Pendapatan"]],
          { origin: -1 }
        );
        const perfRows = packagePerformance.map((p) => [
          p.name,
          `${p.bookings} pemesanan`,
          `${p.participants} Pax`,
          p.revenue,
        ]);
        XLSX.utils.sheet_add_aoa(wsSummary, perfRows, { origin: -1 });

        // Sheet 2: Detail Pemesanan
        const detailsData = data.map((item: any) => {
          return {
            "Nama Paket": item.packageName,
            "Nama Pelanggan": item.customerName,
            "Kategori": item.category || "-",
            "Tipe Harga": item.priceType === "per_person" ? "Per Orang" : "Per Mobil",
            "Nama Kendaraan": item.vehicleType,
            "Peserta": `${item.pax} Pax`,
            "Total Harga": item.totalPrice || 0,
            "Tanggal Pemesanan": item.bookingDate,
            "Waktu Pemesanan": item.time,
            "Nomor Telepon": item.phone || "-",
            "Catatan": item.notes || "-",
          };
        });
        const wsDetails = XLSX.utils.json_to_sheet(detailsData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
        XLSX.utils.book_append_sheet(wb, wsDetails, "Detail Pemesanan");

        XLSX.writeFile(wb, `Laporan_Pemesanan_Tur_${startDate}_to_${endDate}.xlsx`);
      } else {
        // PDF Export
        const doc = new jsPDF();
        doc.setFont("Helvetica");

        // Header Section
        doc.setFontSize(20);
        doc.setTextColor(0, 59, 115); // Primary blue
        doc.text("Andika Trans", 14, 20);

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("Laporan Pemesanan Paket Tur", 14, 28);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Periode: ${formatIndonesianDate(startDate)} - ${formatIndonesianDate(endDate)}`, 14, 35);
        doc.text(`Dibuat Pada: ${formatIndonesianGeneratedAt(new Date())}`, 14, 41);

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 45, 196, 45);

        // Summary Cards Section
        autoTable(doc, {
          startY: 50,
          head: [["Total Transaksi", "Total Peserta", "Total Pendapatan"]],
          body: [[
            summary.totalTransactions,
            `${summary.totalParticipants} Pax`,
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
          return [
            item.packageName,
            item.customerName,
            item.category || "-",
            item.priceType === "per_person" ? "Per Orang" : "Per Mobil",
            item.vehicleType,
            `${item.pax} Pax`,
            formatCurrency(item.totalPrice || 0),
            `${formatIndonesianDate(item.bookingDate, true)}\n${item.time}`,
            item.phone || "-",
            item.notes || "-"
          ];
        });

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [["Nama Paket", "Pelanggan", "Kategori", "Tipe Harga", "Kendaraan", "Peserta", "Total Harga", "Tgl & Waktu", "Telepon", "Catatan"]],
          body: detailsRows,
          theme: "grid",
          styles: { fontSize: 7, overflow: "linebreak" },
          headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 16 },
            2: { cellWidth: 15 },
            3: { cellWidth: 17 },
            4: { cellWidth: 18 },
            5: { cellWidth: 14 },
            6: { cellWidth: 20 },
            7: { cellWidth: 22 },
            8: { cellWidth: 20 },
            9: { cellWidth: 20 },
          }
        });

        // Package Performance Section Title
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont("Helvetica", "bold");
        doc.text("Performa Paket Tur", 14, (doc as any).lastAutoTable.finalY + 10);

        // Package Performance Table
        const perfRows = packagePerformance.map(p => [
          p.name,
          `${p.bookings} pemesanan`,
          `${p.participants} Pax`,
          formatCurrency(p.revenue)
        ]);

        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 14,
          head: [["Nama Paket", "Total Pemesanan", "Total Peserta", "Total Pendapatan"]],
          body: perfRows,
          theme: "striped",
          headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
          styles: { fontSize: 9 },
        });

        doc.save(`Laporan_Pemesanan_Tur_${startDate}_to_${endDate}.pdf`);
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
          <h3 className="text-lg font-bold text-gray-900">Download Laporan Paket Tur</h3>
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
