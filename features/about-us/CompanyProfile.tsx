"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CompanyProfile() {
  const t = useTranslations("About.profile");

  const services = [
    t("service1"),
    t("service2"),
    t("service3"),
    t("service4"),
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-20 grid md:grid-cols-2 gap-8 md:gap-10 items-center">

      {/* IMAGE */}
      <div className="relative w-full h-64 md:h-95 order-1 md:order-2">
        <Image
          src="/images/company-profile.png"
          alt="company"
          fill
          className="rounded-2xl object-cover"
        />
      </div>

      {/* TEXT */}
      <div className="order-2 md:order-1 text-justify md:text-left">
        <h2 className="text-2xl md:text-4xl font-medium text-gray-800 mb-4 text-center md:text-left">
          {t("title")}
        </h2>

        <p className="text-sm md:text-lg text-gray-600 mb-4">
          {t("description")}
        </p>

        <ul className="text-sm md:text-lg space-y-3 text-gray-600">
          <li className="font-semibold text-gray-800">{t("servicesTitle")}</li>

          {services.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="p-2 bg-green-50 rounded-full">
              <Check className="w-4 h-4 mt-0 md:mt-1 text-green-500 shrink-0" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      

    </div>
    
  );
}