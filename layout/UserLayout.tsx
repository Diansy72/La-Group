"use client";

import React from "react";
import { cn } from "@/lib/cn";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)]">
      
      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== CONTENT ===== */}
      <main
        className={cn(
          "flex-1",
          "pt-[var(--navbar-height)]" // kalau navbar fixed
        )}
      >
        <div className="w-full mx-auto ">
          {children}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}