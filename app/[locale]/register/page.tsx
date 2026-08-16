"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Eye, EyeOff, MapPin, Navigation, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("Register");
  const commonT = useTranslations("Login"); // For 'or' and 'google'

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [globalError, setGlobalError] = useState("");
  const [isCheckingName, setIsCheckingName] = useState(false);

  // Real-time username availability check
  useEffect(() => {
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: "" }));
      return;
    }

    setIsCheckingName(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?name=${encodeURIComponent(formData.fullName.trim())}`);
        const data = await res.json();
        if (!data.available) {
          setErrors(prev => ({ ...prev, name: "Username sudah digunakan" }));
        } else {
          setErrors(prev => ({ ...prev, name: "" }));
        }
      } catch {
        // ignore
      } finally {
        setIsCheckingName(false);
      }
    }, 700);

    return () => {
      clearTimeout(timeoutId);
      setIsCheckingName(false);
    };
  }, [formData.fullName]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrors(prev => {
        let newErrors = { ...prev };
        let changed = false;

        // Realtime email validation
        if (formData.email) {
          const emailLower = formData.email.toLowerCase();
          if (emailLower.includes("gmail,com") || emailLower.includes("gnail.com") || emailLower.includes("gmai.com") || emailLower.includes("gmail.con")) {
            if (newErrors.email !== "Periksa kembali penulisan domain email Anda (seharusnya @gmail.com)") {
              newErrors.email = "Periksa kembali penulisan domain email Anda (seharusnya @gmail.com)";
              changed = true;
            }
          } else {
            if (newErrors.email === "Periksa kembali penulisan domain email Anda (seharusnya @gmail.com)") {
              newErrors.email = "";
              changed = true;
            }
          }
        }

        // Realtime password match validation
        if (formData.confirmPassword) {
          if (formData.password !== formData.confirmPassword) {
            if (newErrors.confirmPassword !== "Password dan Konfirmasi Password tidak sama!") {
              newErrors.confirmPassword = "Password dan Konfirmasi Password tidak sama!";
              changed = true;
            }
          } else {
            if (newErrors.confirmPassword === "Password dan Konfirmasi Password tidak sama!") {
              newErrors.confirmPassword = "";
              changed = true;
            }
          }
        }

        return changed ? newErrors : prev;
      });
    }, 800); // Jeda 800ms

    return () => clearTimeout(timeoutId);
  }, [formData.email, formData.password, formData.confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;

    // Validasi email typo (contoh: gmail,com)
    const emailLower = formData.email.toLowerCase();
    if (emailLower.includes("gmail,com") || emailLower.includes("gnail.com") || emailLower.includes("gmai.com") || emailLower.includes("gmail.con")) {
      newErrors.email = "Periksa kembali penulisan domain email Anda (seharusnya @gmail.com)";
      hasError = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password harus minimal 6 karakter";
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password dan Konfirmasi Password tidak sama!";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        router.push("/login");
      } else {
        if (data.error && data.error.toLowerCase().includes("email")) {
          setErrors(prev => ({ ...prev, email: data.error }));
        } else if (data.error && data.error.toLowerCase().includes("username")) {
          setErrors(prev => ({ ...prev, name: data.error }));
        } else {
          setGlobalError(data.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setGlobalError("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side: Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a2b4b] mb-2">{t("title")}</h1>
            <p className="text-gray-500">
              {t("description")}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {globalError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium text-center border border-red-100 mb-4">
                {globalError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-[#1a2b4b] mb-1.5">
                {t("nameLabel")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                  }}
                  placeholder={t("namePlaceholder")}
                  className={cn(
                    "w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm",
                    errors.name
                      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                      : !errors.name && formData.fullName.length >= 2 && !isCheckingName
                      ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
                      : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                  )}
                  required
                />
                {/* Status icon on the right */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingName && (
                    <svg className="animate-spin w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {!isCheckingName && formData.fullName.length >= 2 && errors.name && (
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {!isCheckingName && formData.fullName.length >= 2 && !errors.name && (
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              {isCheckingName && (
                <p className="text-blue-400 text-xs mt-1.5 font-medium">Mengecek ketersediaan username...</p>
              )}
              {!isCheckingName && errors.name && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
              )}
              {!isCheckingName && !errors.name && formData.fullName.length >= 2 && (
                <p className="text-green-500 text-xs mt-1.5 font-medium">Username tersedia ✓</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a2b4b] mb-1.5">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder={t("emailPlaceholder")}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm",
                  errors.email ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                )}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>



            <div>
              <label className="block text-sm font-semibold text-[#1a2b4b] mb-1.5">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder={t("passwordPlaceholder")}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm pr-12",
                    errors.password ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-semibold text-[#1a2b4b] mb-1.5">
                {t("confirmPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all text-sm pr-12",
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 mt-4",
                "bg-[#f9c51a] text-[#1a2b4b] hover:bg-[#eab308] active:scale-[0.98]",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? t("registering") : t("submit")}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              {/* <span className="relative px-4 bg-white text-gray-400 text-xs font-medium">{commonT("or")}</span> */}
            </div>

            {/* <button
              type="button"
              className="w-full py-2.5 rounded-xl border border-gray-200 flex items-center justify-center gap-3 text-sm font-medium text-[#1a2b4b] hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {commonT("google")}
            </button> */}

            <p className="text-center text-sm text-gray-500 mt-6">
              {t("haveAccount")}{" "}
              <Link href="/login" className="text-yellow-500 font-bold hover:underline">
                {t("login")}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side: Map Illustration */}
      <div className="hidden md:flex w-1/2 bg-[#002b5b] items-center justify-center p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 w-full max-w-lg">
          <div className="relative h-[400px]">
            {/* Map Path Line (dashed) */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
               <path d="M50,300 Q150,250 200,150 T350,50" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10,10" />
            </svg>

            {/* Travel Icons */}
            <div className="absolute left-[40px] bottom-[80px] bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 animate-bounce">
               <MapPin className="text-blue-400 w-8 h-8" />
            </div>

            <div className="absolute right-[80px] top-[40px] bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
               <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="text-white w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-12 bg-white/30 rounded" />
                    <div className="h-1.5 w-8 bg-white/30 rounded" />
                  </div>
               </div>
            </div>

            {/* Illustration Mockup Characters */}
            <div className="absolute left-1/4 top-1/3 flex flex-col items-center">
                <div className="w-24 h-40 bg-orange-500/20 rounded-full blur-xl absolute -z-10" />
                <div className="relative w-16 h-16 bg-[#ff6b6b] rounded-full border-4 border-white/20 shadow-xl" />
                <div className="w-20 h-32 bg-yellow-400 rounded-t-3xl mt-[-10px]" />
            </div>

            <div className="absolute right-1/4 bottom-1/4 flex flex-col items-center">
                <div className="w-24 h-40 bg-green-500/20 rounded-full blur-xl absolute -z-10" />
                <div className="relative w-16 h-16 bg-[#ff8e3c] rounded-full border-4 border-white/20 shadow-xl" />
                <div className="w-24 h-24 bg-green-500 rounded-full mt-4 flex items-center justify-center">
                   <div className="w-20 h-20 rounded-full border-4 border-white/40" />
                </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
               <Navigation className="w-48 h-48 text-white rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
