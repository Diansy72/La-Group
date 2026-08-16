"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import Select from "@/components/atoms/select";
import TabGroup from "@/components/molecules/TabGroup";
import Pagination from "@/components/molecules/Pagination";
import VehicleTable from "@/features/dashboard/VehicleTable";
import VehicleTypeModal from "@/features/dashboard/VehicleTypeModal";
import DetailModal from "@/components/organisms/DetailModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import CreateBookingModal from "@/components/organisms/CreateBookingModal";
import AddVehicleForm from "@/components/organisms/AddVehicleForm";
import BookingHistoryTable from "@/components/organisms/BookingHistoryTable";
import { Plus, Download } from "lucide-react";
import DownloadReportModal from "@/components/organisms/DownloadReportModal";
import { formatCurrency } from "@/features/dashboard/services/data";
import { Vehicle, BookingHistory } from "@/types";
import { 
  getVehicles, 
  deleteVehicle, 
  saveVehicle, 
  getBookingHistory, 
  createBooking,
  cancelBooking
} from "@/features/vehicles-pricelist/services/api";
import { useVehicles } from "@/hooks/useVehicles";
import Badge from "@/components/atoms/badge";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const ITEMS_PER_PAGE = 5;

export default function PricelistPage() {
  const t = useTranslations("Dashboard.pricelist");
  const commonT = useTranslations("Dashboard.header");
  const searchParams = useSearchParams();

  const { 
    vehicles: filteredVehicles, 
    allVehicles: vehicles,
    setVehicles, 
    refreshVehicles, 
    isLoading,
    search: searchHook,
    setSearch: setSearchHook
  } = useVehicles();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "vehicles");

  const tabs = [
    { id: "vehicles", label: t("tabs.vehicles") },
    { id: "booking-history", label: t("tabs.history") },
  ];

  const statusOptions = [
    { value: "all", label: t("filters.status.all") },
    { value: "available", label: t("filters.status.available") },
    { value: "rented", label: t("filters.status.booked") },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingVehicleType, setAddingVehicleType] = useState<"motorcycle" | "car" | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [bookingHistoryData, setBookingHistoryData] = useState<BookingHistory[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);

  // Sync searchQuery with hook search for the vehicles tab
  useEffect(() => {
    if (activeTab === "vehicles") {
      setSearchHook(searchQuery);
    }
  }, [searchQuery, activeTab, setSearchHook]);

  // Fetch Booking History
  useEffect(() => {
    if (activeTab === "booking-history") {
      setIsHistoryLoading(true);
      getBookingHistory(currentPage, ITEMS_PER_PAGE, searchQuery)
        .then((res) => {
          setBookingHistoryData(res.data || []);
          setHistoryTotalItems(res.meta?.total || 0);
          setIsHistoryLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch booking history:", err);
          setIsHistoryLoading(false);
        });
    }
  }, [activeTab, currentPage, searchQuery]);

  // Detail modal
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  // Cancel Booking confirm
  const [cancelTarget, setCancelTarget] = useState<Vehicle | null>(null);

  // Booking modal
  const [bookingTarget, setBookingTarget] = useState<Vehicle | null>(null);

  const finalFilteredVehicles = useMemo(() => {
    return filteredVehicles.filter((vehicle) => {
      const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
      return matchesStatus;
    });
  }, [filteredVehicles, statusFilter]);

  const totalPages = Math.ceil(
    (activeTab === "vehicles" ? finalFilteredVehicles.length : historyTotalItems) / ITEMS_PER_PAGE
  );

  const paginatedVehicles = finalFilteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = (vehicle: Vehicle) => {
    setDeleteTarget(vehicle);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteVehicle(deleteTarget.id);
        setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
      }
      setDeleteTarget(null);
    }
  };

  const confirmCancelBooking = async () => {
    if (cancelTarget) {
      try {
        const updated = await cancelBooking(cancelTarget.id);
        // Sinkronisasi local state: semua unit ber-plat sama → available
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === updated.id
              ? updated
              : v.licensePlate === updated.licensePlate
              ? { ...v, status: "available" }
              : v
          )
        );
        // Refresh booking history table if we are currently on the history tab
        if (activeTab === "booking-history") {
          getBookingHistory(currentPage, ITEMS_PER_PAGE, searchQuery)
            .then((res) => {
              setBookingHistoryData(res.data || []);
              setHistoryTotalItems(res.meta?.total || 0);
            })
            .catch((err) => console.error("Failed to refresh history:", err));
        }
      } catch (error) {
        console.error("Failed to cancel booking:", error);
      }
      setCancelTarget(null);
    }
  };

  const handleDuplicate = async (vehicle: Vehicle) => {
    try {
      const { id, ...rest } = vehicle;
      const duplicated: Vehicle = {
        ...rest,
        id: String(Date.now()),
        name: `${vehicle.name} (Copy)`,
        status: "available",
      };
      const saved = await saveVehicle(duplicated, false);
      setVehicles((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to duplicate vehicle:", err);
    }
  };

  const handleBooking = async (
    vehicleId: string,
    bookingData: {
      customerName: string;
      phone: string;
      startDate: string;
      endDate: string;
      notes: string;
      time: string;
      packageId?: string;
      basePrice?: number;
      finalPrice?: number;
    }
  ) => {
    const bookedVehicle = finalFilteredVehicles.find((v) => v.id === vehicleId);
    if (!bookedVehicle) return;

    try {
      // Update DB to rented
      const updated = await saveVehicle({ ...bookedVehicle, status: "rented" }, true);
      // Sinkronisasi local state: semua unit ber-plat sama → rented
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === updated.id
            ? updated
            : v.licensePlate === updated.licensePlate
            ? { ...v, status: "rented" }
            : v
        )
      );
      
      let calculatedDuration = "Full Day";
      if (bookedVehicle.type === "car") {
        const pkg = bookedVehicle.packages?.find((p) => p.id === bookingData.packageId);
        if (pkg) {
          calculatedDuration = pkg.duration === "half_day" ? "Half Day" : "Full Day";
        }
      } else {
        calculatedDuration = bookedVehicle.rentalDuration === "Half Day" ? "Half Day" : "Full Day";
      }

      // Save to database with package pricing
      const newBooking = await createBooking({
        vehicleId: vehicleId,
        customer: bookingData.customerName,
        phone: bookingData.phone || "-",
        bookingDate: bookingData.startDate,
        time: bookingData.time || "08:00",
        duration: calculatedDuration,
        notes: bookingData.notes || "-",
        status: "BOOKED",
        packageId: bookingData.packageId,
        basePrice: bookingData.basePrice,
        finalPrice: bookingData.finalPrice,
      });

      // Update history state if we are currently on the history tab
      if (activeTab === "booking-history" && currentPage === 1) {
        setBookingHistoryData((prev) => [newBooking, ...prev].slice(0, ITEMS_PER_PAGE));
        setHistoryTotalItems((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to process booking:", err);
    }
  };

  const sidebarT = useTranslations("Dashboard.sidebar");

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard"), href: "/dashboard" },
        { label: sidebarT("pricelist") },
      ]}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("subtitle", { count: vehicles.length })}
          </p>
        </div>
        <Button
          icon={<Plus size={18} />}
          onClick={() => setIsModalOpen(true)}
        >
          {t("addVehicle")}
        </Button>
      </div>

      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setCurrentPage(1);
          setSearchQuery("");
        }}
        className="mb-6 w-fit"
      />

      {addingVehicleType || editVehicle ? (
        <AddVehicleForm
          type={addingVehicleType || undefined}
          initialData={editVehicle || undefined}
          nextId={String(Date.now())}
          onClose={() => {
            setAddingVehicleType(null);
            setEditVehicle(null);
          }}
          onSave={async (newVehicle) => {
            try {
              const saved = await saveVehicle(newVehicle, !!editVehicle);
              if (editVehicle) {
                setVehicles((prev) => prev.map((v) => (v.id === saved.id ? saved : v)));
              } else {
                setVehicles((prev) => [saved, ...prev]);
              }
              setAddingVehicleType(null);
              setEditVehicle(null);
            } catch (err) {
              console.error("Failed to save vehicle:", err);
            }
          }}
        />
      ) : (
        <>
          {activeTab === "vehicles" ? (
            <>
              {/* Filters */}
              <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-full max-sm:max-w-sm">
                    <Input
                      hasSearchIcon
                      placeholder={t("filters.searchPlaceholder")}
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

              {/* Table */}
              {isLoading ? (
                <div className="flex justify-center p-10 bg-white border border-t-0 rounded-b-2xl">
                  <p className="text-gray-500">{t("loading")}</p>
                </div>
              ) : (
                <VehicleTable
                  vehicles={paginatedVehicles}
                  startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
                  onView={(v) => setDetailVehicle(v)}
                  onEdit={(v) => setEditVehicle(v)}
                  onDelete={(v) => handleDelete(v)}
                  onBooking={(v) => setBookingTarget(v)}
                  onCancelBooking={(v) => setCancelTarget(v)}
                  onDuplicate={(v) => handleDuplicate(v)}
                />
              )}
            </>
          ) : (
            <>
              {/* Booking History Filters (only search) */}
              <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-full max-w-sm">
                  <Input
                    hasSearchIcon
                    placeholder={t("filters.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
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

              {/* Booking History Table */}
              {isHistoryLoading ? (
                <div className="flex justify-center p-10 bg-white border border-t-0 rounded-b-2xl">
                  <p className="text-gray-500">{t("loadingHistory")}</p>
                </div>
              ) : (
                <BookingHistoryTable data={bookingHistoryData} />
              )}
            </>
          )}

          <Pagination
            className="mt-4 px-5"
            currentPage={currentPage}
            totalPages={totalPages || 1}
            totalItems={activeTab === "vehicles" ? filteredVehicles.length : historyTotalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </>
      )}



      {/* Vehicle Type Modal */}
      <VehicleTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(type) => {
          setAddingVehicleType(type as "motorcycle" | "car");
          setIsModalOpen(false);
        }}
      />

      {/* Vehicle Detail Modal */}
      <DetailModal
        isOpen={!!detailVehicle}
        onClose={() => setDetailVehicle(null)}
        title={t("detail.title")}
        items={detailVehicle ? [
          { label: t("detail.id"), value: String(detailVehicle.id) },
          { label: t("detail.name"), value: detailVehicle.name },
          { label: t("detail.type"), value: detailVehicle.type === "car" ? t("detail.car") : t("detail.motorcycle") },
          { label: t("detail.plateNumber"), value: detailVehicle.licensePlate },
          ...(detailVehicle.type === "motorcycle" ? [
            { label: t("detail.pricePerDay"), value: detailVehicle.pricePerDay ? formatCurrency(detailVehicle.pricePerDay) : "-" },
            { label: t("detail.rentalDuration"), value: detailVehicle.rentalDuration === "Full Day" ? t("detail.fullDay") : detailVehicle.rentalDuration === "Half Day" ? t("detail.halfDay") : detailVehicle.rentalDuration || "-" },
            { label: t("detail.typeDrive"), value: detailVehicle.selfDrive ? t("detail.selfDrive") : (detailVehicle.selfDrive === false ? t("detail.withDriver") : "-") },
            { label: t("detail.bbm"), value: detailVehicle.withFuel ? t("detail.withFuel") : t("detail.withoutFuel") },
          ] : []),
          { label: t("detail.maxSpeed"), value: detailVehicle.maxSpeed ? `${detailVehicle.maxSpeed} Km/H` : "-" },
          { label: t("detail.seatCapacity"), value: detailVehicle.seatCapacity ? String(detailVehicle.seatCapacity) : "-" },
          { label: t("detail.chargerPhone"), value: detailVehicle.hasPhoneCharger ? t("detail.yes") : t("detail.no") },
          ...(detailVehicle.type === "car" ? [
            {
              label: "Rental Packages",
              value: detailVehicle.packages && detailVehicle.packages.length > 0 ? (
                <div className="flex flex-col gap-1 text-xs">
                  {detailVehicle.packages.map((pkg, idx) => {
                    const durationLabel = pkg.duration === "full_day" ? "Full Day" : "Half Day";
                    const driverLabel = pkg.driverType === "self_drive" ? "Self Drive" : "With Driver";
                    const fuelLabel = pkg.fuelOption === "with_fuel" ? "BBM" : "No BBM";
                    return (
                      <div key={idx} className="font-semibold text-gray-700">
                        {durationLabel} + {driverLabel} + {fuelLabel}: <span className="text-blue-900">{formatCurrency(pkg.price)}</span>
                      </div>
                    );
                  })}
                </div>
              ) : "No packages active"
            }
          ] : []),
          { label: t("detail.features"), value: detailVehicle.features && detailVehicle.features.length > 0 ? detailVehicle.features.join(", ") : "-" },
          { label: t("detail.status"), value: <Badge status={detailVehicle.status === "rented" ? "booked" : detailVehicle.status} /> },
          { label: t("detail.createdAt"), value: detailVehicle.createdAt },
        ] : []}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={t("delete.title")}
        message={t("delete.message", { name: deleteTarget?.name || "", plate: deleteTarget?.licensePlate || "" })}
      />

      {/* Cancel Booking Confirmation */}
      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancelBooking}
        title={t("cancelBooking.title")}
        message={t("cancelBooking.message", { name: cancelTarget?.name || "", plate: cancelTarget?.licensePlate || "" })}
      />

      {/* Create Booking Modal */}
      <CreateBookingModal
        isOpen={!!bookingTarget}
        onClose={() => setBookingTarget(null)}
        vehicle={bookingTarget}
        onSubmit={(vehicleId, bookingData) => {
          handleBooking(vehicleId, bookingData);
          setBookingTarget(null);
        }}
      />

      {/* Download Report Modal */}
      <DownloadReportModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </DashboardLayout>
  );
}
