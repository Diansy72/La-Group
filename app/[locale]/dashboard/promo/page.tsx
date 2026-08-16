"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/atoms/input";
import Select from "@/components/atoms/select";
import Pagination from "@/components/molecules/Pagination";
import DashboardLayout from "@/layout/DashboardLayout";
import Button from "@/components/atoms/button";
import { cn } from "@/lib/cn";
import {
  Send,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
import { mockBroadcasts, mockCustomers } from "@/features/dashboard/services/data";
import { EmailBroadcast } from "@/types";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import DetailModal from "@/components/organisms/DetailModal";
import { useTranslations } from "next-intl";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  totalBookings?: number;
}

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PromoNotifContent() {
  const t = useTranslations("Dashboard.promo");
  const commonT = useTranslations("Dashboard.header");
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "id"; // fallback, but we can check actual path or use fallback

  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "customers" ? "customers" : "compose";

  const [broadcasts, setBroadcasts] = useState<EmailBroadcast[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dbCustomers, setDbCustomers] = useState<Customer[]>([]);

  const fetchCustomers = () => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDbCustomers(data);
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/promo/history");
      const data = await res.json();
      if (data.history) {
        setBroadcasts(data.history);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCustomers();
      } else {
        alert("Gagal menghapus data pelanggan.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    }
  };

  const customerFilterOptions = [
    { value: "all", label: t("customers.allCustomers") },
    { value: "active", label: t("customers.activeBooker") },
    { value: "new", label: t("customers.newCustomer") },
  ];

  const historyStatusOptions = [
    { value: "all", label: t("history.allStatus") },
    { value: "sent", label: "Sent" },
    { value: "draft", label: "Draft" },
    { value: "failed", label: "Failed" },
  ];

  // History tab state
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [historyPage, setHistoryPage] = useState(1);

  // Detail & Delete state
  const [detailBroadcast, setDetailBroadcast] = useState<EmailBroadcast | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailBroadcast | null>(null);

  // Customer tab state
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [customerPage, setCustomerPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    return dbCustomers.filter((c) => {
      const cPhone = c.phone || "";
      const matchesSearch =
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        cPhone.toLowerCase().includes(customerSearch.toLowerCase());

      const bookings = c.totalBookings || 0;
      const matchesFilter =
        customerFilter === "all" ||
        (customerFilter === "active" && bookings >= 3) ||
        (customerFilter === "new" && bookings < 3);
      return matchesSearch && matchesFilter;
    });
  }, [dbCustomers, customerSearch, customerFilter]);

  const CUSTOMERS_PER_PAGE = 5;
  const customerTotalPages = Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * CUSTOMERS_PER_PAGE,
    customerPage * CUSTOMERS_PER_PAGE
  );

  // History filtering
  const HISTORY_PER_PAGE = 5;
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      const matchesSearch =
        b.subject.toLowerCase().includes(historySearch.toLowerCase()) ||
        b.body.toLowerCase().includes(historySearch.toLowerCase());
      const matchesStatus =
        historyStatusFilter === "all" || b.status === historyStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [broadcasts, historySearch, historyStatusFilter]);

  const historyTotalPages = Math.ceil(filteredBroadcasts.length / HISTORY_PER_PAGE);
  const paginatedBroadcasts = filteredBroadcasts.slice(
    (historyPage - 1) * HISTORY_PER_PAGE,
    historyPage * HISTORY_PER_PAGE
  );

  const handleSend = () => {
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setIsSending(true);
    try {
      const response = await fetch("/api/promo/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await response.json();

      if (response.ok) {
        setBroadcasts((prev) => [data.broadcast, ...prev]);
        setSubject("");
        setBody("");
        // No need to switch tabs, they are stacked now!
      } else {
        alert(data.error || "Failed to broadcast");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending broadcast");
    } finally {
      setIsSending(false);
      setShowConfirm(false);
    }
  };

  const handleSaveDraft = () => {
    const draft: EmailBroadcast = {
      id: `em-${Date.now()}`,
      subject,
      body,
      recipientCount: 0,
      sentAt: "",
      status: "draft",
    };
    setBroadcasts((prev) => [draft, ...prev]);
    setSubject("");
    setBody("");
  };

  const handleDeleteBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle size={14} className="text-green-500" />;
      case "draft":
        return <FileText size={14} className="text-amber-500" />;
      case "failed":
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const sidebarT = useTranslations("Dashboard.sidebar");

  // Determine page headers dynamically
  const isCustomers = activeTab === "customers";
  const title = isCustomers 
    ? (t("customers.table.title") || "Data Pelanggan") 
    : "Kirim Broadcast";
  const subtitle = isCustomers 
    ? "Lihat database akun pelanggan terdaftar" 
    : "Tulis dan kirim email promo ke pelanggan terdaftar";

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard"), href: "/dashboard" },
        { label: sidebarT("promo") },
      ]}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Compose Tab (showing both Form and History in a stacked view) */}
      {activeTab === "compose" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {t("compose.title")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("compose.recipientInfo", { count: dbCustomers.length })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  {t("compose.subject")}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all"
                  placeholder={t("compose.subjectPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  {t("compose.body")}
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all resize-none"
                  placeholder={t("compose.bodyPlaceholder")}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  variant="blue"
                  icon={<FileText size={16} />}
                  onClick={handleSaveDraft}
                  disabled={!subject && !body}
                >
                  {t("compose.saveDraft")}
                </Button>
                <Button
                  icon={<Send size={16} />}
                  onClick={handleSend}
                  disabled={!subject || !body}
                >
                  {t("compose.sendEmail")}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              {t("tabs.history")}
            </h3>
            {/* History Filters */}
            <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="w-full max-w-sm">
                  <Input
                    hasSearchIcon
                    placeholder={t("history.searchPlaceholder")}
                    value={historySearch}
                    onChange={(e) => {
                      setHistorySearch(e.target.value);
                      setHistoryPage(1);
                    }}
                  />
                </div>
                <div className="w-48">
                  <Select
                    options={historyStatusOptions}
                    value={historyStatusFilter}
                    onChange={(e) => {
                      setHistoryStatusFilter(e.target.value);
                      setHistoryPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-b-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {[
                        t("history.table.subject"),
                        t("history.table.recipients"),
                        t("history.table.status"),
                        t("history.table.sentAt"),
                        t("history.table.action")
                      ].map(
                        (col) => (
                          <th
                            key={col}
                            className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/50"
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBroadcasts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                          {t("history.noData")}
                        </td>
                      </tr>
                    ) : (
                      paginatedBroadcasts.map((broadcast, index) => (
                        <tr
                          key={broadcast.id}
                          className={cn(
                            "border-b border-gray-100 table-row-hover",
                            index % 2 === 1 && "bg-[#FAFBFC]"
                          )}
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-900">
                              {broadcast.subject}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                              {broadcast.body}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {broadcast.recipientCount > 0
                              ? `${broadcast.recipientCount} emails`
                              : "-"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                                broadcast.status === "sent"
                                  ? "bg-green-50 text-green-700"
                                  : broadcast.status === "draft"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                              )}
                            >
                              {statusIcon(broadcast.status)}
                              {broadcast.status.charAt(0).toUpperCase() +
                                broadcast.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {broadcast.createdAt
                              ? new Date(broadcast.createdAt).toLocaleDateString()
                              : broadcast.sentAt
                                ? new Date(broadcast.sentAt).toLocaleDateString()
                                : "-"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setDetailBroadcast(broadcast)}
                                className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(broadcast)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
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
              currentPage={historyPage}
              totalPages={historyTotalPages || 1}
              totalItems={filteredBroadcasts.length}
              itemsPerPage={HISTORY_PER_PAGE}
              onPageChange={setHistoryPage}
            />
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <>
          {/* Search & Filter */}
          <div className="bg-white rounded-t-2xl border border-b-0 border-gray-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-sm">
                <Input
                  hasSearchIcon
                  placeholder={t("customers.searchPlaceholder")}
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setCustomerPage(1);
                  }}
                />
              </div>
              <div className="w-56">
                <Select
                  options={customerFilterOptions}
                  value={customerFilter}
                  onChange={(e) => {
                    setCustomerFilter(e.target.value);
                    setCustomerPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-b-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      t("customers.table.name"),
                      t("customers.table.email"),
                      t("customers.table.totalBookings"),
                      t("customers.table.registered"),
                      "Aksi"
                    ].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/50"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                        {t("customers.noData")}
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={cn(
                          "border-b border-gray-100 table-row-hover",
                          index % 2 === 1 && "bg-[#FAFBFC]"
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {customer.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                          {customer.totalBookings || 0}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Pelanggan"
                          >
                            <Trash2 size={16} />
                          </button>
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
            currentPage={customerPage}
            totalPages={customerTotalPages || 1}
            totalItems={filteredCustomers.length}
            itemsPerPage={CUSTOMERS_PER_PAGE}
            onPageChange={setCustomerPage}
          />
        </>
      )}

      {/* Send Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4 modal-content shadow-xl">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
                <Send size={24} className="text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("confirm.title")}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {t.rich("confirm.message", {
                  count: dbCustomers.length,
                  strong: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">{t("compose.subject")}:</p>
              <p className="text-sm font-medium text-gray-900">
                {subject}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="blue"
                onClick={() => setShowConfirm(false)}
              >
                {t("confirm.cancel")}
              </Button>
              <Button
                icon={<Send size={16} />}
                onClick={confirmSend}
                isLoading={isSending}
              >
                {isSending ? t("confirm.sending") : t("confirm.sendNow")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Detail Modal */}
      <DetailModal
        isOpen={!!detailBroadcast}
        onClose={() => setDetailBroadcast(null)}
        title={t("detail.title")}
        items={detailBroadcast ? [
          { label: t("detail.subject"), value: detailBroadcast.subject },
          { label: t("detail.status"), value: detailBroadcast.status.charAt(0).toUpperCase() + detailBroadcast.status.slice(1) },
          { label: t("detail.recipients"), value: detailBroadcast.recipientCount > 0 ? `${detailBroadcast.recipientCount} emails` : "-" },
          { label: t("detail.sentAt"), value: detailBroadcast.createdAt ? new Date(detailBroadcast.createdAt).toLocaleDateString() : detailBroadcast.sentAt ? new Date(detailBroadcast.sentAt).toLocaleDateString() : "-" },
          { label: t("detail.message"), value: detailBroadcast.body },
        ] : []}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDeleteBroadcast(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title={t("delete.title")}
        message={t("delete.message", { subject: deleteTarget?.subject || "" })}
      />
    </DashboardLayout>
  );
}

export default function PromoNotifManagement() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromoNotifContent />
    </Suspense>
  );
}
