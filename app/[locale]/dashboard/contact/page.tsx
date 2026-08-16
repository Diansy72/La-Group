"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import { cn } from "@/lib/cn";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  AlertCircle,
  Info,
  Trash2,
  CheckCircle,
  Eye,
  Clock,
} from "lucide-react";
import { ContactMessage } from "@/types";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { useTranslations } from "next-intl";

export default function ContactManagementPage() {
  const t = useTranslations("Dashboard.contact");
  const commonT = useTranslations("Dashboard.header");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [autoDeleteDays, setAutoDeleteDays] = useState<number>(0);

  const SUBJECT_FILTERS = [
    { id: "All", label: t("all") },
    { id: "Booking", label: t("booking") },
    { id: "Complaint", label: t("complaint") },
    { id: "Information", label: t("information") },
  ];

  useEffect(() => {
    const init = async () => {
      const saved = localStorage.getItem("contact_auto_delete");
      if (saved) {
        const days = Number(saved);
        setAutoDeleteDays(days);
        if (days > 0) {
          try {
            await fetch(`/api/contact/cleanup?days=${days}`, { method: "DELETE" });
          } catch (e) {
            console.error("Cleanup failed", e);
          }
        }
      }
      fetchMessages();
    };
    init();
  }, []);

  const handleAutoDeleteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setAutoDeleteDays(val);
    localStorage.setItem("contact_auto_delete", String(val));
    
    if (val > 0) {
      setIsLoading(true);
      try {
        await fetch(`/api/contact/cleanup?days=${val}`, { method: "DELETE" });
        await fetchMessages();
      } catch (e) {
        console.error("Cleanup failed", e);
        setIsLoading(false);
      }
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = useMemo(() => {
    if (activeFilter === "All") return messages;
    return messages.filter(
      (m) => m.subject.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [messages, activeFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: status as "unread" | "read" | "replied" } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => prev ? { ...prev, status: status as "unread" | "read" | "replied" } : null);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "booking":
        return <Calendar size={16} className="text-blue-500" />;
      case "complaint":
        return <AlertCircle size={16} className="text-red-500" />;
      case "information":
        return <Info size={16} className="text-emerald-500" />;
      default:
        return <MessageSquare size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "unread":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
            {t("unread")}
          </span>
        );
      case "read":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
            {t("read")}
          </span>
        );
      case "replied":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
            {t("replied")}
          </span>
        );
      default:
        return null;
    }
  };

  const getTranslatedSubject = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "booking": return t("booking");
      case "complaint": return t("complaint");
      case "information": return t("information");
      default: return subject;
    }
  };

  const sidebarT = useTranslations("Dashboard.sidebar");

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: sidebarT("dashboard"), href: "/dashboard" },
        { label: sidebarT("contact") },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
        {/* Left Side: List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Header & Search */}
          <div className="p-4 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900 mb-4">{t("title")}</h1>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {SUBJECT_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    activeFilter === f.id
                      ? "bg-blue-900 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                <Clock className="mx-auto mb-2 animate-spin" size={24} />
                {t("loading")}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                {t("noMessages")}
              </div>
            ) : (
              filteredMessages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMessage(m);
                    if (m.status === "unread") updateStatus(m.id, "read");
                  }}
                  className={cn(
                    "w-full p-4 text-left border-b border-gray-50 transition-all hover:bg-blue-50/50",
                    selectedMessage?.id === m.id ? "bg-blue-50 border-l-4 border-l-blue-900" : "",
                    m.status === "unread" ? "font-bold" : ""
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getSubjectIcon(m.subject)}
                      <span className="text-xs uppercase tracking-wider text-gray-400">
                        {getTranslatedSubject(m.subject)}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-900 truncate mb-1">{m.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{m.message}</p>
                </button>
              ))
            )}
          </div>

          {/* Auto Delete Box (Bottom Left) */}
          <div className="p-6.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">{t("autoDelete")}</span>
              <span className="text-[10px] text-gray-500">Pembersihan pesan otomatis</span>
            </div>
            <select 
              value={autoDeleteDays}
              onChange={handleAutoDeleteChange}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition-all hover:border-blue-400"
            >
              <option value={0}>{t("never")}</option>
              <option value={3}>{t("days", { count: 3 })}</option>
              <option value={7}>{t("days", { count: 7 })}</option>
              <option value={30}>{t("days", { count: 30 })}</option>
            </select>
          </div>
        </div>

        {/* Right Side: Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(selectedMessage.status)}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      {getSubjectIcon(selectedMessage.subject)}
                      <span className="font-bold uppercase tracking-widest">{getTranslatedSubject(selectedMessage.subject)}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(selectedMessage.id, "replied")}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                    title={t("markAsReplied")}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(selectedMessage.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    title={t("deleteMessage")}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">{t("emailAddress")}</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-blue-900 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">{t("phoneNumber")}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedMessage.phone || t("notProvided")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400 mb-4 tracking-widest">{t("messageContent")}</h4>
                  <div className="bg-white border border-gray-100 rounded-xl p-5 text-gray-700 whitespace-pre-wrap leading-relaxed shadow-sm">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {t("receivedOn", { date: new Date(selectedMessage.createdAt).toLocaleString() })}
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject} inquiry`}
                    className="px-6 py-2 bg-blue-900 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-all shadow-md shadow-blue-900/10 flex items-center gap-2"
                  >
                    <Mail size={16} /> {t("replyViaEmail")}
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Eye size={40} className="text-gray-200" />
              </div>
              <p className="text-lg font-semibold">{t("selectMessage")}</p>
              <p className="text-sm max-w-[240px] text-center mt-1">
                {t("selectMessageDesc")}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteMessage(deleteConfirm)}
        title={t("deleteConfirmTitle")}
        message={t("deleteConfirmMessage")}
      />
    </DashboardLayout>
  );
}
