"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation"; 
import { cn } from "@/lib/cn";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
}

export default function DashboardLayout({
  children,
  breadcrumbs,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        currentPath={pathname}
      />

      <Header breadcrumbs={breadcrumbs} isCollapsed={isCollapsed} />

      <main
        className={cn(
          "pt-[var(--header-height)] min-h-screen transition-sidebar",
          isCollapsed
            ? "ml-[var(--sidebar-collapsed-width)]"
            : "ml-[var(--sidebar-width)]"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}