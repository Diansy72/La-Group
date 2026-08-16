"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Button from "@/components/atoms/button";
import { Plus, Download } from "lucide-react";
import { TourPackage, TourBookingHistory } from "@/types";
import DownloadTourReportModal from "@/components/organisms/DownloadTourReportModal";
import { saveTourPackage, deleteTourPackage, getTourBookingHistory, createTourBooking } from "@/features/tourpackages/services/api";
import { useTours } from "@/hooks/useTours";
import TourPackageTable from "@/features/dashboard/TourPackageTable";
import TourPackageForm from "@/features/dashboard/TourPackageForm";
import TabGroup from "@/components/molecules/TabGroup";
import TourBookingHistoryTable from "@/features/dashboard/TourBookingHistoryTable";
import Input from "@/components/atoms/input";
import Pagination from "@/components/molecules/Pagination";
import CreateTourBookingModal from "@/components/organisms/CreateTourBookingModal";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function TourPackagesManagement() {
  const t = useTranslations("Dashboard.tours");
  const commonT = useTranslations("Dashboard.header");
  const searchParams = useSearchParams();
  
  const { 
    allTours: packages, 
    setTours: setPackages, 
    isLoading, 
    refreshTours 
  } = useTours();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "packages");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPackage, setEditPackage] = useState<TourPackage | null>(null);
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);
  const [historyData, setHistoryData] = useState<TourBookingHistory[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const tabs = [
    { id: "packages", label: t("tabs.packages") },
    { id: "booking-history", label: t("tabs.history") },
  ];

  const ITEMS_PER_PAGE = 5;

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const data = await getTourBookingHistory(historyPage, ITEMS_PER_PAGE, searchHistoryQuery);
      if (data.data) {
        setHistoryData(data.data);
        setTotalHistory(data.meta.total);
      }
    } catch (err) {
      console.error("Failed to fetch tour booking history", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "booking-history") {
      fetchHistory();
    }
  }, [activeTab, historyPage, searchHistoryQuery]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTourPackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete tour package:", err);
    }
  };

  const handleSave = async (newPkg: TourPackage) => {
    const isEdit = !!editPackage;
    try {
      const saved = await saveTourPackage(newPkg, isEdit);
      if (isEdit) {
        setPackages((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setPackages((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.error("Failed to save tour package:", err);
    } finally {
      setIsFormOpen(false);
      setEditPackage(null);
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditPackage(pkg);
    setIsFormOpen(true);
  };

  const handleBooking = (pkg: TourPackage) => {
    setBookingPackage(pkg);
  };

  const handleDuplicate = async (pkg: TourPackage) => {
    try {
      const { id, ...rest } = pkg;
      const duplicated: TourPackage = {
        ...rest,
        id: String(Date.now()),
        title: `${pkg.title} (Copy)`,
        titleEn: pkg.titleEn ? `${pkg.titleEn} (Copy)` : undefined,
      };
      const saved = await saveTourPackage(duplicated, false);
      setPackages((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to duplicate tour package:", err);
    }
  };

  const handleBookingSubmit = async (data: {
    customerName: string;
    phone: string;
    date: string;
    time: string;
    vehicleName: string;
    pax: number;
    totalPrice: number;
    notes: string;
  }) => {
    if (bookingPackage) {
      try {
        await createTourBooking({
          tourPackageId: bookingPackage.id,
          customerName: data.customerName,
          phone: data.phone,
          bookingDate: data.date,
          time: data.time,
          vehicleType: data.vehicleName,
          pax: data.pax,
          totalPrice: data.totalPrice,
          notes: data.notes,
        });

        setBookingPackage(null);
        if (activeTab === "booking-history") {
          fetchHistory();
        }
      } catch (err) {
        console.error("Failed to create tour booking:", err);
      }
    }
  };

  const sidebarT = useTranslations("Dashboard.sidebar");

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard"), href: "/dashboard" },
        { label: sidebarT("tourPackages") },
      ]}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("subtitle")}
          </p>
        </div>
        {!isFormOpen && (
          <Button icon={<Plus size={18} />} onClick={() => setIsFormOpen(true)}>
            {t("addTour")}
          </Button>
        )}
      </div>

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setSearchHistoryQuery("");
          setHistoryPage(1);
        }}
        className="mb-6 w-fit"
      />

      {isFormOpen ? (
        <TourPackageForm
          initialData={editPackage || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditPackage(null);
          }}
          onSave={handleSave}
        />
      ) : activeTab === "packages" ? (
        isLoading ? (
          <div className="flex justify-center p-10 bg-white border border-t-0 rounded-b-2xl">
            <p className="text-gray-500">{t("loading")}</p>
          </div>
        ) : (
          <TourPackageTable packages={packages} onEdit={handleEdit} onBooking={handleBooking} onDelete={handleDelete} onDuplicate={handleDuplicate} />
        )
      ) : (
        <>
          <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full max-w-sm">
              <Input
                hasSearchIcon
                placeholder={t("searchPlaceholder")}
                value={searchHistoryQuery}
                onChange={(e) => {
                  setSearchHistoryQuery(e.target.value);
                  setHistoryPage(1);
                }}
              />
            </div>
            <div>
              <button
                onClick={() => setIsDownloadOpen(true)}
                className="bg-[#003B73] hover:bg-[#002A54] text-white p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
          {isHistoryLoading ? (
            <div className="flex justify-center p-10 bg-white border border-t-0 rounded-b-2xl">
              <p className="text-gray-500">{t("loadingHistory")}</p>
            </div>
          ) : (
            <TourBookingHistoryTable data={historyData} />
          )}
          <Pagination
            className="mt-4 px-5"
            currentPage={historyPage}
            totalPages={Math.ceil(totalHistory / ITEMS_PER_PAGE) || 1}
            totalItems={totalHistory}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setHistoryPage}
          />
        </>
      )}

      {bookingPackage && (
        <CreateTourBookingModal
          pkg={bookingPackage}
          onClose={() => setBookingPackage(null)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Download Tour Report Modal */}
      <DownloadTourReportModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </DashboardLayout>
  );
}
