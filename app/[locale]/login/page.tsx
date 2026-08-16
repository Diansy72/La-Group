"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/";
      } else {
        const msg: string = data.error || "Login failed";
        if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("not registered") || msg.toLowerCase().includes("tidak terdaftar")) {
          setErrors(prev => ({ ...prev, email: "Email salah atau tidak terdaftar" }));
        } else if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("wrong") || msg.toLowerCase().includes("salah")) {
          setErrors(prev => ({ ...prev, password: "Password yang Anda masukkan salah" }));
        } else {
          setErrors(prev => ({ ...prev, general: msg }));
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors(prev => ({ ...prev, general: "Terjadi kesalahan sistem saat login." }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });
    setForgotSuccess(false);

    try {
      // Detect locale from pathname or default
      const locale = window.location.pathname.startsWith("/en") ? "en" : "id";
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, locale }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSuccess(true);
        setEmail("");
        setUsername("");
      } else {
        setErrors(prev => ({ ...prev, general: data.error || "Gagal memproses lupa password" }));
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrors(prev => ({ ...prev, general: "Terjadi kesalahan sistem saat meminta reset password." }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#1a2b4b] mb-2">
              {showForgotPassword ? t("forgotPasswordTitle") : t("title")}
            </h1>
            <p className="text-gray-500">
              {showForgotPassword ? t("forgotPasswordDesc") : t("description")}
            </p>
          </div>

          {showForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
                  {errors.general}
                </div>
              )}

              {forgotSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium text-center border border-green-100">
                  {t("forgotSuccess")}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1a2b4b] mb-2">
                  {t("usernameLabel")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors(prev => ({ ...prev, general: "" })); }}
                  placeholder={t("usernamePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a2b4b] mb-2">
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, general: "" })); }}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-yellow-500/20",
                  "bg-[#f9c51a] text-[#1a2b4b] hover:bg-[#eab308] active:scale-[0.98]",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? t("loggingIn") : t("forgotSubmit")}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrors({ email: "", password: "", general: "" });
                  setForgotSuccess(false);
                  setEmail("");
                  setUsername("");
                }}
                className="w-full py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-medium text-[#1a2b4b] hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                <ArrowLeft size={16} />
                {t("backToLogin")}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
                  {errors.general}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#1a2b4b] mb-2">
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
                  placeholder={t("emailPlaceholder")}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm",
                    errors.email
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                  )}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1a2b4b] mb-2">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
                    placeholder={t("passwordPlaceholder")}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm pr-12",
                      errors.password
                        ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                    )}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-600 group-hover:text-[#1a2b4b]">{t("rememberMe")}</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setErrors({ email: "", password: "", general: "" });
                    setEmail("");
                  }}
                  className="text-blue-600 font-medium hover:underline cursor-pointer"
                >
                  {t("forgotPassword")}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg shadow-yellow-500/20",
                  "bg-[#f9c51a] text-[#1a2b4b] hover:bg-[#eab308] active:scale-[0.98]",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? t("loggingIn") : t("submit")}
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                {/* <span className="relative px-4 bg-white text-gray-400 text-xs font-medium">{t("or")}</span> */}
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                {t("noAccount")}{" "}
                <Link href="/register" className="text-yellow-500 font-bold hover:underline">
                  {t("register")}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right Side: Illustration */}
      <div className="hidden md:flex w-1/2 bg-[#002b5b] items-center justify-center p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-900/40 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-lg">
          {/* Illustration Mockup based on the image */}
          <div className="relative flex flex-col items-center">
            {/* Main Center Card */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-xs transform -translate-y-4">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-2 w-3/4 bg-gray-100 rounded" />
                  <div className="h-2 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-8 flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-5/6 bg-gray-100 rounded" />
              </div>
            </div>

            {/* Top Right Card */}
            <div className="absolute -top-12 -right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-48 shadow-xl">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="space-y-1.5 w-full">
                  <div className="h-1.5 w-full bg-white/30 rounded" />
                  <div className="h-1.5 w-2/3 bg-white/30 rounded" />
                </div>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute top-12 -right-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 w-48 shadow-xl">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="space-y-1.5 w-full">
                  <div className="h-1.5 w-full bg-white/30 rounded" />
                  <div className="h-1.5 w-2/3 bg-white/30 rounded" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Progress Bar Item */}
            <div className="absolute -bottom-16 left-0 bg-white rounded-xl p-4 w-64 shadow-2xl flex items-center gap-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-blue-600 rounded-full" />
              </div>
              <div className="w-10 h-6 bg-blue-600 rounded-lg" />
            </div>

            {/* Person Illustrations (Conceptual) */}
            <div className="absolute -left-20 top-0 w-32 h-48 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-pink-400 mb-2 mt-4" />
               <div className="h-2 w-12 bg-white/20 rounded mt-auto mb-4" />
            </div>
            
            <div className="absolute -right-32 top-1/2 w-32 h-48 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-orange-400 mb-2 mt-4" />
               <div className="h-2 w-12 bg-white/20 rounded mt-auto mb-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
