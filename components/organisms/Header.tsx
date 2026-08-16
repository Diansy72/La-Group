"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";
import { ChevronRight, LogOut, User, Mail, ShieldCheck } from "lucide-react";
import SearchBar from "@/components/molecules/SearchBar";
import Avatar from "@/components/atoms/avatar";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import CustomSelect from "@/components/molecules/CustomSelect";

interface HeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  isCollapsed: boolean;
}

export default function Header({ breadcrumbs, isCollapsed }: HeaderProps) {
  const t = useTranslations("Dashboard.header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      try {
        await fetch("/api/auth/admin-logout", { method: "POST" });
      } catch {}
      localStorage.removeItem("admin_auth");
      router.replace("/dashboard/login");
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-[var(--header-height)] bg-white z-30",
        "flex items-center justify-between px-6 gap-4",
        "border-b border-gray-200",
        "transition-sidebar",
        isCollapsed
          ? "left-[var(--sidebar-collapsed-width)]"
          : "left-[var(--sidebar-width)]"
      )}
    >
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="text-gray-400"
                />
              )}
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500"
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Notification + User */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="hidden md:block w-20">
          <CustomSelect
            value={locale}
            onChange={(value) => handleLanguageChange(value)}
            options={[
              { label: "ID", value: "id" },
              { label: "EN", value: "en" },
            ]}
          />
        </div>

        <div className="w-px h-8 bg-gray-200 hidden md:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Avatar name="Admin" size="md" />
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                {t("greeting")}
              </p>
              <p className="text-xs text-gray-500">{t("welcome")}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Avatar name="Admin" size="lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500 truncate">admin@lagroupandika.com</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <div className="px-4 py-2.5 flex items-center gap-3 text-sm text-gray-500">
                  <User size={16} />
                  <span>{t("superAdmin")}</span>
                </div>
                <div className="px-4 py-2.5 flex items-center gap-3 text-sm text-gray-500">
                  <Mail size={16} />
                  <span className="truncate">admin@lagroupandika.com</span>
                </div>
                <div className="px-4 py-2.5 flex items-center gap-3 text-sm text-gray-500">
                  <ShieldCheck size={16} />
                  <span>{t("roleAdmin")}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  {t("logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
