"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import NavItem from "@/components/molecules/NavItem";
import { sidebarNavItems } from "@/features/dashboard/services/data";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { useSearchParams } from "next/navigation";
import {
  Send,
  Users,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPath: string;
}

export default function Sidebar({
  isCollapsed,
  onToggle,
  currentPath,
}: SidebarProps) {
  const t = useTranslations("Dashboard.sidebar");
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const getLabelKey = (label: string) => {
    switch (label) {
      case "Dashboard": return "dashboard";
      case "Pricelist": return "pricelist";
      case "Tour Packages": return "tourPackages";
      case "Testimonials & Gallery": return "testimonialsGallery";
      case "Promo & Pelanggan": return "promo";
      case "Contact": return "contact";
      case "Kirim Broadcast": return "sendBroadcast";
      case "Data Pelanggan": return "customerData";
      case "Galeri Wisatawan": return "touristGallery";
      case "Ulasan Google": return "googleReviews";
      default: return label.toLowerCase();
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-(--primary)/95 z-40",
        "flex flex-col transition-sidebar",
        isCollapsed
          ? "w-[var(--sidebar-collapsed-width)]"
          : "w-[var(--sidebar-width)]"
      )}
    >
      {/* Logo Area */}
      <div
        className={cn(
          "border-b border-white/10 py-4",
          isCollapsed ? "px-3" : "px-5"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <Image
            src="/images/LOGO LA GROUP 2.png"
            alt="logo"
            width={40}
            height={40}
            className="flex-shrink-0"
          />

          {!isCollapsed && (
            <span className="text-lg text-yellow-400 font-semibold truncate">
              L.A Group
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarNavItems.map((item) => {
          const normalizedPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, "/");
          
          // Parent active check: match base path
          const isParentActive =
            normalizedPath === item.href ||
            (item.href !== "/dashboard" &&
              normalizedPath.startsWith(item.href));

          // Child active check: match base path and query parameter tab
          const isChildActive = item.children?.some((child) => {
            const childNormalized = child.href.split("?")[0];
            const childTab = new URL(child.href, "http://localhost").searchParams.get("tab");
            return normalizedPath === childNormalized && tab === childTab;
          });

          const isActive = isParentActive || isChildActive;
          const hasChildren = !!item.children && item.children.length > 0;
          const isDropdownOpen = !!openDropdowns[item.label];

          // Auto-open dropdown on mount/route change if a child is active
          React.useEffect(() => {
            if (isChildActive) {
              setOpenDropdowns((prev) => ({ ...prev, [item.label]: true }));
            }
          }, [isChildActive]);

          return (
            <React.Fragment key={item.label}>
              <NavItem
                label={t(getLabelKey(item.label))}
                href={item.href}
                icon={item.icon}
                isActive={isActive}
                isCollapsed={isCollapsed}
                hasSubmenu={item.hasSubmenu}
                isDropdownOpen={isDropdownOpen}
                onClick={hasChildren ? () => toggleDropdown(item.label) : undefined}
              />
              <AnimatePresence initial={false}>
                {hasChildren && isDropdownOpen && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col gap-1 mb-4 pl-12 pr-4 overflow-hidden"
                  >
                    {item.children?.map((child) => {
                      const childNormalized = child.href.split("?")[0];
                      const childTab = new URL(child.href, "http://localhost").searchParams.get("tab");
                      const isSubActive = normalizedPath === childNormalized && tab === childTab;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 border",
                            isSubActive
                              ? "bg-yellow-500/15 border-yellow-500/20 text-yellow-400"
                              : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.label === "Kirim Broadcast" && <Send size={12} />}
                          {child.label === "Data Pelanggan" && <Users size={12} />}
                          {child.label === "Galeri Wisatawan" && <ImageIcon size={12} />}
                          {child.label === "Ulasan Google" && <Star size={12} />}
                          <span>{t(getLabelKey(child.label))}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/10 p-3 flex justify-center">
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl",
            "text-slate-300 hover:bg-white/8 hover:text-white",
            "transition-all duration-200 text-sm font-medium cursor-pointer",
            "justify-center w-fit",
            isCollapsed && "px-3"
          )}
        >
          {isCollapsed ? (
            <ChevronsRight size={20} />
          ) : (
            <>
              <ChevronsLeft size={20} />
              <span>{t("collapse")}</span>
            </>
          )}
        </button>
      </div>

      {/* Version */}
      {!isCollapsed && (
        <div className="px-5 pb-4">
          <p className="text-slate-300 text-xs opacity-50 text-center">
            LA Group v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
