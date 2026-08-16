"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  ClipboardList,
  Globe,
  Map,
  FileText,
  Bell,
  ChevronDown,
  Mail,
} from "lucide-react";

interface NavItemProps {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  hasSubmenu?: boolean;
  hideChevron?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isDropdownOpen?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  ClipboardList: <ClipboardList size={20} />,
  Globe: <Globe size={20} />,
  Map: <Map size={20} />,
  FileText: <FileText size={20} />,
  Bell: <Bell size={20} />,
  Mail: <Mail size={20} />,
};

export default function NavItem({
  label,
  href,
  icon,
  isActive = false,
  isCollapsed = false,
  hasSubmenu = false,
  hideChevron = false,
  onClick,
  isDropdownOpen = false,
}: NavItemProps) {
  const Component = hasSubmenu ? "button" : Link;
  const componentProps = hasSubmenu
    ? { type: "button" as const, onClick }
    : { href };

  return (
    <Component
      {...(componentProps as any)}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-xl mx-3 mb-4 border transition-all duration-200 ease-out group relative text-sm font-medium w-[calc(100%-24px)] text-left cursor-pointer",
        isActive
          ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          : "border-transparent text-slate-300 hover:bg-white/8 hover:text-white",
        isCollapsed && "justify-center px-3"
      )}
    >
      <span className={cn(
        "flex items-center justify-center flex-shrink-0 transition-all duration-200",
        isActive
          ? "w-9 h-9 rounded-lg bg-yellow-500/20 text-yellow-400"
          : "w-9 h-9 text-slate-300 group-hover:scale-110"
      )}>
        {iconMap[icon] || <LayoutDashboard size={20} />}
      </span>

      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>

          {isActive && !hasSubmenu && (
            <span className="w-1.5 h-1.5 rounded-sm bg-yellow-400 flex-shrink-0 ml-2" />
          )}

          {hasSubmenu && !hideChevron && (
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          )}
        </>
      )}

      {isCollapsed && (
        <div
          className={cn(
            "absolute left-full ml-2 px-3 py-1.5 rounded-lg",
            "bg-blue-950 text-white text-xs font-medium whitespace-nowrap",
            "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
            "transition-all duration-200 z-50",
            "shadow-lg"
          )}
        >
          {label}
        </div>
      )}
    </Component>
  );
}