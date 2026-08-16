"use client";

import React, { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Input from "@/components/atoms/input";
import Select from "@/components/atoms/select";
import Badge from "@/components/atoms/badge";
import Pagination from "@/components/molecules/Pagination";
import DetailModal from "@/components/organisms/DetailModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { Eye, Pencil, Trash2, Copy } from "lucide-react";
import { TourPackage } from "@/types";
import { formatCurrency } from "@/features/dashboard/services/data";
import { cn } from "@/lib/cn";

interface TourPackageTableProps {
  packages: TourPackage[];
  onEdit: (pkg: TourPackage) => void;
  onBooking: (pkg: TourPackage) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (pkg: TourPackage) => void;
}

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

const ITEMS_PER_PAGE = 5;

export default function TourPackageTable({ packages, onEdit, onBooking, onDelete, onDuplicate }: TourPackageTableProps) {
  const t = useTranslations("Dashboard.tourTable");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailPkg, setDetailPkg] = useState<TourPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TourPackage | null>(null);

  const statusOptions = [
    { value: "all", label: t("statusAll") || "Semua Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
  ];

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.titleEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.category || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || pkg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [packages, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full max-w-sm">
            <Input
              hasSearchIcon
              placeholder={t("searchPlaceholder") || "Cari paket tour..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Existing Packages Table */}
      <div className="bg-white rounded-b-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                {["No", t("name"), t("category"), t("priceType"), t("price"), t("vehicles"), t("status"), t("action")].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedPackages.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    {t("noPackages")}
                  </td>
                </tr>
              ) : (
                paginatedPackages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors border-b border-gray-200 last:border-0",
                      index % 2 === 1 && "bg-[#FAFBFC]"
                    )}
                  >
                    <td className="px-5 py-4 text-sm font-medium text-[#64748B]">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#1E293B]">
                      <div className="flex items-center gap-2">
                        {locale === "en" && pkg.titleEn ? pkg.titleEn : pkg.title}
                        {pkg.recommendation && pkg.recommendation !== "None" && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
                            {pkg.recommendation}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        {pkg.category || "Group"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        {pkg.priceType === "per_person" ? t("perPerson") : t("perCar")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#1E293B]">
                      {formatCurrency(pkg.estimatedPrice)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#1E293B]">
                      {pkg.vehicleOptions?.length || 0}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        status={pkg.status === "active" ? "available" : "service"}
                        label={pkg.status === "active" ? "Active" : "Draft"}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onBooking(pkg)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Create Booking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </button>
                        <button
                          onClick={() => setDetailPkg(pkg)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                          title="View Detail"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => onEdit(pkg)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit Package"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDuplicate?.(pkg)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          title="Duplicate Package"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(pkg)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Package"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        className="mt-4 px-5"
        currentPage={currentPage}
        totalPages={totalPages || 1}
        totalItems={filteredPackages.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!detailPkg}
        onClose={() => setDetailPkg(null)}
        title="Tour Package Detail"
        items={detailPkg ? [
          { label: "ID", value: detailPkg.id },
          { label: "Package Name", value: locale === "en" && detailPkg.titleEn ? detailPkg.titleEn : detailPkg.title },
          { label: "Category", value: detailPkg.category || "-" },
          { label: "Recommendation", value: detailPkg.recommendation && detailPkg.recommendation !== "None" ? detailPkg.recommendation : "-" },
          { label: "Price Type", value: detailPkg.priceType === "per_person" ? "Per Person" : "Per Car" },
          { label: "Duration", value: detailPkg.duration },
          { label: "Starting Price", value: formatCurrency(detailPkg.estimatedPrice) },
          { label: "Description", value: detailPkg.description },
          { label: "Destinations", value: detailPkg.destinationTags?.join(", ") || "-" },
          { label: "Includes", value: detailPkg.includes?.join(", ") || "-" },
          { label: "Excludes", value: detailPkg.excludes?.join(", ") || "-" },
          { label: "Vehicle Options", value: `${detailPkg.vehicleOptions?.length || 0} options` },
        ] : []}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Hapus Tour Package"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </>
  );
}
