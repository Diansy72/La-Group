"use client";

import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Button from "@/components/atoms/button";
import CustomSelect from "@/components/molecules/CustomSelect";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Bell, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserMenuOpen(false);
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          fetchNotifications();
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/auth/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await fetch("/api/auth/notifications", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: t("home"), href: "/" },
    { name: t("pricelist"), href: "/vehicles-pricelist" },
    { name: t("tours"), href: "/tourpackages" },
    { name: t("about"), href: "/about" },
    { name: t("terms"), href: "/terms" },
    { name: t("contact"), href: "/contact" },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Special case: always show at the top of page
      if (currentScrollY <= 10) {
        setIsVisible(true);
        setIsScrolled(false);
        lastScrollY = currentScrollY;
        return;
      }

      setIsScrolled(currentScrollY > 20);

      // Determine visibility based on scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP
        setIsVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    // Initialize state on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-(--primary)/95 backdrop-blur-md shadow-lg py-4"
          : "bg-transparent py-6",
        !isVisible && "pointer-events-none"
      )}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="px-4 md:px-8 2xl:px-40 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/LOGO LA GROUP 2.png"
            alt="logo"
            width={40}
            height={40}
          />
          <span className="text-lg text-yellow-400 font-semibold">
            L.A Group
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-6 md:gap-12 text-sm text-white font-semibold">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "transition pb-2",
                    isActive
                      ? "border-b-2 border-white"
                      : "hover:text-blue-500"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">
          <CustomSelect
            value={locale}
            onChange={(value) => handleLanguageChange(value)}
            options={[
              { label: "ID", value: "id" },
              { label: "EN", value: "en" },
            ]}
          />

          {isLoading ? (
            <div className="w-[100px] h-10 bg-white/10 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen && notifications.some(n => !n.isRead)) {
                      markNotificationsRead();
                    }
                  }}
                  className="text-white hover:text-yellow-400 transition-colors cursor-pointer relative mt-2"
                >
                  <Bell size={20} />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-blue-900"></span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-sm text-gray-800">
                      Notifications
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setSelectedNotification(n);
                              setNotificationsOpen(false);
                            }}
                            className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <h4 className="font-semibold text-sm text-gray-800 flex items-center justify-between">
                              {n.title}
                              {!n.isRead && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => {
                          setShowAllNotifications(true);
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-blue-900 border-t border-gray-100 transition-colors cursor-pointer"
                      >
                        {locale === "en" ? "See All" : "Lihat Semua"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-[#1a2b4b] font-bold text-lg border-2 border-white/20 shadow-sm cursor-pointer"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-[#1a2b4b] font-bold text-xl flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="border-t border-gray-200 p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <Settings size={16} />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="gold">{t("login")}</Button>
            </Link>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300",
          open
            ? "max-h-96 opacity-100 bg-blue-900/60 backdrop-blur-lg border-b border-white/10"
            : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 flex flex-col items-center gap-4 text-white">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "py-2",
                  isActive && "text-yellow-400"
                )}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="w-full flex flex-col gap-3 mt-4">
            <CustomSelect
              value={locale}
              onChange={(value) => handleLanguageChange(value)}
              options={[
                { label: "ID", value: "id" },
                { label: "EN", value: "en" },
              ]}
            />

            {isLoading ? (
              <div className="w-full h-12 bg-white/10 animate-pulse rounded-xl mt-2" />
            ) : user ? (
              <div className="flex flex-col bg-white/10 rounded-xl mt-2 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-[#1a2b4b] font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-semibold">{user.name}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        if (!notificationsOpen && notifications.some(n => !n.isRead)) {
                          markNotificationsRead();
                        }
                      }}
                      className="text-white hover:text-yellow-400 transition-colors cursor-pointer relative"
                    >
                      <Bell size={20} />
                      {notifications.some(n => !n.isRead) && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-blue-900"></span>
                      )}
                    </button>
                  </div>
                </div>
                {notificationsOpen && (
                  <div className="bg-white/5 border-t border-b border-white/10 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <>
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              setSelectedNotification(n);
                              setNotificationsOpen(false);
                              setOpen(false);
                            }}
                            className="p-4 border-b border-white/10 last:border-0 hover:bg-white/5 cursor-pointer"
                          >
                            <h4 className="font-semibold text-sm text-white flex items-center justify-between">
                              {n.title}
                              {!n.isRead && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                            </h4>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            setShowAllNotifications(true);
                            setNotificationsOpen(false);
                            setOpen(false);
                          }}
                          className="w-full text-center py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-yellow-400 transition-colors cursor-pointer"
                        >
                          {locale === "en" ? "See All" : "Lihat Semua"}
                        </button>
                      </>
                    )}
                  </div>
                )}
                <hr className="border-white/20" />
                <button className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors cursor-pointer w-full">
                  <Settings size={16} />
                  Settings
                </button>
                <hr className="border-white/20" />
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors cursor-pointer w-full">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="gold" type="button" className="w-full">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Detail Notification Modal */}
{selectedNotification && (
  <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm">
    {/* top-20 = 80px, sesuaikan dengan tinggi navbar */}
    <div className="flex justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {selectedNotification.title}
          </h3>

          <button
            onClick={() => setSelectedNotification(null)}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
            {selectedNotification.message}
          </p>

          <span className="text-xs text-gray-400 mt-6 block border-t pt-4">
            {locale === "en" ? "Received on: " : "Diterima pada: "}
            {new Date(selectedNotification.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={() => setSelectedNotification(null)}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
          >
            {locale === "en" ? "Close" : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* See All Notifications Modal */}
{showAllNotifications && (
  <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm">
    <div className="flex justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {locale === "en"
              ? "All Notifications"
              : "Semua Notifikasi"}
          </h3>

          <button
            onClick={() => setShowAllNotifications(false)}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {locale === "en"
                ? "No notifications available"
                : "Tidak ada notifikasi"}
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  // tutup modal daftar dulu
                  setShowAllNotifications(false);

                  // buka modal detail
                  setTimeout(() => {
                    setSelectedNotification(n);
                  }, 100);
                }}
                className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <h4 className="font-semibold text-gray-800 flex items-center justify-between group-hover:text-blue-900 transition-colors">
                  {n.title}

                  {!n.isRead && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </h4>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {n.message}
                </p>

                <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                  <span>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-blue-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {locale === "en"
                      ? "Read more →"
                      : "Selengkapnya →"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={() => setShowAllNotifications(false)}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
          >
            {locale === "en" ? "Close" : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </nav>
  );
}
