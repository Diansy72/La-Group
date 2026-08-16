"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/routing";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Prevent redirect loop if already on login page
    if (pathname === "/dashboard/login") {
      setIsAuthed(true);
      return;
    }

    const auth = localStorage.getItem("admin_auth");
    if (!auth) {
      router.replace("/dashboard/login");
    } else {
      setIsAuthed(true);
    }
  }, [router, pathname]);

  if (isAuthed === null) {
    // Loading state while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
